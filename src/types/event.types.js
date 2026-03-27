/** @typedef {'Upcoming' | 'Ongoing' | 'Completed' | 'Past'} EventStatus */
/** @typedef {{ eventId: number|string, name: string, description?: string, eventUrl?: string, startDate: string, duration: number, status: EventStatus }} Event */
/** @typedef {{ subEventId: number|string, eventId: number|string, name: string, description?: string, startDate: string, duration: number }} SubEvent */

export const EventStatusEnum = Object.freeze({
  UPCOMING: "Upcoming",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  PAST: "Past",
});
