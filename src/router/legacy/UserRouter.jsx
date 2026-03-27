import DashboardLayout from "../../layouts/DashboardLayout";
import UserDashboard from "../../pages/dashboard/OrganizerDashboardPage";
import EventsSection from "../../pages/events/EventListPage";
import WorkInProgress from "../../pages/misc/WorkInProgress";
// import UserList from "../pages/users/UserList";

export const UserRouter = [
  {
    path: "/user",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <UserDashboard /> },
      { path: "events", element: <EventsSection /> },
      { path: "sub-events", element: <WorkInProgress /> },
      { path: "templates", element: <WorkInProgress /> },
      { path: "me", element: <WorkInProgress /> },
      { path: "settings", element: <WorkInProgress /> },
    ],
  },
];
