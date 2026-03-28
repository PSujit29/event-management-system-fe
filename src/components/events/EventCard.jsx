import { FaRegClone, FaRegClock, FaLayerGroup, FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function EventCard({ events }) {

  return (
    <>
      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
          <FaRegClone className="h-12 w-12 text-slate-400" />
          <p className="mt-4 text-slate-600">No events available at the moment.</p>
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

                <h3 className="text-lg font-bold text-slate-900 transition-colors duration-300 group-hover:text-slate-950">
                  {event.name}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                  {event.description || "No description provided for this event."}
                </p>

                <div className="mt-4 flex items-center gap-4 border-t border-slate-200 pt-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <FaRegClock className="h-4 w-4 text-slate-500" />
                    {event.duration || 0} Hours
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <FaLayerGroup className="h-4 w-4 text-amber-600" />
                    {event.subEvents?.length || 0} Sessions
                  </div>
                </div>
              </div>

              <Link
                to={`/user/events/${event.eventId}/`}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-95 hover:bg-amber-500 hover:text-slate-950 active:scale-95"
              >
                View Details
                <FaArrowRightLong className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
