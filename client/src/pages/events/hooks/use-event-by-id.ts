import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { eventsApi } from "@/shared/api/events/events-api";
import type { EventDto } from "@/shared/api/events/types";
import { isAxiosError } from "@/shared/api/http";
import { useEventsStore } from "@/stores/events-store";
import { useCallback, useEffect, useReducer, useState } from "react";

type State = {
  event: EventDto | null;
  isLoading: boolean;
  isNotFound: boolean;
  loadError: string | null;
};

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; event: EventDto }
  | { type: "FETCH_NOT_FOUND" }
  | { type: "FETCH_ERROR"; message: string }
  | { type: "RESET" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, isNotFound: false, loadError: null };
    case "FETCH_SUCCESS":
      return {
        event: action.event,
        isLoading: false,
        isNotFound: false,
        loadError: null,
      };
    case "FETCH_NOT_FOUND":
      return {
        event: null,
        isLoading: false,
        isNotFound: true,
        loadError: null,
      };
    case "FETCH_ERROR":
      return {
        event: null,
        isLoading: false,
        isNotFound: false,
        loadError: action.message,
      };
    case "RESET":
      if (
        !state.event &&
        !state.isLoading &&
        !state.isNotFound &&
        !state.loadError
      ) {
        return state;
      }
      return {
        event: null,
        isLoading: false,
        isNotFound: false,
        loadError: null,
      };
  }
}

type UseEventByIdOptions = {
  fetchJoinedEvents?: boolean;
};

export function useEventById(
  id: string | undefined,
  options?: UseEventByIdOptions,
) {
  const fetchJoinedEvents = options?.fetchJoinedEvents ?? false;
  const loadJoinedEvents = useEventsStore((state) => state.loadJoinedEvents);

  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  const [state, dispatch] = useReducer(reducer, {
    event: null,
    isLoading: !!id,
    isNotFound: false,
    loadError: null,
  });

  useEffect(() => {
    if (!id) {
      dispatch({ type: "RESET" });
      return;
    }

    const controller = new AbortController();
    dispatch({ type: "FETCH_START" });

    const loadEvent = async () => {
      try {
        const [event] = await Promise.all([
          eventsApi.getEventById(id, controller.signal),
          fetchJoinedEvents
            ? loadJoinedEvents().catch(() => undefined)
            : Promise.resolve(undefined),
        ]);

        dispatch({ type: "FETCH_SUCCESS", event });
      } catch (error) {
        if (controller.signal.aborted) return;

        if (isAxiosError(error) && error.response?.status === 404) {
          dispatch({ type: "FETCH_NOT_FOUND" });
          return;
        }

        dispatch({
          type: "FETCH_ERROR",
          message: getApiErrorMessage(error, "Failed to load event"),
        });
      }
    };

    loadEvent();

    return () => {
      controller.abort();
    };
  }, [id, fetchJoinedEvents, loadJoinedEvents, reloadKey]);

  return { ...state, reload };
}
