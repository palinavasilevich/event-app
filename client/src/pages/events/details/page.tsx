import { useAuthStore } from "@/stores/auth-store";
import { useEventsStore } from "@/stores/events-store";
import { useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { useEventById } from "../hooks/use-event-by-id";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { EventDetailsCard } from "../ui/event-details-card";
import { Spinner } from "@/components/ui/spinner";

export function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const joinedEvents = useEventsStore((state) => state.joinedEvents);
  const favoriteEvents = useEventsStore((state) => state.favoriteEvents);
  const joinEvent = useEventsStore((state) => state.joinEvent);
  const leaveEvent = useEventsStore((state) => state.leaveEvent);
  const removeEvent = useEventsStore((state) => state.removeEvent);
  const addFavorite = useEventsStore((state) => state.addFavorite);
  const removeFavorite = useEventsStore((state) => state.removeFavorite);
  const isMutationLoading = useEventsStore((state) => state.isMutationLoading);
  const eventsError = useEventsStore((state) => state.eventsError);
  const clearError = useEventsStore((state) => state.clearError);
  const loadJoinedEvents = useEventsStore((state) => state.loadJoinedEvents);
  const loadFavoriteEvents = useEventsStore(
    (state) => state.loadFavoriteEvents,
  );

  useEffect(() => {
    clearError();
    loadFavoriteEvents().catch(() => {});
  }, [clearError, loadFavoriteEvents]);

  // fetchJoinedEvents: true syncs joined-events store alongside loading the event
  const { event, isLoading, isNotFound, loadError, reload } = useEventById(id, {
    fetchJoinedEvents: true,
  });

  if (!id) {
    return <Navigate to={ROUTES.EVENTS} replace />;
  }

  if (isLoading) {
    return (
      <PageShell>
        <Spinner className="size-10 text-muted-foreground" />
      </PageShell>
    );
  }

  if (isNotFound) {
    return (
      <PageShell title="Event not found">
        <span>There is no such event</span>
      </PageShell>
    );
  }

  if (loadError || !event) {
    return (
      <PageShell title="Error">
        {loadError && <span>{loadError}</span>}
      </PageShell>
    );
  }

  const isOwner = user?.id === event.ownerId;
  const isJoined = joinedEvents.some(
    (joinedEvent) => joinedEvent.event.id === event.id,
  );
  const isFavorite = favoriteEvents.some((e) => e.id === event.id);

  const handleJoinEvent = async () => {
    try {
      await joinEvent(event.id);
      reload();
      await loadJoinedEvents();
    } catch {
      // Errors from mutations are handled via eventsError in the store
    }
  };

  const handleLeaveEvent = async () => {
    try {
      await leaveEvent(event.id);
      reload();
      await loadJoinedEvents();
    } catch {
      // Errors from mutations are handled via eventsError in the store
    }
  };

  const handleRemoveEvent = async () => {
    try {
      await removeEvent(event.id);
      navigate(ROUTES.EVENTS, { replace: true });
    } catch {
      // Errors from mutations are handled via eventsError in the store
    }
  };

  const handleFavorite = async () => {
    try {
      await addFavorite(event.id);
    } catch {
      // Errors from mutations are handled via eventsError in the store
    }
  };

  const handleUnfavorite = async () => {
    try {
      await removeFavorite(event.id);
    } catch {
      // Errors from mutations are handled via eventsError in the store
    }
  };

  return (
    <PageShell>
      <div className="flex w-full max-w-2xl flex-col gap-4">
        <Button variant="outline" size="sm" className="w-fit" asChild>
          <Link to={ROUTES.EVENTS}>Back to list</Link>
        </Button>
        <EventDetailsCard
          event={event}
          isJoined={isJoined}
          isOwner={isOwner}
          isFavorite={isFavorite}
          isMutationLoading={isMutationLoading}
          eventsError={eventsError}
          onLeave={handleLeaveEvent}
          onJoin={handleJoinEvent}
          onRemove={handleRemoveEvent}
          onFavorite={handleFavorite}
          onUnfavorite={handleUnfavorite}
        />
      </div>
    </PageShell>
  );
}
