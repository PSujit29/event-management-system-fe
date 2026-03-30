import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Layouts & Guards
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./guards/ProtectedRoute";
import RoleRoute from "./guards/RoleRoute";

// Misc Pages
import LandingPage from "../pages/misc/LandingPage";
import Error404 from "../pages/misc/Error404";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgetPasswordPage from "../pages/legacy/auth/ForgetPasswordPage";

// Dashboard Pages
import OrganizerDashboardPage from "../pages/dashboard/OrganizerDashboardPage";
import StudentDashboardPage from "../pages/dashboard/StudentDashboardPage";

// Event Pages
import EventListPage from "../pages/events/EventListPage";
import EventDetailPage from "../pages/events/EventDetailPage";
import CreateEventPage from "../pages/events/CreateEventPage";
import EditEventPage from "../pages/events/EditEventPage";
import EventAttendeesPage from "../pages/events/EventAttendeesPage";
import MyEventsPage from "../pages/events/MyEventsPage";
import ProfilePage from "../pages/user/ProfilePage";
import SettingsPage from "../pages/user/SettingsPage";

// Template Pages
import TemplateListPage from "../pages/templates/TemplateListPage";
import TemplateDetailPage from "../pages/templates/TemplateDetailPage";
import CloneTemplatePage from "../pages/templates/CloneTemplatePage";

function DashboardHomePage() {
  const { user } = useAuth();
  const role = (user?.role || "").toLowerCase();

  if (role === "student") return <StudentDashboardPage />;
  if (role === "admin" || role === "teacher") return <OrganizerDashboardPage />;

  return <Navigate to="/user/events" replace />;
}

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
          element: <DashboardHomePage />,
      },
        {
          path: "dashboard",
          element: (
            <RoleRoute allowedRoles={["Student"]}>
              <StudentDashboardPage />
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
      { path: "events/edit/:eventId", element: <EditEventPage /> },
      {
        path: "events/:eventId/attendees",
        element: (
          <RoleRoute allowedRoles={["Admin", "Teacher"]}>
            <EventAttendeesPage />
          </RoleRoute>
        ),
      },
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

      { path: "settings", element: <SettingsPage /> },
    ],
  },
  { path: "*", element: <Error404 /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
