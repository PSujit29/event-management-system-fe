import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import LandingPage from "../pages/misc/LandingPage";
import Error404 from "../pages/misc/Error404";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgetPasswordPage from "../pages/legacy/auth/ForgetPasswordPage";
import OrganizerDashboardPage from "../pages/dashboard/OrganizerDashboardPage";
import EventListPage from "../pages/events/EventListPage";
import WorkInProgress from "../pages/misc/WorkInProgress";
import TemplateListPage from "../pages/templates/TemplateListPage";
import ProtectedRoute from "./guards/ProtectedRoute";
import RoleRoute from "./guards/RoleRoute";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forget-password", element: <ForgetPasswordPage /> },
    ],
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <RoleRoute allowedRoles={["Admin", "Teacher"]}>
            <OrganizerDashboardPage />
          </RoleRoute>
        ),
      },
      { path: "events", element: <EventListPage /> },
      { path: "sub-events", element: <WorkInProgress /> },
      { path: "templates", element: <TemplateListPage /> },
      { path: "me", element: <WorkInProgress /> },
      { path: "settings", element: <WorkInProgress /> },
    ],
  },
  { path: "*", element: <Error404 /> },
]);

export default function AppRouter() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
