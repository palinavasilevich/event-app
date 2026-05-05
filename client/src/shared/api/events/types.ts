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
