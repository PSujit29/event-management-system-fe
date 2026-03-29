import apiClient from "../lib/apiClient";

const USE_MOCK_EVENTS = import.meta.env.VITE_USE_MOCK_EVENTS === "true";

export async function registerForEvent(eventId) {

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
