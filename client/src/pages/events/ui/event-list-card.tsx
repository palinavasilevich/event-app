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
import { getCountFreeSeats } from "@/lib/get-count-free-seats";
import type { EventDto } from "@/shared/api/events/types";
import { Heart } from "lucide-react";
import { Link, generatePath } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";

type EventListCardProps = {
  event: EventDto;
  isFavorite: boolean;
  isMutating: boolean;
  onToggleFavorite: () => void;
};

export function EventListCard({
  event,
  isFavorite,
  isMutating,
  onToggleFavorite,
}: EventListCardProps) {
  return (
    <Card
      className="h-full"
      style={event.color ? { backgroundColor: `${event.color}26` } : undefined}
    >
      <CardHeader>
        <CardTitle className="text-base">
          <Link
            className="hove:text-primary hover:underline"
            to={generatePath(ROUTES.EVENT, { id: event.id })}
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
          {getCountFreeSeats(event)} / {event.capacity} seats free
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={isMutating}
            onClick={onToggleFavorite}
          >
            <Heart className={isFavorite ? "fill-current" : ""} />
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to={generatePath(ROUTES.EVENT, { id: event.id })}>More</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
