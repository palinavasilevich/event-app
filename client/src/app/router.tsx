import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./router/root-layout";
import { RootRedirect } from "./router/root-redirect";
import { GuestRoute } from "./router/guest-route";
import { ProtectedRoute } from "./router/protected-route";
import { AuthRegisterPage } from "@/pages/auth/register/page";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <RootRedirect /> },
      {
        element: <GuestRoute />,
        children: [
          {
            path: "login",
            element: <h1>LOGIN</h1>,
          },
          {
            path: "register",
            element: <AuthRegisterPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "events",
            element: <h1>EVENTS</h1>,
          },

          {
            path: "events/my",
            element: <h1>MY EVENTS</h1>,
          },

          {
            path: "events/new",
            element: <h1>NEW EVENT</h1>,
          },

          {
            path: "events/:id",
            element: <h1>EVENT BY ID</h1>,
          },

          {
            path: "events/:id/edit",
            element: <h1>EDIT EVENT</h1>,
          },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
