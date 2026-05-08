import "react-router-dom";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  EVENTS: "/events",
  MY_EVENTS: "/events/my",
  NEW_EVENTS: "/events/new",
  FAVORITE_EVENTS: "/events/favorite",
  EVENT: "/events/:id",
  EDIT_EVENT: "/events/:id/edit",
} as const;

export type PathParams = {
  [ROUTES.EVENT]: {
    eventId: string;
  };
};

declare module "react-router-dom" {
  interface Register {
    params: PathParams;
  }
}
