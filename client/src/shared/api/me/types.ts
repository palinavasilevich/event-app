import type { EventDto } from "../events/types";

export type JoinEventResponse = {
  message: string;
  participation: {
    id: string;
    eventId: string;
    userId: string;
    joinedAt: string;
  };
};

export type JoinedEventItem = {
  joinedAt: string;
  event: EventDto;
};
