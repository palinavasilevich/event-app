import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { formatEventStartDate } from "@/lib/format-event-start-date";
import type { JoinedEventItem } from "@/shared/api/me/types";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Loader2 } from "lucide-react";

export function createColumns(
  mutatingEventId: string | null,
  onLeave: (eventId: string) => void,
): ColumnDef<JoinedEventItem>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="whitespace-normal">{row.original.event.title}</div>
      ),
    },
    {
      accessorKey: "startedAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Event Start
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>{formatEventStartDate(row.original.event.startedAt)}</div>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="whitespace-normal">{row.original.event.address}</div>
      ),
    },

    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const eventId = row.original.event.id;
        return (
          <div className="text-center">
            <ConfirmDialog
              trigger={
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={mutatingEventId === eventId}
                >
                  {mutatingEventId === eventId && (
                    <Loader2 className="animate-spin" />
                  )}
                  Leave event
                </Button>
              }
              title="Leave event"
              description="Are you sure you want to leave the event?"
              onConfirm={() => onLeave(eventId)}
              confirmLabel="Leave"
            />
          </div>
        );
      },
    },
  ];
}
