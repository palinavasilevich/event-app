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
import { ConfirmDialog } from "@/components/confirm-dialog";

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
          <TableHead className="text-center">Capacity</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="max-w-48 font-medium whitespace-normal">
              <Link className="hover:text-primary" to={`/events/${event.id}`}>
                {event.title}
              </Link>
            </TableCell>

            <TableCell className="text-muted-foreground">
              {formatEventStartDate(event.startedAt)}
            </TableCell>
            <TableCell className="max-w-48 text-muted-foreground whitespace-normal">
              {event.address}
            </TableCell>
            <TableCell className="tabular-nums text-center">
              {event.capacity}
            </TableCell>
            <TableCell className="text-center">
              <Button variant="outline" size="sm" asChild className="mr-2">
                <Link to={`/events/${event.id}/edit`}>Edit</Link>
              </Button>

              <ConfirmDialog
                trigger={
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={mutatingEventId === event.id}
                  >
                    {mutatingEventId === event.id && (
                      <Loader2 className="animate-spin" />
                    )}
                    Delete
                  </Button>
                }
                title="Delete event"
                description="This action cannot be undone. The event will be permanently deleted."
                onConfirm={() => onRemove(event.id)}
                confirmLabel="Delete"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
