import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatEventStartDate } from "@/lib/format-event-start-date";
import type { EventDto } from "@/shared/api/events/types";
import { Link } from "react-router-dom";

type EventListCardProps = {
  event: EventDto;
};

export function EventListCard({ event }: EventListCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">
          <Link
            className="hove:text-primary hover:underline"
            to={`/events/${event.id}`}
          >
            {event.title}
          </Link>
        </CardTitle>
        <CardDescription>
          {formatEventStartDate(event.startedAt)} - {event.address}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-muted-foreground">
          {event.description || ""}
        </p>
      </CardContent>

      <CardFooter className="mt-auto justify-between pt-4">
        <span className="text-muted-foreground">
          Up to {event.capacity} people
        </span>
        <Button asChild variant="outline" size="sm">
          <Link to={`/events/${event.id}`}>More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
