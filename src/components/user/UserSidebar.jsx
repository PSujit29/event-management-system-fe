import { NavLink } from "react-router-dom";
import { HiChartPie, HiCalendar, HiClipboardList, HiUserGroup, HiTemplate, HiUserCircle, HiCog } from "react-icons/hi";
export const UserSidebar = () => {
  const navLinks = [
    { name: "Dashboard", path: "/user", end: true, icon: <HiChartPie className="w-5 h-5" /> },
    { name: "Events", path: "/user/events", end: false, icon: <HiCalendar className="w-5 h-5" /> },
    { name: "Sub-Events", path: "/user/sub-events", end: false, icon: <HiClipboardList className="w-5 h-5" /> },
    { name: "Templates", path: "/user/templates", end: false, icon: <HiTemplate className="w-5 h-5" /> },
    { name: "Profile", path: "/user/me", end: false, icon: <HiUserCircle className="w-5 h-5" /> },
    { name: "Settings", path: "/user/settings", end: false, icon: <HiCog className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white text-slate-900 border-r border-slate-200 shadow-lg z-20">
      <div className="text-xl font-bold p-6 tracking-wide border-b border-slate-200">
        Event Manager
        <div className="text-xs font-medium text-slate-500 mt-1">Admin Console</div>
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors font-medium ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm border-l-4 border-orange-500"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
