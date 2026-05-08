import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatEventStartDate } from "@/lib/format-event-start-date";
import { getCountFreeSeats } from "@/lib/get-count-free-seats";
import type { EventDto } from "@/shared/api/events/types";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

type EventDetailsCardProps = {
  event: EventDto;
  isOwner: boolean;
  isJoined: boolean;
  isMutationLoading: boolean;
  eventsError: string | null;
  onJoin: () => void;
  onLeave: () => void;
  onRemove: () => void;
};

export function EventDetailsCard({
  event,
  isOwner,
  isJoined,
  isMutationLoading,
  eventsError,
  onJoin,
  onLeave,
  onRemove,
}: EventDetailsCardProps) {
  return (
    <>
      {eventsError && <p className="text-sm text-destructive">{eventsError}</p>}

      <Card
        style={
          event.color ? { backgroundColor: `${event.color}26` } : undefined
        }
      >
        <CardHeader>
          <CardTitle className="text-lg leading-snug">{event.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground">When</p>
            <p>{formatEventStartDate(event.startedAt)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Address</p>
            <p>{event.address}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Capacity</p>
            <p>
              {getCountFreeSeats(event)} / {event.capacity} seats free
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Description</p>
            <p>{event.description}</p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2 border-t">
          {isOwner ? (
            <>
              <p className="mr-auto text-sm text-muted-foreground">
                You are the organizer
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/events/${event.id}/edit`}>Edit</Link>
              </Button>
              <ConfirmDialog
                trigger={
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isMutationLoading}
                  >
                    {isMutationLoading && <Loader2 className="animate-spin" />}
                    Delete
                  </Button>
                }
                title="Delete event"
                description="This action cannot be undone. The event will be permanently deleted."
                onConfirm={onRemove}
                confirmLabel="Delete"
              />
            </>
          ) : isJoined ? (
            <ConfirmDialog
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isMutationLoading}
                >
                  {isMutationLoading && <Loader2 className="animate-spin" />}
                  Leave event
                </Button>
              }
              title="Leave event"
              description="Are you sure you want to leave the event?"
              onConfirm={onLeave}
              confirmLabel="Leave"
            />
          ) : (
            <Button
              size="sm"
              disabled={isMutationLoading || getCountFreeSeats(event) === 0}
              onClick={onJoin}
            >
              {isMutationLoading && <Loader2 className="animate-spin" />}
              Join event
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
