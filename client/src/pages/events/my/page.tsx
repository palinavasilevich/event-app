import { PageShell } from "@/components/page-shell";
import { useAuthStore } from "@/stores/auth-store";
import { useEventsStore } from "@/stores/events-store";
import { useEffect, useMemo } from "react";
import { MyEventsTitle } from "../ui/my-events-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatedEventsTable } from "../ui/tables/created-events-table";
import { JoinedEventsTable } from "../ui/tables/joined-events-table";

export function MyEventsPage() {
  const user = useAuthStore((state) => state.user);
  const events = useEventsStore((state) => state.events);
  const joinedEvents = useEventsStore((state) => state.joinedEvents);
  const myEventsFilter = useEventsStore((state) => state.myEventsFilter);
  const setMyEventsFilter = useEventsStore((state) => state.setMyEventsFilter);
  const loadEvents = useEventsStore((state) => state.loadEvents);
  const loadJoinedEvents = useEventsStore((state) => state.loadJoinedEvents);
  const isEventsLoading = useEventsStore((state) => state.isEventsLoading);
  const isJoinedLoading = useEventsStore((state) => state.isJoinedLoading);
  const eventsError = useEventsStore((state) => state.eventsError);
  const mutatingEventId = useEventsStore((state) => state.mutatingEventId);
  const removeEvent = useEventsStore((state) => state.removeEvent);
  const leaveEvent = useEventsStore((state) => state.leaveEvent);

  useEffect(() => {
    Promise.all([loadEvents(), loadJoinedEvents()]).catch(() => {});
  }, [loadEvents, loadJoinedEvents]);

  const handleRemoveEvent = async (eventId: string) => {
    const ok = confirm("Are you sure you want to delete the event?");

    if (!ok) return;

    try {
      await removeEvent(eventId);
    } catch {
      // Errors from mutations are handled via eventsError in the store
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    const ok = confirm("Are you sure you want to leave the event?");

    if (!ok) return;

    try {
      await leaveEvent(eventId);
    } catch {
      // Errors from mutations are handled via eventsError in the store
    }
  };

  const createdEvents = useMemo(() => {
    if (!user) return [];
    return events
      .filter((event) => event.ownerId === user.id)
      .sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  }, [events, user]);

  const sortedJoinedEvents = useMemo(
    () =>
      [...joinedEvents].sort((a, b) =>
        a.event.startedAt.localeCompare(b.event.startedAt),
      ),
    [joinedEvents],
  );

  const createdEventsCount = createdEvents.length;
  const joinedEventsCount = joinedEvents.length;

  return (
    <PageShell title="My Events">
      <div className="flex w-full max-w-6xl flex-col gap-6">
        <div className="grid grid-cols-2 gap-3 sm:max-w-md">
          <MyEventsTitle label="Created" value={createdEventsCount} />
          <MyEventsTitle label="Joined" value={joinedEventsCount} />
        </div>

        {eventsError && <p>Loading error: {eventsError}</p>}

        <Tabs
          value={myEventsFilter}
          onValueChange={(value) => {
            if (value === "created" || value === "joined") {
              setMyEventsFilter(value);
            }
          }}
          className="flex flex-col gap-4"
        >
          <TabsList className="w-full max-w-md gap-4">
            <TabsTrigger value="created" className="flex-1">
              Created
            </TabsTrigger>
            <TabsTrigger value="joined" className="flex-1">
              Joined
            </TabsTrigger>
          </TabsList>

          <TabsContent value="created" className="mt-0">
            {isEventsLoading ? (
              "Loading..."
            ) : createdEventsCount === 0 ? (
              "You have not created an event yet"
            ) : (
              <CreatedEventsTable
                events={createdEvents}
                mutatingEventId={mutatingEventId}
                onRemove={handleRemoveEvent}
              />
            )}
          </TabsContent>

          <TabsContent value="joined" className="mt-0">
            {isJoinedLoading ? (
              "Loading..."
            ) : joinedEventsCount === 0 ? (
              "You are not participating in any events yet"
            ) : (
              <JoinedEventsTable
                joinedEvents={sortedJoinedEvents}
                mutatingEventId={mutatingEventId}
                onLeave={handleLeaveEvent}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
