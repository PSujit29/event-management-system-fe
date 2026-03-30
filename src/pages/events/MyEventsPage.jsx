import React, { useState, useEffect } from "react";
import { Calendar, ChevronRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { getMyEvents } from "../../services/registration.service";
import { getEventById } from "../../services/event.service";
import deriveEventStatus from "../../utils/status.utils";
import { formatDate, formatTime } from "../../utils/date.utils";

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resolveRegistrationStatusClass = (status) => {
    if (status === "Present") return "bg-green-100 text-green-700";
    if (status === "Absent") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const resolveEventStatusClass = (status) => {
    if (status === "Completed") return "bg-slate-200 text-slate-700";
    if (status === "Ongoing") return "bg-blue-100 text-blue-700";
    return "bg-emerald-100 text-emerald-700";
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const registrations = await getMyEvents();

        const eventSummaries = await Promise.all(
          registrations.map(async (registration) => {
            try {
              const event = await getEventById(registration.eventId);
              const eventStatus = event ? deriveEventStatus(event.startDate, event.startTime, event.duration) : "Upcoming";

              return {
                ...registration,
                eventName: event?.name ?? `Event #${registration.eventId}`,
                eventDescription: event?.description ?? "Event summary unavailable.",
                eventStartDate: event?.startDate ?? null,
                eventStatus,
              };
            } catch {
              return {
                ...registration,
                eventName: `Event #${registration.eventId}`,
                eventDescription: "Event summary unavailable.",
                eventStartDate: null,
                eventStatus: "Upcoming",
              };
            }
          }),
        );

        setEvents(eventSummaries);
        setError(null);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load your registered events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Registered Events</h1>
          <p className="mt-2 text-gray-600">Manage your registrations and view upcoming schedules.</p>
        </header>

        {events.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">You haven't registered for any events yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            {events.map((reg) => (
              <div
                key={reg.registrationId}
                className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      ID: #{reg.eventId}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${resolveRegistrationStatusClass(reg.attendanceStatus)}`}
                    >
                      {reg.attendanceStatus}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${resolveEventStatusClass(reg.eventStatus)}`}
                    >
                      {reg.eventStatus}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900">{reg.eventName}</h3>

                  <p className="max-w-2xl text-sm text-gray-600">{reg.eventDescription}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      Registered: {reg.registrationDate ? formatDate(reg.registrationDate) : "N/A"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {reg.registrationDate ? formatTime(reg.registrationDate) : "N/A"}
                    </div>
                    {reg.eventStartDate && (
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        Starts: {formatDate(reg.eventStartDate)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center sm:mt-0">
                  <Link
                    to={`/user/events/${reg.eventId}`}
                    className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
                  >
                    View Details
                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventsPage;
