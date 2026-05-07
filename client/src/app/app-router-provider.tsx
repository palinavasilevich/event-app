import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./router";
import { Spinner } from "@/components/ui/spinner";

export function AppRouterProvider() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-svh place-items-center text-sm text-muted-foreground">
          <Spinner className="size-10" />
        </div>
      }
    >
      <RouterProvider router={appRouter} />
    </Suspense>
  );
}
