import apiClient from "../lib/apiClient";
import { getUserById } from "./auth.service";

const USE_MOCK_EVENTS = import.meta.env.VITE_USE_MOCK_EVENTS === "true";

function getStoredUser() {
  const rawUser = localStorage.getItem("user");
  if (!rawUser || rawUser === "undefined" || rawUser === "null") return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

function getCurrentStudentId() {
  const user = getStoredUser();
  return user?.id ?? user?.userId ?? user?.studentId ?? null;
}

function getAllRegistrations() {
  const existingRaw = localStorage.getItem("all_registrations");
  return existingRaw ? JSON.parse(existingRaw) : [];
}

function saveAllRegistrations(registrations) {
  localStorage.setItem("all_registrations", JSON.stringify(registrations));
}

function normalizeAttendanceStatus(value) {
  if (value === "Present" || value === "Absent") return value;
  return "Pending";
}

function normalizeAttendeeData(registration = {}, user = {}) {
  const studentId = registration.studentId ?? user.id ?? user.userId ?? null;
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  return {
    registrationId:
      registration.registrationId ??
      `${String(studentId ?? "unknown")}-${String(registration.registrationDate ?? Date.now())}`,
    eventId: registration.eventId ?? null,
    studentId,
    name: registration.name ?? user.name ?? (fullName || null),
    email: registration.email ?? user.email ?? null,
    rollNumber: registration.rollNumber ?? registration.roll ?? user.rollNumber ?? user.roll ?? null,
    registrationDate: registration.registrationDate ?? new Date().toISOString(),
    attendanceStatus: registration.attendanceStatus ?? "Pending",
  };
}

async function resolveStudentDetails(registration = {}) {
  const studentId = registration.studentId;
  if (!studentId) return {};

  try {
    const user = await getUserById(studentId);
    return user ?? {};
  } catch {
    return {};
  }
}


function normalizeEventRegistrationData(eventId) {
  const studentId = getCurrentStudentId();

  return {
    "message": "Successfully registered for the event",
    "registration": {
      "registrationId": Date.now(),
      "eventId": String(eventId),
      "studentId": studentId,
      "registrationDate": new Date().toISOString(),
      "attendanceStatus": "Pending"
    }
  }
}


export async function registerForEvent(eventId) {
  if (USE_MOCK_EVENTS) {
    const regEventData = normalizeEventRegistrationData(eventId);

    const allRegistrations = getAllRegistrations();

    const isAlreadyRegistered = allRegistrations.some(
      (reg) =>
        String(reg.eventId) === String(eventId) &&
        String(reg.studentId ?? "") === String(regEventData.registration.studentId ?? ""),
    );

    if (!isAlreadyRegistered) {
      allRegistrations.push(regEventData.registration);
      saveAllRegistrations(allRegistrations);
      return regEventData;
    }

    const error = new Error("You are already registered for this event");
    error.status = 409;
    throw error;
  }

  const { data } = await apiClient.post(`events/${eventId}/register`);
  return data;
}


export async function cancelRegistration(eventId) {
  if (USE_MOCK_EVENTS) {
    const allRegistrations = getAllRegistrations();
    const studentId = getCurrentStudentId();

    const updatedRegistrations = allRegistrations.filter(
      (reg) =>
        !(
          String(reg.eventId) === String(eventId) &&
          String(reg.studentId ?? "") === String(studentId ?? "")
        ),
    );

    saveAllRegistrations(updatedRegistrations);

    return { success: true, message: "Registration cancelled locally" };
  }

  const { data } = await apiClient.delete(`events/${eventId}/register`);
  return data;
}


export async function getEventAttendees(eventId) {
  if (USE_MOCK_EVENTS) {
    const allRegistrations = getAllRegistrations();

    const eventAttendees = allRegistrations.filter((reg) => String(reg.eventId) === String(eventId));

    const attendeesWithDetails = await Promise.all(
      eventAttendees.map(async (registration) => {
        const user = await resolveStudentDetails(registration);
        return normalizeAttendeeData(registration, user);
      }),
    );

    return attendeesWithDetails;
  }

  const { data } = await apiClient.get(`events/${eventId}/attendees`);

  const attendees = Array.isArray(data) ? data : [];
  return attendees.map((entry) => normalizeAttendeeData(entry, entry.user ?? entry.student ?? {}));
}


export async function getMyEvents() {
  if (USE_MOCK_EVENTS) {
    const allRegistrations = getAllRegistrations();
    const studentId = getCurrentStudentId();

    const myRegistrations = allRegistrations.filter(
      (reg) => String(reg.studentId ?? "") === String(studentId ?? ""),
    );
    localStorage.setItem("my_registrations", JSON.stringify(myRegistrations));
    return myRegistrations;
  }

  const { data } = await apiClient.get("users/me/events");
  return data;
}
//sample expected json for getMyEvents() in mock mode:
// [
//   {
//     "registrationId": "1234567890",
//     "eventId": "1",
//     "studentId": "42",
//     "registrationDate": "2024-07-01T12:00:00Z",
//     "attendanceStatus": "Pending"
//   },
//   {
//     "registrationId": "0987654321",
//     "eventId": "2",
//     "studentId": "42",
//     "registrationDate": "2024-07-02T15:30:00Z",
//     "attendanceStatus": "Present"
//   }
// ]



export async function updateAttendeeAttendanceStatus(eventId, studentId, attendanceStatus) {
  const normalizedStatus = normalizeAttendanceStatus(attendanceStatus);

  if (USE_MOCK_EVENTS) {
    const allRegistrations = getAllRegistrations();

    const targetIndex = allRegistrations.findIndex(
      (reg) =>
        String(reg.eventId) === String(eventId) &&
        String(reg.studentId ?? "") === String(studentId ?? ""),
    );

    if (targetIndex === -1) {
      throw new Error("Attendee registration not found");
    }

    const updatedRegistration = {
      ...allRegistrations[targetIndex],
      attendanceStatus: normalizedStatus,
    };

    allRegistrations[targetIndex] = updatedRegistration;
    saveAllRegistrations(allRegistrations);

    const user = await resolveStudentDetails(updatedRegistration);
    return normalizeAttendeeData(updatedRegistration, user);
  }

  const { data } = await apiClient.patch(`events/${eventId}/attendees/${studentId}`, {
    attendanceStatus: normalizedStatus,
  });

  return normalizeAttendeeData(data?.registration ?? data, data?.user ?? data?.student ?? {});
}

