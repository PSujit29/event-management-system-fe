import apiClient from "../lib/apiClient";

const USE_MOCK_EVENTS = import.meta.env.VITE_USE_MOCK_EVENTS === "true";


function normalizeEventReistrationData(eventId) {
  return {
    "message": "Successfully registered for the event",
    "registration": {
      "registrationId": Date.now()/1000,
      "eventId": eventId,
      "studentId": localStorage.getItem("user").id ?? null,
      "registrationDate": Date.now(),
      "attendanceStatus": "Pending"
    }
  }
}


export async function registerForEvent(eventId) {
  if (USE_MOCK_EVENTS) {
    const regEventData=normalizeEventReistrationData(eventId)
    
    return regEventData
  }

  const { data } = await apiClient.post(`events/${eventId}/register`);
  return data;
}

export async function cancelRegistration(eventId) {
  const { data } = await apiClient.delete(`events/${eventId}/register`);
  return data;
}

export async function getEventAttendees(eventId) {
  const { data } = await apiClient.get(`events/${eventId}/attendees`);
  return data;
}

export async function getMyEvents() {
  const { data } = await apiClient.get("users/me/events");
  return data;
}
