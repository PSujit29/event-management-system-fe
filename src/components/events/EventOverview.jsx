import { FaRegClock, FaArrowRightLong } from "react-icons/fa6";
import { HiTemplate } from "react-icons/hi";
import { MdEventNote } from "react-icons/md";
import { Link } from "react-router-dom";

export default function EventOverview({ event, allowed, isDeleting, onDelete, onEdit }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            <HiTemplate className="h-3.5 w-3.5" />
            Event Overview
          </div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{event.name}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">{event.description || "No description"}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-700">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 font-semibold">
              <FaRegClock className="h-4 w-4 text-slate-500" />
              Total Duration: {event.duration || 0} hrs
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 font-semibold text-amber-700">
              <MdEventNote className="h-4 w-4" />
              {event.subEvents?.length || 0} Sessions
            </span>
          </div>
        </div>

        {allowed && (
          <div className="flex items-center gap-2">
            <Link
              to={`/user/events/${event.eventId}/attendees`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:scale-95 hover:border-slate-300 hover:bg-slate-50"
            >
              Attendees
            </Link>

            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:scale-95 hover:border-slate-300 hover:bg-slate-50"
            >
              Edit Event
            </button>

            <button
              type="button"
              onClick={onDelete}
              disabled={isDeleting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-95 hover:bg-amber-500 hover:text-slate-950 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
            >
              {isDeleting ? "Deleting..." : "Delete Event"}
              <FaArrowRightLong className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
