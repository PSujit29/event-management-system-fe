import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthRouter } from "./AuthRouter";
import LandingPage from "../pages/landing/LandingPage"
// import { UserRouter } from "./UserRouter";
import Error404 from "../pages/error/404";

const router = createBrowserRouter([
   { path: "/", element: <LandingPage/> },
  ...AuthRouter,
  // ...UserRouter,
  { path: "*", element: <Error404/> },
]);

export default function RouterConfig() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
