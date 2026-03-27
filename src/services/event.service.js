import apiClient from "../lib/apiClient";

export async function getEvents(params = {}) {
  const { data } = await apiClient.get("events", { params });
  return data;
}

export async function getEventById(eventId) {
  const { data } = await apiClient.get(`events/${eventId}`);
  return data;
}

export async function createEvent(payload) {
  const { data } = await apiClient.post("events", payload);
  return data;
}

export async function updateEvent(eventId, payload) {
  const { data } = await apiClient.put(`events/${eventId}`, payload);
  return data;
}

export async function deleteEvent(eventId) {
  const { data } = await apiClient.delete(`events/${eventId}`);
  return data;
}

export async function getSubEvents(eventId) {
  const { data } = await apiClient.get(`events/${eventId}/sub-events`);
  return data;
}
