import { FaRegClone, FaRegClock, FaLayerGroup, FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import deriveEventStatus from "../../utils/status.utils";

export default function EventCard({ events, userRole, onRefresh, onCreate }) {
  // role-based check: e.g., 'admin' or 'teacher'
  const canCreate = userRole === "admin" || userRole === "teacher";
  const statusStyles = {
    Upcoming: "bg-blue-100 text-blue-700",
    Ongoing: "bg-emerald-100 text-emerald-700",
    Completed: "bg-slate-100 text-slate-600",
  };
  return (
    <>
      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white py-16 px-6 text-center shadow-sm">
          <div className="rounded-full bg-slate-50 p-4">
            <FaRegClone className="h-10 w-10 text-slate-400" />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-slate-900">No events found</h3>
          <p className="mt-2 max-w-xs text-sm text-slate-500">
            {canCreate
              ? "Get started by creating your first event for the students."
              : "There are no events scheduled. Check back later or try refreshing."}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {canCreate && (
              <button
                onClick={onCreate}
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-900 transition-all hover:bg-amber-600 active:scale-95"
              >
                Create Event
              </button>
            )}

            <button
              onClick={onRefresh}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-95"
            >
              <FaRegClock className="h-4 w-4" />
              Refresh Page
            </button>
          </div>
        </div>
      ) : (
        /* The Card Grid */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 cursor-pointer">
          {events.map((event) => (
            <div
              key={event.eventId}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-amber-300 hover:shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-slate-900 transition-colors duration-300 group-hover:text-slate-950">
                    {event.name}
                  </h3>
                  {/* Status Badge */}

                  {(() => {
                    const eventStatus = deriveEventStatus(event.startDate, event.startTime, event.duration);
                    return (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          statusStyles[eventStatus] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {eventStatus}
                      </span>
                    );
                  })()}
                </div>

                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                  {event.description || "No description provided for this event."}
                </p>

                {/* Aligned Info Section */}
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <div className="grid grid-cols-2 gap-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <FaRegClock className="h-4 w-4 text-slate-400" />
                      <span>{event.duration || 0} Hours</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <FaLayerGroup className="h-4 w-4 text-amber-600" />
                      <span>{event.subEvents?.length || 0} Sessions</span>
                    </div>
                    {/* Start Date Added */}
                    <div className="col-span-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                      <span className="text-slate-400">Starts:</span>
                      {event.startDate ? new Date(event.startDate).toLocaleDateString() : "TBD"}
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to={`/user/events/${event.eventId}/`}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-amber-500 hover:text-slate-950 active:scale-95"
              >
                View Details
                <FaArrowRightLong className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
