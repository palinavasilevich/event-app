import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
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
  myEventsFilter: MyEventsFilter;
  isEventsLoading: boolean;
  isJoinedLoading: boolean;
  isMutationLoading: boolean;
  eventsError: string | null;
  setMyEventsFilter: (filter: MyEventsFilter) => void;
  loadEvents: () => Promise<void>;
  createEvent: (payload: CreateEventRequest) => Promise<EventDto>;
  updateEvent: (id: string, payload: UpdateEventRequest) => Promise<EventDto>;
  removeEvent: (id: string) => Promise<void>;
  loadJoinedEvents: () => Promise<void>;
  joinEvent: (id: string) => Promise<void>;
  leaveEvent: (id: string) => Promise<void>;
};

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  joinedEvents: [],
  myEventsFilter: "created",
  isEventsLoading: false,
  isJoinedLoading: false,
  isMutationLoading: false,
  eventsError: null,
  setMyEventsFilter: (filter) => set({ myEventsFilter: filter }),
  loadEvents: async () => {
    set({ isEventsLoading: true, eventsError: null });

    try {
      const events = await eventsApi.getAllEvents();
      set({ events, isEventsLoading: false });
      set({});
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
          a.startedAt.localeCompare(b.startedAt),
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
          .sort((a, b) => a.startedAt.localeCompare(b.startedAt)),
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
    set({ isMutationLoading: true, eventsError: null });

    try {
      await eventsApi.removeEvent(id);

      set((state) => ({
        events: state.events.filter((event) => event.id !== id),
        joinedEvents: state.joinedEvents.filter(
          (joinedEvent) => joinedEvent.event.id !== id,
        ),
        isMutationLoading: false,
      }));
    } catch (error) {
      set({
        isMutationLoading: false,
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
    set({ isMutationLoading: true, eventsError: null });

    try {
      await eventsApi.joinEvent(id);
      await get().loadJoinedEvents();

      set({ isMutationLoading: false });
    } catch (error) {
      set({
        isMutationLoading: false,
        eventsError: getApiErrorMessage(error, "Failed to join to event"),
      });

      throw error;
    }
  },
  leaveEvent: async (id) => {
    set({ isMutationLoading: true, eventsError: null });

    try {
      await eventsApi.leaveEvent(id);

      set((state) => ({
        joinedEvents: state.joinedEvents.filter(
          (joinedEvent) => joinedEvent.event.id !== id,
        ),
        mutationLoading: false,
      }));
    } catch (error) {
      set({
        isMutationLoading: false,
        eventsError: getApiErrorMessage(error, "Failed to leave to event"),
      });

      throw error;
    }
  },
}));
