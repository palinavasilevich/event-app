import { PageShell } from "@/components/page-shell";
import { useEventsStore } from "@/stores/events-store";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Link, generatePath } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatEventStartDate } from "@/lib/format-event-start-date";
import { Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";

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
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Event Start</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {favoriteEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="max-w-48 font-medium whitespace-normal">
                    <Link
                      className="hover:text-primary"
                      to={generatePath(ROUTES.EVENT, { id: event.id })}
                    >
                      {event.title}
                    </Link>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {formatEventStartDate(event.startedAt)}
                  </TableCell>

                  <TableCell className="max-w-48 text-muted-foreground whitespace-normal">
                    {event.address}
                  </TableCell>

                  <TableCell className="text-center">
                    <ConfirmDialog
                      trigger={
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={mutatingEventId === event.id}
                        >
                          {mutatingEventId === event.id && (
                            <Loader2 className="animate-spin" />
                          )}
                          Remove from favorites
                        </Button>
                      }
                      title="Remove from favorites"
                      description="Are you sure you want to remove this event from favorites?"
                      onConfirm={() => handleRemoveFavorite(event.id)}
                      confirmLabel="Remove"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </PageShell>
  );
}
