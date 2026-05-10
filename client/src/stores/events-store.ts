import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { eventsApi } from "@/shared/api/events/events-api";
import type {
  CreateEventRequest,
  EventDto,
  UpdateEventRequest,
} from "@/shared/api/events/types";
import { meApi } from "@/shared/api/me/me-api";
import type { JoinedEventItem } from "@/shared/api/me/types";
import { create } from "zustand";

export type MyEventsFilter = "created" | "joined";

type EventsState = {
  events: EventDto[];
  joinedEvents: JoinedEventItem[];
  favoriteEvents: EventDto[];
  myEventsFilter: MyEventsFilter;
  isEventsLoading: boolean;
  isJoinedLoading: boolean;
  isFavoritesLoading: boolean;
  isMutationLoading: boolean;
  mutatingEventId: string | null;
  eventsError: string | null;
  clearError: () => void;
  setMyEventsFilter: (filter: MyEventsFilter) => void;
  loadEvents: (search?: string) => Promise<void>;
  createEvent: (payload: CreateEventRequest) => Promise<EventDto>;
  updateEvent: (id: string, payload: UpdateEventRequest) => Promise<EventDto>;
  removeEvent: (id: string) => Promise<void>;
  loadJoinedEvents: () => Promise<void>;
  joinEvent: (id: string) => Promise<void>;
  leaveEvent: (id: string) => Promise<void>;
  loadFavoriteEvents: () => Promise<void>;
  addFavorite: (id: string) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
};

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  joinedEvents: [],
  favoriteEvents: [],
  myEventsFilter: "created",
  isEventsLoading: false,
  isJoinedLoading: false,
  isFavoritesLoading: false,
  isMutationLoading: false,
  mutatingEventId: null,
  eventsError: null,
  clearError: () => set({ eventsError: null }),
  setMyEventsFilter: (filter) => set({ myEventsFilter: filter }),
  loadEvents: async (search) => {
    set({ isEventsLoading: true, eventsError: null });

    try {
      const events = await eventsApi.getEvents(search);
      set({ events, isEventsLoading: false });
    } catch (error) {
      set({
        isEventsLoading: false,
        eventsError: getApiErrorMessage(error, "Failed to load events"),
      });
      throw error;
    }
  },

  createEvent: async (payload) => {
    set({ isMutationLoading: true, eventsError: null });

    try {
      const createdEvent = await eventsApi.createNewEvent(payload);

      set((state) => ({
        events: [...state.events, createdEvent].sort((a, b) =>
          (a.startedAt ?? "").localeCompare(b.startedAt ?? ""),
        ),
        isMutationLoading: false,
      }));

      return createdEvent;
    } catch (error) {
      set({
        isMutationLoading: false,
        eventsError: getApiErrorMessage(error, "Failed to create event"),
      });

      throw error;
    }
  },
  updateEvent: async (id, payload) => {
    set({ isMutationLoading: true, eventsError: null });

    try {
      const updatedEvent = await eventsApi.updateEvent(id, payload);

      set((state) => ({
        events: state.events
          .map((event) => (event.id === id ? updatedEvent : event))
          .sort((a, b) => (a.startedAt ?? "").localeCompare(b.startedAt ?? "")),
        joinedEvents: state.joinedEvents.map((joinedEvent) =>
          joinedEvent.event.id === id
            ? { ...joinedEvent, event: updatedEvent }
            : joinedEvent,
        ),
        isMutationLoading: false,
      }));

      return updatedEvent;
    } catch (error) {
      set({
        isMutationLoading: false,
        eventsError: getApiErrorMessage(error, "Failed to update event"),
      });

      throw error;
    }
  },
  removeEvent: async (id) => {
    set({ isMutationLoading: true, mutatingEventId: id, eventsError: null });

    try {
      await eventsApi.removeEvent(id);

      set((state) => ({
        events: state.events.filter((event) => event.id !== id),
        joinedEvents: state.joinedEvents.filter(
          (joinedEvent) => joinedEvent.event.id !== id,
        ),
        isMutationLoading: false,
        mutatingEventId: null,
      }));
    } catch (error) {
      set({
        isMutationLoading: false,
        mutatingEventId: null,
        eventsError: getApiErrorMessage(error, "Failed to delete event"),
      });

      throw error;
    }
  },
  loadJoinedEvents: async () => {
    set({ isJoinedLoading: true, eventsError: null });

    try {
      const joinedEvents = await meApi.getJoinedEvents();
      set({ joinedEvents, isJoinedLoading: false });
    } catch (error) {
      set({
        isJoinedLoading: false,
        eventsError: getApiErrorMessage(error, "Failed to load joined events"),
      });
      throw error;
    }
  },
  joinEvent: async (id) => {
    set({ isMutationLoading: true, mutatingEventId: id, eventsError: null });

    try {
      await eventsApi.joinEvent(id);
      await get().loadJoinedEvents();

      set({ isMutationLoading: false, mutatingEventId: null });
    } catch (error) {
      set({
        isMutationLoading: false,
        mutatingEventId: null,
        eventsError: getApiErrorMessage(error, "Failed to join to event"),
      });

      throw error;
    }
  },
  leaveEvent: async (id) => {
    set({ isMutationLoading: true, mutatingEventId: id, eventsError: null });

    try {
      await eventsApi.leaveEvent(id);

      set((state) => ({
        joinedEvents: state.joinedEvents.filter(
          (joinedEvent) => joinedEvent.event.id !== id,
        ),
        isMutationLoading: false,
        mutatingEventId: null,
      }));
    } catch (error) {
      set({
        isMutationLoading: false,
        mutatingEventId: null,
        eventsError: getApiErrorMessage(error, "Failed to leave event"),
      });

      throw error;
    }
  },

  loadFavoriteEvents: async () => {
    set({ isFavoritesLoading: true, eventsError: null });

    try {
      const favoriteEvents = await meApi.getFavoriteEvents();
      set({ favoriteEvents, isFavoritesLoading: false });
    } catch (error) {
      set({
        isFavoritesLoading: false,
        eventsError: getApiErrorMessage(
          error,
          "Failed to load favorite events",
        ),
      });
      throw error;
    }
  },

  addFavorite: async (id) => {
    set({ isMutationLoading: true, mutatingEventId: id, eventsError: null });

    try {
      await meApi.addFavorite(id);
      await get().loadFavoriteEvents();
      set({ isMutationLoading: false, mutatingEventId: null });
    } catch (error) {
      set({
        isMutationLoading: false,
        mutatingEventId: null,
        eventsError: getApiErrorMessage(error, "Failed to add favorite"),
      });
      throw error;
    }
  },

  removeFavorite: async (id) => {
    set({ isMutationLoading: true, mutatingEventId: id, eventsError: null });

    try {
      await meApi.removeFavorite(id);
      set((state) => ({
        favoriteEvents: state.favoriteEvents.filter((e) => e.id !== id),
        isMutationLoading: false,
        mutatingEventId: null,
      }));
    } catch (error) {
      set({
        isMutationLoading: false,
        mutatingEventId: null,
        eventsError: getApiErrorMessage(error, "Failed to remove favorite"),
      });
      throw error;
    }
  },
}));
