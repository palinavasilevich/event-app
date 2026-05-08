import { useAuthBootstrap } from "@/hooks/use-auth-bootstrap";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";

export function RootRedirect() {
  const user = useAuthBootstrap();

  return <Navigate to={user ? ROUTES.EVENTS : ROUTES.LOGIN} replace />;
}
