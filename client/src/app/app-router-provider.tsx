import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./router";

export function AppRouterProvider() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-svh place-items-center text-sm text-muted-foreground">
          Loading...
        </div>
      }
    >
      <RouterProvider router={appRouter} />
    </Suspense>
  );
}
