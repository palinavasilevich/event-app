import { Navigate } from "react-router-dom";
import { useAuthBootstrap } from "@/hooks/use-auth-bootstrap";
import { ProtectedLayout } from "./protected-layout";
import { ROUTES } from "@/shared/constants/routes";

export function ProtectedRoute() {
  const user = useAuthBootstrap();

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <ProtectedLayout />;
}
