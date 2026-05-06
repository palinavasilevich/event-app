import type { EventDto } from "@/shared/api/events/types";

export function getCountFreeSeats(event: EventDto): number {
  return event.capacity - event.participantCount;
}
