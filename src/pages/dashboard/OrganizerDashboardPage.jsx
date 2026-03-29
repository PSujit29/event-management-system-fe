import { Calendar, Clock, Sparkles } from "lucide-react";
import deriveEventStatus from "../../utils/status.utils";

export default function DashboardContent({
  events = [],
  subEvents = [],
}) {
  const eventsWithStatus = events.map((event) => ({
    ...event,
    status: deriveEventStatus(event.startDate, event.startTime, event.duration),
  }));

  const totalEvents = eventsWithStatus.length;
  const activeNow = eventsWithStatus.filter((e) => e.status === "Ongoing").length;
  const upcoming = eventsWithStatus.filter((e) => e.status === "Upcoming").length;

  const sortedByStart = [...eventsWithStatus].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );
  const upcomingEvents = sortedByStart.filter((e) => e.status !== "Completed").slice(0, 5);

  const mostRecentEvent = [...events].sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate)
  )[0];

  const formatDate = (iso) =>
    new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-gray-400">Command Center</p>
          <h2 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h2>
        </div>

      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-gray-500">
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-medium">Total Events</span>
          </div>
          <p className="mt-3 text-3xl font-semibold text-gray-900">{totalEvents}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-gray-500">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">Active Now</span>
          </div>
          <p className="mt-3 text-3xl font-semibold text-gray-900">{activeNow}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-gray-500">
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-medium">Upcoming</span>
          </div>
          <p className="mt-3 text-3xl font-semibold text-gray-900">{upcoming}</p>
        </div>
      </div>

      {/* Upcoming Events + Spotlight */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400">
                <tr className="border-b border-gray-100">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Start Date</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingEvents.length === 0 ? (
                  <tr>
                    <td className="py-4 text-gray-500" colSpan="3">
                      No upcoming events.
                    </td>
                  </tr>
                ) : (
                  upcomingEvents.map((event) => (
                    <tr key={event.eventId} className="border-b border-gray-50">
                      <td className="py-3 font-medium text-gray-900">{event.name}</td>
                      <td className="py-3 text-gray-600">{formatDate(event.startDate)}</td>
                      <td className="py-3">
                        <span className="rounded-full border border-gray-200 px-2 py-1 text-xs text-gray-600">
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-gray-900">
            <Sparkles className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold">Sub-Event Spotlight</h3>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {mostRecentEvent ? mostRecentEvent.name : "No recent event found"}
          </p>
          <div className="mt-4 space-y-3">
            {subEvents.length === 0 ? (
              <div className="text-sm text-gray-500">No sub-events found.</div>
            ) : (
              subEvents.slice(0, 4).map((sub) => (
                <div
                  key={sub.subEventId}
                  className="rounded-lg border border-gray-100 p-3"
                >
                  <p className="text-sm font-medium text-gray-900">{sub.name}</p>
                  <p className="text-xs text-gray-500">{formatDate(sub.startDate)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}