import UserLayout from "../pages/layout/UserLayout";
import UserDashboard from "../pages/dashboard/UserDashboard";
import WorkInProgress from "../pages/errors/work-in-progress";
import UserList from "../pages/users/UserList";

export const UserRouter = [
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      { index: true, element: <UserDashboard /> },
      { path: "all-users", element: <UserList /> },
      { path: "reports", element: <WorkInProgress /> },
      { path: "settings", element: <WorkInProgress /> },
    ],
  },
];
