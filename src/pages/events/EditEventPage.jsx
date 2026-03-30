import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EditEventForm from "../../components/events/EditEventForm";
import { getEventById } from "../../services/event.service";
import deriveEventStatus from "../../utils/status.utils";
import { parseApiError } from "../../utils/error.utils";

export default function EditEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const event = await getEventById(eventId);
        setEventData(event);
        setError(null);
      } catch (err) {
          const errorMessage = parseApiError(err, "Failed to load event");
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchEvent();
  }, [eventId]);

  // Loading State
  if (loading) {
    return (
      <div className="max-w-3xl bg-white mx-auto p-10 rounded-xl shadow-sm">
        <p className="text-slate-600">Loading event...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-3xl bg-white mx-auto p-10 rounded-xl shadow-sm">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 mb-4">
          Error: {error}
        </div>
        <button
          onClick={() => navigate("/user/events")}
          className="px-4 py-2 bg-slate-200 rounded-md hover:bg-slate-300"
        >
          Back to Events
        </button>
      </div>
    );
  }

  // Not Found State
  if (!eventData) {
    return (
      <div className="max-w-3xl bg-white mx-auto p-10 rounded-xl shadow-sm">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 mb-4">
          Event not found
        </div>
        <button
          onClick={() => navigate("/user/events")}
          className="px-4 py-2 bg-slate-200 rounded-md hover:bg-slate-300"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const eventStatus = deriveEventStatus(eventData.startDate, eventData.startTime, eventData.duration);

  if (eventStatus !== "Upcoming") {
    return (
      <div className="max-w-3xl bg-white mx-auto p-10 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold mb-5">Edit Event</h1>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 mb-4">
          Event cannot be edited because it is currently "{eventStatus}". Only upcoming events can be edited.
        </div>
        <button
          onClick={() => navigate(`/user/events/${eventData.eventId}`)}
          className="px-4 py-2 bg-slate-200 rounded-md hover:bg-slate-300"
        >
          Back to Event
        </button>
      </div>
    );
  }

  // Success State
  return (
    <div className="max-w-3xl bg-white mx-auto p-10 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-5">Edit Event</h1>
      <EditEventForm eventData={eventData} />
    </div>
  );
}