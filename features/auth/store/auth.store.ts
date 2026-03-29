import { create } from "zustand";
import Cookies from "js-cookie";
import { AuthUser } from "../types/auth.types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:
    typeof window !== "undefined" && Cookies.get("user")
      ? JSON.parse(Cookies.get("user") as string)
      : null,
  token: typeof window !== "undefined" ? Cookies.get("token") || null : null,
  setAuth: (user, token) => {
    Cookies.set("token", token, { expires: 7, sameSite: "strict", path: "/" });
    Cookies.set("user", JSON.stringify(user), {
      expires: 7,
      sameSite: "strict",
      path: "/",
    });
    set({ user, token });
  },
  logout: () => {
    Cookies.remove("token", { path: "/" });
    Cookies.remove("user", { path: "/" });
    set({ user: null, token: null });
  },
}));
