import { Calendar, Clock, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function EventsSection({ events = [], onCreateEvent }) {
  const { user } = useAuth();
  const role = (user?.role || "").toLowerCase();
  const canCreateEvent = role === "admin" || role === "teacher";

  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Events</h2>
        <span className="text-sm text-gray-500">{events.length} total</span>
        {canCreateEvent && (
          <Link
            to="/user/events/create"
            onClick={onCreateEvent}
            className="inline-flex items-center gap-2 cursor-pointer transition hover:scale-[98%] rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" />
            Create New Event
          </Link>
        )}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {events.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No events available.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {events.map((event) => (
              <li key={event.eventId} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.name}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(event.startDate)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {event.duration} hrs
                    </span>
                  </div>
                </div>
                <span className="rounded-full border border-gray-200 px-2 py-1 text-xs text-gray-600">{event.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
