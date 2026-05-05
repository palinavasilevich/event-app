import { ErrorRetryBlock } from "@/components/error-retry-block";
import { PageShell } from "@/components/page-shell";
import { useEventsStore } from "@/stores/events-store";
import { useEffect } from "react";
import { EventListCard } from "../ui/event-list-card";

export function EventsAllPage() {
  const events = useEventsStore((state) => state.events);
  const loadEvents = useEventsStore((state) => state.loadEvents);
  const isLoading = useEventsStore((state) => state.isEventsLoading);
  const error = useEventsStore((state) => state.eventsError);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const isShowInitialLoading = isLoading && events.length === 0;

  return (
    <PageShell title="All Events">
      {isShowInitialLoading ? "Loading..." : null}

      {error ? <ErrorRetryBlock className="mb-4" message={error} /> : null}

      {!isLoading && !error && events.length === 0 ? (
        <p className="text-sm text-muted-foreground">No events yet</p>
      ) : null}

      <ul className="grid w-full max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <li key={event.id}>
            <EventListCard event={event} />
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
