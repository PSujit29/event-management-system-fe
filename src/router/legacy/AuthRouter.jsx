import AuthLayout from "../../layouts/AuthLayout";
import LoginPage from "../../pages/auth/LoginPage";
import RegisterPage from "../../pages/auth/RegisterPage";
import ForgetPasswordPage from "../../pages/legacy/auth/ForgetPasswordPage";

export const AuthRouter = [
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forget-password", element: <ForgetPasswordPage /> },
    ],
  },
];
