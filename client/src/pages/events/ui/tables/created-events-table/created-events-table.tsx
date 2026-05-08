import type { EventDto } from "@/shared/api/events/types";
import { useMemo } from "react";
import { createColumns } from "./columns";
import { DataTable } from "../data-table";

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
  const columns = useMemo(
    () => createColumns(mutatingEventId, onRemove),
    [mutatingEventId, onRemove],
  );

  return <DataTable columns={columns} data={events} />;
}
