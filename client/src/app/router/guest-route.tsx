import { Navigate, Outlet } from "react-router-dom";
import { useAuthBootstrap } from "@/hooks/use-auth-bootstrap";
import { ROUTES } from "@/shared/constants/routes";

export function GuestRoute() {
  const user = useAuthBootstrap();

  if (user) {
    return <Navigate to={ROUTES.EVENTS} replace />;
  }

  return <Outlet />;
}
