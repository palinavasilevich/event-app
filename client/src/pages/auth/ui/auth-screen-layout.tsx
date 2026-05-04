import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type AuthScreenLayoutProps = {
  children: ReactNode;
  className?: string;
};

export function AuthScreenLayout({
  children,
  className,
}: AuthScreenLayoutProps) {
  return (
    <div
      className={cn(
        "bg-background flex min-h-svh w-full flex-col items-center justify-center gap-6 p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
