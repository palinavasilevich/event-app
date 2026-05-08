import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./router/root-layout";
import { RootRedirect } from "./router/root-redirect";
import { GuestRoute } from "./router/guest-route";
import { ProtectedRoute } from "./router/protected-route";
import { AuthRegisterPage } from "@/pages/auth/register/page";
import { AuthLoginPage } from "@/pages/auth/login/page";
import { EventsAllPage } from "@/pages/events/all/page";
import { CreateEventPage } from "@/pages/events/create/page";
import { EventDetailsPage } from "@/pages/events/details/page";
import { EventsEditPage } from "@/pages/events/edit/page";
import { MyEventsPage } from "@/pages/events/my/page";
import { ROUTES } from "@/shared/constants/routes";

export const appRouter = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <RootLayout />,
    children: [
      { index: true, element: <RootRedirect /> },
      {
        element: <GuestRoute />,
        children: [
          {
            path: ROUTES.LOGIN,
            element: <AuthLoginPage />,
          },
          {
            path: ROUTES.REGISTER,
            element: <AuthRegisterPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: ROUTES.EVENTS,
            element: <EventsAllPage />,
          },

          {
            path: ROUTES.MY_EVENTS,
            element: <MyEventsPage />,
          },

          {
            path: ROUTES.NEW_EVENTS,
            element: <CreateEventPage />,
          },

          {
            path: ROUTES.EVENT,
            element: <EventDetailsPage />,
          },

          {
            path: ROUTES.EDIT_EVENT,
            element: <EventsEditPage />,
          },
        ],
      },
      { path: "*", element: <Navigate to={ROUTES.HOME} replace /> },
    ],
  },
]);
