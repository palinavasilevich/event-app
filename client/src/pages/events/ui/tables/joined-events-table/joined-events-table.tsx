import { useMemo } from "react";

import { createColumns } from "./columns";
import { DataTable } from "../data-table";
import type { JoinedEventItem } from "@/shared/api/me/types";

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
  const columns = useMemo(
    () => createColumns(mutatingEventId, onLeave),
    [mutatingEventId, onLeave],
  );

  return <DataTable columns={columns} data={joinedEvents} />;
}
