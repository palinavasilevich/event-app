import type { EventDto } from "@/shared/api/events/types";
import { useMemo } from "react";
import { createColumns } from "./columns";
import { DataTable } from "../data-table";

type FavoriteEventsTableProps = {
  events: EventDto[];
  mutatingEventId: string | null;
  onRemoveFavorite: (eventId: string) => void;
};

export function FavoriteEventsTable({
  events,
  mutatingEventId,
  onRemoveFavorite,
}: FavoriteEventsTableProps) {
  const columns = useMemo(
    () => createColumns(mutatingEventId, onRemoveFavorite),
    [mutatingEventId, onRemoveFavorite],
  );

  return <DataTable columns={columns} data={events} />;
}
