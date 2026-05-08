import { http } from "../http";
import type { EventDto } from "../events/types";
import type { JoinedEventItem } from "./types";

export const meApi = {
  async getJoinedEvents(): Promise<JoinedEventItem[]> {
    const { data } = await http.get<JoinedEventItem[]>("/me/events/joined");
    return data;
  },

  async getFavoriteEvents(): Promise<EventDto[]> {
    const { data } = await http.get<EventDto[]>("/me/events/favorites");
    return data;
  },

  async addFavorite(id: string): Promise<void> {
    await http.post(`/me/events/favorites/${id}`);
  },

  async removeFavorite(id: string): Promise<void> {
    await http.delete(`/me/events/favorites/${id}`);
  },
};
