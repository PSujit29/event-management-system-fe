import apiClient from "../lib/apiClient";

function normalizeEventData(raw = {}) {
  const normalizedEventId = raw.eventId ?? raw.id ?? null;
  const normalizedStartDate = raw.startDate ?? null;

  return {
    eventId: normalizedEventId,
    name: raw.name ?? "",
    description: raw.description ?? "",
    eventUrl: raw.eventUrl ?? "",
    startDate: normalizedStartDate,
    duration: raw.duration ?? null,
    status: raw.status ?? "",
    subEvents: toArray(raw.subEvents).map((subEvent, index) =>
      normalizeSubEventData(subEvent, {
        eventId: normalizedEventId,
        startDate: normalizedStartDate,
        index,
      }),
    ),
  };
}

function normalizeSubEventData(raw = {}, parent = {}) {
  const fallbackSubEventId =
    parent?.eventId != null && parent?.index != null
      ? Number(`${parent.eventId}${parent.index + 1}`)
      : null;

  return {
    subEventId: raw.subEventId ?? raw.id ?? fallbackSubEventId,
    eventId: raw.eventId ?? parent.eventId ?? null,
    name: raw.name ?? "",
    description: raw.description ?? "",
    startDate: raw.startDate ?? parent.startDate ?? null,
    duration: raw.duration ?? null,
  };
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function pickEventPayload(data) {
  // Handles both:
  // { message, event: {...} } and direct {...}
  return data?.event ?? data;
}

function pickSubEventPayload(data) {
  // Handles both:
  // { message, subEvent: {...} } and direct {...}
  return data?.subEvent ?? data;
}

const USE_MOCK_EVENTS = import.meta.env.VITE_USE_MOCK_EVENTS === "true";

const mockEvents = [
  {
    "eventId": 1,
    "name": "Annual Tech Symposium 2026",
    "description": "The biggest tech gathering of the year.",
    "eventUrl": "tech-symposium-2026",
    "startDate": "2026-05-10T09:00:00Z",
    "duration": 48,
    "status": "Upcoming"
  },
  {
    "eventId": 2,
    "name": "Spring Hackathon",
    "description": "24-hour coding challenge.",
    "eventUrl": "spring-hackathon-2026",
    "startDate": "2026-04-15T18:00:00Z",
    "duration": 24,
    "status": "Ongoing"
  }
];
const mockEventCreateResponse = {
  "message": "Event created successfully",
  "event": {
    "eventId": 3,
    "name": "Cultural Fest 2026",
    "description": "Annual college cultural festival showcasing student talents.",
    "eventUrl": "cultural-fest-2026",
    "startDate": "2026-10-20T10:00:00Z",
    "duration": 72,
    "status": "Upcoming"
  }
};
const mockEventUpdateResponse = {
  "message": "Event updated successfully",
  "event": {
    "eventId": 3,
    "name": "Cultural Fest 2026",
    "description": "Updated description: Now featuring guest artist XYZ!",
    "eventUrl": "cultural-fest-2026",
    "startDate": "2026-10-20T10:00:00Z",
    "duration": 72,
    "status": "Ongoing"
  }
}
const mockEventDeleteResponse = {
  "message": "Event deleted successfully",
  "eventId": 3
};

const mockSubEvents = [
  {
    "subEventId": 101,
    "eventId": 1,
    "name": "Opening Ceremony",
    "description": "Kickoff and keynote speech.",
    "startDate": "2026-05-10T09:00:00Z",
    "duration": 2
  },
  {
    "subEventId": 102,
    "eventId": 1,
    "name": "Web Dev Workshop",
    "description": "Hands-on React workshop.",
    "startDate": "2026-05-10T12:00:00Z",
    "duration": 3
  }
];

const mockSubEventCreateResponse = {
  "message": "Sub-event added successfully",
  "subEvent": {
    "subEventId": 101,
    "eventId": 1,
    "name": "Opening Ceremony",
    "description": "Kickoff and keynote speech.",
    "startDate": "2026-05-10T09:00:00Z",
    "duration": 2
  }
}


// I dont have backend ready, so mock events data in development mode if USE_MOCK_EVENTS is true
// TODO: REMOVE mock data and related code once backend is ready and tested
export async function getEvents(params = {}) {
  if (USE_MOCK_EVENTS) {
    console.log("Using mock events data");
    const storedEvents = JSON.parse(localStorage.getItem("all_events") || "[]")
    const mergedEvents = [...mockEvents, ...storedEvents];
    return mergedEvents.map(normalizeEventData);
  }
  else {
    const { data } = await apiClient.get("events", { params });
    return toArray(data).map(normalizeEventData);
  }
}

export async function getEventById(eventId) {
  if (USE_MOCK_EVENTS) {
    const storedEvents = JSON.parse(localStorage.getItem("all_events") || "[]");
    const mergedEvents = [...mockEvents, ...storedEvents];
    const matchedEvent = mergedEvents.find((event) => String(event.eventId) === String(eventId));

    return matchedEvent ? normalizeEventData(matchedEvent) : null;
  }
  else {
    const { data } = await apiClient.get(`events/${eventId}`);
    return normalizeEventData(pickEventPayload(data));
  }
}

export async function createEvent(payload) {
  if (USE_MOCK_EVENTS) {
    return normalizeEventData({
      ...mockEventCreateResponse.event,
      ...payload,
      eventId: Math.floor(Date.now() / 1000)
    });
  }
  else {
    const { data } = await apiClient.post("events", payload);
    return normalizeEventData(pickEventPayload(data));
  }
}

export async function updateEvent(eventId, payload) {
  if (USE_MOCK_EVENTS) {
    console.log("Using mock event update response");
    return normalizeEventData(pickEventPayload(mockEventUpdateResponse));
  }
  else {
    const { data } = await apiClient.put(`events/${eventId}`, payload);
    return normalizeEventData(pickEventPayload(data));
  }
}

export async function deleteEvent(eventId) {
  if (USE_MOCK_EVENTS) {
    const storedEvents = JSON.parse(localStorage.getItem("all_events") || "[]");
    const filteredEvents = storedEvents.filter((event) => String(event.eventId) !== String(eventId));
    localStorage.setItem("all_events", JSON.stringify(filteredEvents));

    return {
      message: mockEventDeleteResponse.message,
      eventId: Number(eventId),
    };
  }
  else {

    const { data } = await apiClient.delete(`events/${eventId}`);
    return {
      message: data?.message ?? "Event deleted",
      eventId: data?.eventId ?? eventId,
    };
  }
};

export async function getSubEvents(eventId) {
  if (USE_MOCK_EVENTS) {
    console.log("Using mock sub-events data");
    return toArray(mockSubEvents).map(normalizeSubEventData);
  }
  else {
    const { data } = await apiClient.get(`events/${eventId}/sub-events`);
    return toArray(data).map(normalizeSubEventData);
  }
}

export async function createSubEvent(eventId, payload) {
  if (USE_MOCK_EVENTS) {
    console.log("Using mock sub-event create response");
    return normalizeSubEventData(pickSubEventPayload(mockSubEventCreateResponse));
  }
  else {
    const { data } = await apiClient.post(`events/${eventId}/sub-events`, payload);
    return normalizeSubEventData(pickSubEventPayload(data));
  }
}