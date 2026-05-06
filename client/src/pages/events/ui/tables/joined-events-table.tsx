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
import type { JoinedEventItem } from "@/shared/api/me/types";
import { Loader2 } from "lucide-react";

type JoinedEventsTableProps = {
  joinedEvents: JoinedEventItem[];
  mutatingEventId: string | null;
  onLeave: (eventId: string) => void;
};

export function JoinedEventsTable({
  joinedEvents,
  mutatingEventId,
  onLeave,
}: JoinedEventsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Event Start</TableHead>
          <TableHead>Address</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {joinedEvents.map((joinedEvent) => (
          <TableRow key={joinedEvent.event.id}>
            <TableCell className="max-w-48 font-medium">
              <Link
                className="hover:text-primary"
                to={`/events/${joinedEvent.event.id}`}
              >
                {joinedEvent.event.title}
              </Link>
            </TableCell>

            <TableCell className="text-muted-foreground">
              {formatEventStartDate(joinedEvent.event.startedAt)}
            </TableCell>
            <TableCell className="max-w-48 text-muted-foreground">
              {joinedEvent.event.address}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="destructive"
                size="sm"
                disabled={mutatingEventId === joinedEvent.event.id}
                onClick={() => onLeave(joinedEvent.event.id)}
              >
                {mutatingEventId === joinedEvent.event.id && <Loader2 className="animate-spin" />}
                Leave event
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
