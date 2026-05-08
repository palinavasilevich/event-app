export type EventDto = {
  id: string;
  title: string;
  description: string;
  capacity: number;
  participantCount: number;
  address: string;
  startedAt: string;
  ownerId: string;
  color: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateEventRequest = {
  title: string;
  description: string;
  capacity: number;
  address: string;
  startedAt: string;
  color?: string | null;
};

export type UpdateEventRequest = Partial<CreateEventRequest>;
