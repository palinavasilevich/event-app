import { Link } from "react-router-dom";
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
import type { EventDto } from "@/shared/api/events/types";
import { Loader2 } from "lucide-react";

type CreatedEventsTableProps = {
  events: EventDto[];
  mutatingEventId: string | null;
  onRemove: (eventId: string) => void;
};

export function CreatedEventsTable({
  events,
  mutatingEventId,
  onRemove,
}: CreatedEventsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Event Start</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Capacity</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="max-w-48 font-medium">
              <Link className="hover:text-primary" to={`/events/${event.id}`}>
                {event.title}
              </Link>
            </TableCell>

            <TableCell className="text-muted-foreground">
              {formatEventStartDate(event.startedAt)}
            </TableCell>
            <TableCell className="max-w-48 text-muted-foreground">
              {event.address}
            </TableCell>
            <TableCell className="tabular-nums">{event.capacity}</TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" asChild className="mr-2">
                <Link to={`/events/${event.id}/edit`}>Edit</Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={mutatingEventId === event.id}
                onClick={() => onRemove(event.id)}
              >
                {mutatingEventId === event.id && <Loader2 className="animate-spin" />}
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
