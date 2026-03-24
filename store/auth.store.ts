import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { AuthUser } from "@/types/auth.types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        // Guarda en cookie para que el middleware pueda leerla
        // expires: 7 días, sameSite strict por seguridad
        Cookies.set("token", token, { expires: 7, sameSite: "strict" });
        set({ user, token });
      },
      logout: () => {
        Cookies.remove("token");
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
