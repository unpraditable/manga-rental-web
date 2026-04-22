import { create } from "zustand";
import Cookies from "js-cookie";
import { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    Cookies.set("access_token", token, { expires: 7, sameSite: "lax" });
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    Cookies.remove("access_token");
    set({ user: null, isAuthenticated: false });
  },
}));
