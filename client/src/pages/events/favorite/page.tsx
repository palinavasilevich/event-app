import { PageShell } from "@/components/page-shell";
import { useEventsStore } from "@/stores/events-store";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { FavoriteEventsTable } from "../ui/tables/favorite-events-table/favorite-events-table";

export function FavoriteEventsPage() {
  const favoriteEvents = useEventsStore((state) => state.favoriteEvents);
  const isFavoritesLoading = useEventsStore(
    (state) => state.isFavoritesLoading,
  );
  const eventsError = useEventsStore((state) => state.eventsError);
  const mutatingEventId = useEventsStore((state) => state.mutatingEventId);
  const loadFavoriteEvents = useEventsStore(
    (state) => state.loadFavoriteEvents,
  );
  const removeFavorite = useEventsStore((state) => state.removeFavorite);

  useEffect(() => {
    loadFavoriteEvents().catch(() => {});
  }, [loadFavoriteEvents]);

  const handleRemoveFavorite = async (eventId: string) => {
    try {
      await removeFavorite(eventId);
    } catch {
      // Errors handled via eventsError in the store
    }
  };

  return (
    <PageShell title="Favorite Events">
      <div className="overflow-hidden rounded-lg border flex w-full max-w-6xl flex-col gap-6">
        {eventsError && <p>Loading error: {eventsError}</p>}

        {isFavoritesLoading ? (
          <Spinner className="size-10" />
        ) : favoriteEvents.length === 0 ? (
          <p>You have no favorite events yet</p>
        ) : (
          <FavoriteEventsTable
            events={favoriteEvents}
            mutatingEventId={mutatingEventId}
            onRemoveFavorite={handleRemoveFavorite}
          />
        )}
      </div>
    </PageShell>
  );
}
