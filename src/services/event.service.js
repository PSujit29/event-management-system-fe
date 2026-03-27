import apiClient from "../lib/apiClient";

function normalizeEventData(raw = {}) {
  return {
    eventId: raw.eventId ?? raw.id ?? null,
    name: raw.name ?? "",
    description: raw.description ?? "",
    eventUrl: raw.eventUrl ?? "",
    startDate: raw.startDate ?? null,
    duration: raw.duration ?? null,
    status: raw.status ?? "",
  };
}

function normalizeSubEventData(raw = {}) {
  return {
    subEventId: raw.subEventId ?? raw.id ?? null,
    eventId: raw.eventId ?? null,
    name: raw.name ?? "",
    description: raw.description ?? "",
    startDate: raw.startDate ?? null,
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

export async function getEvents(params = {}) {
  const { data } = await apiClient.get("events", { params });
  return toArray(data).map(normalizeEventData);
}

export async function getEventById(eventId) {
  const { data } = await apiClient.get(`events/${eventId}`);
  return normalizeEventData(pickEventPayload(data));
}

export async function createEvent(payload) {
  const { data } = await apiClient.post("events", payload);
  return normalizeEventData(pickEventPayload(data));
}

export async function updateEvent(eventId, payload) {
  const { data } = await apiClient.put(`events/${eventId}`, payload);
  return normalizeEventData(pickEventPayload(data));
}

export async function deleteEvent(eventId) {
  const { data } = await apiClient.delete(`events/${eventId}`);
  return {
    message: data?.message ?? "Event deleted",
    eventId: data?.eventId ?? eventId,
  };
}

export async function getSubEvents(eventId) {
  const { data } = await apiClient.get(`events/${eventId}/sub-events`);
  return toArray(data).map(normalizeSubEventData);
}

export async function createSubEvent(eventId, payload) {
  const { data } = await apiClient.post(`events/${eventId}/sub-events`, payload);
  return normalizeSubEventData(pickSubEventPayload(data));
}