import { create } from "zustand";
import type {
  AuthLoginRequest,
  AuthRegisterRequest,
  UserPublic,
} from "@/shared/api/auth/types";
import { getAuthToken, setAuthToken } from "@/shared/api/auth-token";
import { authApi } from "@/shared/api/auth/auth-api";
import { isAxiosError } from "@/shared/api/http";
import { getApiErrorMessage } from "@/lib/get-api-error-message";

type AuthState = {
  user: UserPublic | null;
  isBootstrapped: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  bootstrap: () => Promise<void>;
  login: (payload: AuthLoginRequest) => Promise<void>;
  register: (payload: AuthRegisterRequest) => Promise<void>;
  logout: () => void;
  clearAuthError: () => void;
  fetchMe: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isBootstrapped: false,
  isAuthLoading: false,
  authError: null,
  bootstrap: async () => {
    if (get().isBootstrapped) return;

    set({ isAuthLoading: true, authError: null });

    try {
      if (!getAuthToken()) {
        set({ user: null, isBootstrapped: true, isAuthLoading: false });
        return;
      }

      const { id, email, name } = await authApi.me();
      set({
        user: { id, email, name },
        isBootstrapped: true,
        isAuthLoading: false,
      });
    } catch (error) {
      console.error(error);
      if (isAxiosError(error) && error.response?.status === 401) {
        setAuthToken(null);
      }
      set({ user: null, isBootstrapped: true, isAuthLoading: false });
    }
  },
  login: async (payload) => {
    set({ isAuthLoading: true, authError: null });

    try {
      const { token, user } = await authApi.login(payload);
      setAuthToken(token);
      set({ user, isAuthLoading: false });
    } catch (error) {
      console.error(error);
      set({
        isAuthLoading: false,
        authError: getApiErrorMessage(error, "Failed to log in"),
      });
    }
  },
  register: async (payload) => {
    set({ isAuthLoading: true, authError: null });

    try {
      const { token, user } = await authApi.register(payload);
      setAuthToken(token);
      set({ user, isAuthLoading: false });
    } catch (error) {
      console.error(error);
      set({
        isAuthLoading: false,
        authError: getApiErrorMessage(error, "Failed to register"),
      });
    }
  },
  logout: () => {
    setAuthToken(null);
    set({ user: null, authError: null });
  },
  clearAuthError: () => {
    set({ authError: null });
  },
  fetchMe: async () => {
    if (!getAuthToken()) {
      set({ user: null });
      return;
    }

    try {
      const { id, email, name } = await authApi.me();
      set({ user: { id, email, name } });
    } catch (error) {
      console.error(error);
      setAuthToken(null);
      set({ user: null });
    }
  },
}));
