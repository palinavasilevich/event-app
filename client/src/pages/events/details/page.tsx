import { useAuthStore } from "@/stores/auth-store";
import { useEventsStore } from "@/stores/events-store";
import { useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useEventById } from "../hooks/use-event-by-id";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { EventDetailsCard } from "../ui/event-details-card";

export function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const joinedEvents = useEventsStore((state) => state.joinedEvents);
  const joinEvent = useEventsStore((state) => state.joinEvent);
  const leaveEvent = useEventsStore((state) => state.leaveEvent);
  const removeEvent = useEventsStore((state) => state.removeEvent);
  const isMutationLoading = useEventsStore((state) => state.isMutationLoading);
  const eventsError = useEventsStore((state) => state.eventsError);
  const clearError = useEventsStore((state) => state.clearError);

  useEffect(() => {
    clearError();
  }, [clearError]);

  // fetchJoinedEvents: true syncs joined-events store alongside loading the event
  const { event, isLoading, isNotFound, loadError } = useEventById(id, {
    fetchJoinedEvents: true,
  });

  if (!id) {
    return <Navigate to="/events" replace />;
  }

  if (isLoading) {
    return (
      <PageShell title="Event">
        <span>Loading...</span>
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

  // Errors from mutations are handled via eventsError in the store
  const handleJoinEvent = async () => {
    try {
      await joinEvent(event.id);
    } catch {
      //
    }
  };

  const handleLeaveEvent = async () => {
    try {
      await leaveEvent(event.id);
    } catch {
      //
    }
  };

  const handleRemoveEvent = async () => {
    const ok = confirm("Are you sure you want to delete the event?");

    if (!ok) return;

    try {
      await removeEvent(event.id);
      navigate("/events", { replace: true });
    } catch {
      //
    }
  };

  return (
    <PageShell title={event.title}>
      <div className="flex w-full max-w-2xl flex-col gap-4">
        <Button variant="outline" size="sm" className="w-fit" asChild>
          <Link to="/events">Back to list</Link>
        </Button>
        <EventDetailsCard
          event={event}
          isJoined={isJoined}
          isOwner={isOwner}
          isMutationLoading={isMutationLoading}
          eventsError={eventsError}
          onLeave={handleLeaveEvent}
          onJoin={handleJoinEvent}
          onRemove={handleRemoveEvent}
        />
      </div>
    </PageShell>
  );
}
