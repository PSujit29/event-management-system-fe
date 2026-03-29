import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { deleteEvent, getEventById, getSubEvents } from "../../services/event.service";
import { useAuth } from "../../hooks/useAuth";
import deriveEventStatus from "../../utils/status.utils";

import EventBackButton from "../../components/events/EventBackButton";
import EventOverview from "../../components/events/EventOverview";
import EventFlow from "../../components/events/EventFlow";
import EventRegistrationActionButton from "../../components/events/EventRegistrationActionButton";

export default function EventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [subEvents, setSubEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [subEventError, setSubEventError] = useState(null);

  const role = (user?.role || "").toLowerCase();
  const isStudent = role === "student";
  const allowedToManage = role === "admin" || role === "teacher";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load event");
        setLoading(false);
        return;
      }

      try {
        const subEventData = await getSubEvents(eventId);
        setSubEvents(subEventData);
        setEvent((prev) => (prev ? { ...prev, subEvents: subEventData } : prev));
        setSubEventError(null);
      } catch (err) {
        setSubEventError(err.message || "Failed to load sub-events");
        setSubEvents([]);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchData();
  }, [eventId]);

  const handleDeleteEvent = async () => {
    if (!eventId || isDeleting) return;

    const isConfirmed = window.confirm("Are you sure you want to delete this event?");
    if (!isConfirmed) return;

    try {
      setIsDeleting(true);
      await deleteEvent(eventId);
      toast.success("Event deleted successfully");
      navigate("/user/events");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to delete event";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditEvent = () => {
    const status = deriveEventStatus(event.startDate, event.startTime, event.duration);
    if (status !== "Upcoming") {
      toast.error("Only upcoming events can be edited");
      return;
    }
    navigate("/user/events/edit/" + eventId);
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="space-y-4 rounded-2xl bg-slate-100 p-5 md:p-6">
        <EventBackButton />
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">Loading event...</div>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="space-y-4 rounded-2xl bg-slate-100 p-5 md:p-6">
        <EventBackButton />
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">Error: {error}</div>
      </div>
    );
  }

  // 3. Not Found State
  if (!event) {
    return (
      <div className="space-y-4 rounded-2xl bg-slate-100 p-5 md:p-6">
        <EventBackButton />
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">Event not found</div>
      </div>
    );
  }

  // 4. Success State
  return (
    <div className="space-y-6 rounded-2xl bg-slate-100 p-5 md:p-6">
      <div className="flex justify-between">
        <EventBackButton />
        {isStudent && <EventRegistrationActionButton eventId={eventId} initialIsRegistered={Boolean(event?.isRegistered)} />}
      </div>
      <EventOverview
        event={event}
        allowed={allowedToManage}
        canEdit={allowedToManage && deriveEventStatus(event.startDate, event.startTime, event.duration) === "Upcoming"}
        isDeleting={isDeleting}
        onDelete={handleDeleteEvent}
        onEdit={handleEditEvent}
      />

      {subEventError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">Error loading sessions: {subEventError}</div>
      ) : (
        <EventFlow subEvents={subEvents} />
      )}
    </div>
  );
}
