export type EventDto = {
  id: string;
  title: string;
  description: string;
  capacity: number;
  address: string;
  startedAt: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateEventRequest = {
  title: string;
  description: string;
  capacity: number;
  address: string;
  startedAt: string;
};

export type UpdateEventRequest = Partial<CreateEventRequest>;

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
