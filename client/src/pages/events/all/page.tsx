import { ErrorRetryBlock } from "@/components/error-retry-block";
import { PageShell } from "@/components/page-shell";
import type { EventsQueryParams } from "@/shared/api/events/types";
import { useEventsStore } from "@/stores/events-store";
import { useEffect, useState } from "react";
import { EventListCard } from "../ui/event-list-card";
import { Spinner } from "@/components/ui/spinner";
import { EventFilterForm } from "../ui/event-filter-form";

export function EventsAllPage() {
  const events = useEventsStore((state) => state.events);
  const favoriteEvents = useEventsStore((state) => state.favoriteEvents);
  const mutatingEventId = useEventsStore((state) => state.mutatingEventId);
  const loadEvents = useEventsStore((state) => state.loadEvents);
  const loadFavoriteEvents = useEventsStore(
    (state) => state.loadFavoriteEvents,
  );
  const addFavorite = useEventsStore((state) => state.addFavorite);
  const removeFavorite = useEventsStore((state) => state.removeFavorite);
  const isLoading = useEventsStore((state) => state.isEventsLoading);
  const error = useEventsStore((state) => state.eventsError);
  const [currentSearch, setCurrentSearch] = useState<string | undefined>();

  useEffect(() => {
    loadFavoriteEvents().catch(() => {});
  }, [loadFavoriteEvents]);

  const favoriteIds = new Set(favoriteEvents.map((e) => e.id));

  const handleToggleFavorite = async (eventId: string) => {
    try {
      if (favoriteIds.has(eventId)) {
        await removeFavorite(eventId);
      } else {
        const event = events.find((e) => e.id === eventId);
        await addFavorite(eventId, event);
      }
    } catch {
      // Errors handled via mutationError in the store
    }
  };

  const handleSearch = async (params: EventsQueryParams) => {
    setCurrentSearch(params.search);
    await loadEvents(params).catch(() => {});
  };

  const isShowInitialLoading = isLoading && events.length === 0;

  return (
    <PageShell title="All Events">
      {isShowInitialLoading ? <Spinner className="size-10" /> : null}

      {error ? <ErrorRetryBlock className="mb-4" message={error} /> : null}

      <EventFilterForm
        onSubmit={handleSearch}
        isLoading={isLoading}
        className="mb-4"
      />

      {!isLoading && !error && events.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {currentSearch
            ? `No events found for "${currentSearch}"`
            : "No events yet"}
        </p>
      ) : null}

      <ul className="grid w-full max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <li key={event.id}>
            <EventListCard
              event={event}
              isFavorite={favoriteIds.has(event.id)}
              isMutating={mutatingEventId === event.id}
              onToggleFavorite={() => handleToggleFavorite(event.id)}
            />
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
