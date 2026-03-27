import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts & Guards
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./guards/ProtectedRoute";
import RoleRoute from "./guards/RoleRoute";

// Misc Pages
import LandingPage from "../pages/misc/LandingPage";
import Error404 from "../pages/misc/Error404";
import WorkInProgress from "../pages/misc/WorkInProgress";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgetPasswordPage from "../pages/legacy/auth/ForgetPasswordPage";

// Dashboard Pages
import OrganizerDashboardPage from "../pages/dashboard/OrganizerDashboardPage";

// Event Pages
import EventListPage from "../pages/events/EventListPage";
import EventDetailPage from "../pages/events/EventDetailPage";
import CreateEventPage from "../pages/events/CreateEventPage";
import EventAttendeesPage from "../pages/events/EventAttendeesPage";
import MyEventsPage from "../pages/events/MyEventsPage";
import ProfilePage from "../pages/user/ProfilePage";

// Template Pages
import TemplateListPage from "../pages/templates/TemplateListPage";
import TemplateDetailPage from "../pages/templates/TemplateDetailPage";
import CloneTemplatePage from "../pages/templates/CloneTemplatePage";

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
      {
        path: "events/create",
        element: (
          <RoleRoute allowedRoles={["Admin", "Teacher"]}>
            <CreateEventPage />
          </RoleRoute>
        ),
      },
      { path: "events/:eventId", element: <EventDetailPage /> },
      {
        path: "events/:eventId/attendees",
        element: (
          <RoleRoute allowedRoles={["Admin", "Teacher"]}>
            <EventAttendeesPage />
          </RoleRoute>
        ),
      },

      { path: "sub-events", element: <WorkInProgress /> },

      {
        path: "templates",
        element: (
          <RoleRoute allowedRoles={["Admin", "Teacher"]}>
            <TemplateListPage />
          </RoleRoute>
        ),
      },
      {
        path: "templates/:templateId",
        element: (
          <RoleRoute allowedRoles={["Admin", "Teacher"]}>
            <TemplateDetailPage />
          </RoleRoute>
        ),
      },
      {
        path: "templates/:templateId/clone",
        element: (
          <RoleRoute allowedRoles={["Admin"]}>
            <CloneTemplatePage />
          </RoleRoute>
        ),
      },

      { path: "me", element: <ProfilePage /> },
      {
        path: "me/events",
        element: (
          <RoleRoute allowedRoles={["Student"]}>
            <MyEventsPage />
          </RoleRoute>
        ),
      },

      { path: "settings", element: <WorkInProgress /> },
    ],
  },
  { path: "*", element: <Error404 /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
