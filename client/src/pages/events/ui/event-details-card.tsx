import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatEventStartDate } from "@/lib/format-event-start-date";
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

      <Card>
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
            <p>Up to {event.capacity} participants</p>
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
              <Button
                variant="destructive"
                size="sm"
                disabled={isMutationLoading}
                onClick={onRemove}
              >
                {isMutationLoading && <Loader2 className="animate-spin" />}
                Delete
              </Button>
            </>
          ) : isJoined ? (
            <Button
              variant="outline"
              size="sm"
              disabled={isMutationLoading}
              onClick={onLeave}
            >
              {isMutationLoading && <Loader2 className="animate-spin" />}
              Leave event
            </Button>
          ) : (
            <Button size="sm" disabled={isMutationLoading} onClick={onJoin}>
              {isMutationLoading && <Loader2 className="animate-spin" />}
              Join event
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
