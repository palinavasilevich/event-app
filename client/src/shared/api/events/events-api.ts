import { http } from "../http";
import type { JoinEventResponse } from "../me/types";
import type { CreateEventRequest, EventDto, UpdateEventRequest } from "./types";

export const eventsApi = {
  async getEvents(search?: string): Promise<EventDto[]> {
    const { data } = await http.get<EventDto[]>("/events", {
      params: { search },
    });

    return data;
  },
  async getEventById(id: string, signal?: AbortSignal): Promise<EventDto> {
    const { data } = await http.get<EventDto>(`/events/${id}`, { signal });
    return data;
  },
  async createNewEvent(payload: CreateEventRequest): Promise<EventDto> {
    const { data } = await http.post<EventDto>("events", payload);
    return data;
  },
  async updateEvent(
    id: string,
    payload: UpdateEventRequest,
  ): Promise<EventDto> {
    const { data } = await http.patch<EventDto>(`/events/${id}`, payload);
    return data;
  },
  async removeEvent(id: string): Promise<void> {
    await http.delete(`/events/${id}`);
  },
  async joinEvent(id: string): Promise<JoinEventResponse> {
    const { data } = await http.post<JoinEventResponse>(`/events/${id}/join`);
    return data;
  },
  async leaveEvent(id: string): Promise<void> {
    await http.delete(`/events/${id}/join`);
  },
};
