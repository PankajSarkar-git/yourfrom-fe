import { create } from "zustand";
import { authService } from "../services/auth.service";

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  initialized: boolean;

  login: (payload: { user: User; accessToken: string }) => void;

  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  loading: true,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  initialized: false,

  login: ({ user, accessToken }) => {
    localStorage.setItem("accessToken", accessToken);

    set({
      user,
      accessToken,
      isAuthenticated: true,
      loading: false,
    });
  },

  checkAuth: async () => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    ) {
      set({ loading: false, initialized: true });
      return;
    }
    try {
      const { data } = await authService.me();
      set({
        user: data.data,
        isAuthenticated: true,
        loading: false,
        initialized: true,
      });
    } catch {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
        initialized: true,
      });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem("accessToken");

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
    }
  },
}));
