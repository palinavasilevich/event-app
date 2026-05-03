import { ensureAuthBootstrapped } from "@/app/auth-bootstrap";
import { useAuthStore } from "@/stores/auth-store";
import { use } from "react";

export function useAuthBootstrap() {
  use(ensureAuthBootstrapped());

  return useAuthStore((state) => state.user);
}
