import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import EventCard from "./EventCard";

export default function EventsSection({ events = [], onCreateEvent }) {
  const { user } = useAuth();
  const role = (user?.role || "").toLowerCase();
  const canCreateEvent = role === "admin" || role === "teacher";

  // const formatDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Events</h2>
        <span className="text-sm text-gray-500">{events.length} total</span>
        {canCreateEvent && (
          <Link
            to="/user/events/create"
            onClick={onCreateEvent}
            className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition hover:scale-[98%] hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" />
            Create New Event
          </Link>
        )}
      </div>
      <EventCard events={events} />
    </section>
  );
}
