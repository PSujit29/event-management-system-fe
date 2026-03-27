import { NavLink } from "react-router-dom";
import { HiChartPie, HiCalendar, HiUserGroup, HiTemplate, HiUserCircle, HiCog } from "react-icons/hi";
import { useAuth } from "../../hooks/useAuth";

const NAV_PATHS = {
  USER_HOME: "/user",
  EVENTS: "/user/events",
  EVENT_CREATE: "/user/events/create",
  MY_EVENTS: "/user/me/events",
  TEMPLATES: "/user/templates",
  PROFILE: "/user/me",
  SETTINGS: "/user/settings",
};

const NAV_ITEMS = [
  { name: "Dashboard", to: NAV_PATHS.USER_HOME, end: true, icon: HiChartPie, roles: ["admin", "teacher"] },
  { name: "Events", to: NAV_PATHS.EVENTS, end: false, icon: HiCalendar, roles: ["student", "admin", "teacher"] },
  { name: "My Events", to: NAV_PATHS.MY_EVENTS, end: true, icon: HiUserGroup, roles: ["student"] },
  { name: "Templates", to: NAV_PATHS.TEMPLATES, end: false, icon: HiTemplate, roles: ["admin", "teacher"] },
  { name: "Profile", to: NAV_PATHS.PROFILE, end: true, icon: HiUserCircle, roles: ["student", "admin", "teacher"] },
  { name: "Settings", to: NAV_PATHS.SETTINGS, end: false, icon: HiCog, roles: ["student", "admin", "teacher"] },
];

export const UserSidebar = () => {
  const { user } = useAuth();
  const role = (user?.role || "").toLowerCase();
  const navLinks = NAV_ITEMS.filter((item) => (role ? item.roles.includes(role) : item.roles.includes("student")));

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white text-slate-900 border-r border-slate-200 shadow-lg z-20">
      <div className="text-xl font-bold p-6 tracking-wide border-b border-slate-200">
        Event Manager
        <div className="text-xs font-medium text-slate-500 mt-1">{user?.role || "User"} Console</div>
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors font-medium ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm border-l-4 border-orange-500"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
