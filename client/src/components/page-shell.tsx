import type { ReactNode } from "react";

type PageShellProps = {
  title?: string;
  children: ReactNode;
};

export function PageShell({ title, children }: PageShellProps) {
  return (
    <section className="w-full min-w-0 text-2xl flex flex-col items-center">
      <h1 className="mb-4 font-heading text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      {children}
    </section>
  );
}
