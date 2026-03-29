import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { deleteEvent, getEventById } from "../../services/event.service";
import { useAuth } from "../../hooks/useAuth";

import EventBackButton from "../../components/events/EventBackButton";
import EventOverview from "../../components/events/EventOverview";
import EventFlow from "../../components/events/EventFlow";

export default function EventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const[error, setError] = useState(null);

  const role = (user?.role || "").toLowerCase();
  const isAdmin = role === "admin";

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventById(eventId);
        setEvent(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load event");
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchEvent();
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

  // 1. Loading State
  if (loading) {
    return (
      <div className="space-y-4 rounded-2xl bg-slate-100 p-5 md:p-6">
        <EventBackButton />
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          Loading event...
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="space-y-4 rounded-2xl bg-slate-100 p-5 md:p-6">
        <EventBackButton />
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  // 3. Not Found State
  if (!event) {
    return (
      <div className="space-y-4 rounded-2xl bg-slate-100 p-5 md:p-6">
        <EventBackButton />
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Event not found
        </div>
      </div>
    );
  }

  // 4. Success State
  return (
    <div className="space-y-6 rounded-2xl bg-slate-100 p-5 md:p-6">
      <EventBackButton />

      <EventOverview 
        event={event} 
        isAdmin={isAdmin} 
        isDeleting={isDeleting} 
        onDelete={handleDeleteEvent} 
      />

      <EventFlow subEvents={event.subEvents} />
    </div>
  );
}