import { HiMenu } from "react-icons/hi";
import { useAuth } from "../../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";

export const UserHeader = () => {
  const { user } = useAuth();
  const location = useLocation();
  const role = (user?.role || "").toLowerCase();
  const isOrganizer = role === "admin" || role === "teacher";
  const isAdmin = role === "admin";

  const titles = {
    "/user": "Dashboard",
    "/user/events": "Events",
    "/user/events/create": "Create Event",
    "/user/templates": "Templates",
    "/user/me": "Profile",
    "/user/me/events": "My Events",
    "/user/settings": "Settings",
  };

  const getTitle = (path) => {
    const normalizedPath = path.replace(/\/$/, "");

    if (normalizedPath.match(/^\/user\/events\/[^/]+\/attendees$/)) return "Event Attendees";
    if (normalizedPath.match(/^\/user\/events\/[^/]+$/)) return "Event Detail";
    if (normalizedPath.match(/^\/user\/templates\/[^/]+\/clone$/)) return "Clone Template";
    if (normalizedPath.match(/^\/user\/templates\/[^/]+$/)) return "Template Detail";

    return titles[normalizedPath] || "Dashboard";
  };

  const getHeaderAction = (path) => {
    const normalizedPath = path.replace(/\/$/, "");
    const eventDetailMatch = normalizedPath.match(/^\/user\/events\/([^/]+)$/);
    const templateDetailMatch = normalizedPath.match(/^\/user\/templates\/([^/]+)$/);

    if (normalizedPath === "/user/events" && isOrganizer) {
      return { label: "Create Event", to: "/user/events/create", roles: ["admin", "teacher"] };
    }

    if (eventDetailMatch && isOrganizer) {
      return { label: "Attendees", to: `/user/events/${eventDetailMatch[1]}/attendees`, roles: ["admin", "teacher"] };
    }

    if (templateDetailMatch && isAdmin) {
      return { label: "Clone", to: `/user/templates/${templateDetailMatch[1]}/clone`, roles: ["admin"] };
    }

    return null;
  };

  const currentPath = location.pathname;
  const currentTitle = getTitle(currentPath);
  const headerAction = getHeaderAction(currentPath);

  return (
    <header className="bg-white shadow-sm px-4 md:px-8 py-3 flex justify-between items-center border-b border-slate-200 z-10 relative">
      <div className="flex items-center gap-3">
        <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
          <HiMenu className="w-6 h-6" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">{currentTitle}</h1>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {headerAction && headerAction.roles.includes(role) && (
          <Link
            to={headerAction.to}
            className="inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            {headerAction.label}
          </Link>
        )}

        <span className="text-sm md:text-base text-slate-600 font-medium hidden sm:block">
          Welcome, <strong className="text-slate-900">{user?.name ?? user?.firstName}</strong>
        </span>

        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-orange-50 border-2 border-orange-500 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:ring-2 hover:ring-orange-400 hover:ring-offset-2 transition-all">
          <img src={user?.image} className="w-full h-full object-cover" alt="Admin Avatar" />
        </div>
      </div>
    </header>
  );
};
