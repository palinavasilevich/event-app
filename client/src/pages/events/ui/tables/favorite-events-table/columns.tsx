import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { formatEventStartDate } from "@/lib/format-event-start-date";
import type { EventDto } from "@/shared/api/events/types";
import { ROUTES } from "@/shared/constants/routes";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Loader2 } from "lucide-react";
import { generatePath, Link } from "react-router-dom";

export type FavoriteEvent = Pick<
  EventDto,
  "id" | "title" | "startedAt" | "address" | "capacity"
>;

export function createColumns(
  mutatingEventId: string | null,
  onRemoveFavorite: (eventId: string) => void,
): ColumnDef<FavoriteEvent>[] {
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
        <Link
          className="whitespace-normal hover:underline"
          to={generatePath(ROUTES.EVENT, { id: row.original.id })}
        >
          {row.original.title}
        </Link>
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
        <div>{formatEventStartDate(row.original.startedAt)}</div>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="whitespace-normal">{row.original.address}</div>
      ),
    },
    {
      accessorKey: "capacity",
      header: () => <div className="text-center">Capacity</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original.capacity}</div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const eventId = row.original.id;
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
                  Remove from favorites
                </Button>
              }
              title="Remove from favorites"
              description="Are you sure you want to remove this event from favorites?"
              onConfirm={() => onRemoveFavorite(eventId)}
              confirmLabel="Remove"
            />
          </div>
        );
      },
    },
  ];
}
