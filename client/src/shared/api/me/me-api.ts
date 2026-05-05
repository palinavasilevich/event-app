import { http } from "../http";
import type { JoinedEventItem } from "./types";

export const meApi = {
  async getJoinedEvents(): Promise<JoinedEventItem[]> {
    const { data } = await http.get<JoinedEventItem[]>("/me/events/joined");
    return data;
  },
};
