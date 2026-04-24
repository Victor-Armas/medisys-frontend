// features/appointments/store/clinicColors.store.ts
import { create } from "zustand";
import Cookies from "js-cookie";

const COOKIE_KEY_PREFIX = "medisys_clinic_colors_";

function buildCookieKey(userId: string): string {
  return `${COOKIE_KEY_PREFIX}${userId}`;
}

function loadFromCookie(userId: string): Record<string, string> {
  try {
    const raw = Cookies.get(buildCookieKey(userId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToCookie(userId: string, overrides: Record<string, string>): void {
  Cookies.set(buildCookieKey(userId), JSON.stringify(overrides), {
    expires: 365,
    path: "/",
  });
}

interface ClinicColorsState {
  overrides: Record<string, string>;
  initForUser: (userId: string) => void;
  setClinicColor: (clinicId: string, color: string, userId: string) => void;
  resetClinicColor: (clinicId: string, userId: string) => void;
}

export const useClinicColorsStore = create<ClinicColorsState>((set, get) => ({
  overrides: {},

  initForUser: (userId) => {
    set({ overrides: loadFromCookie(userId) });
  },

  setClinicColor: (clinicId, color, userId) => {
    const next = { ...get().overrides, [clinicId]: color };
    set({ overrides: next });
    saveToCookie(userId, next);
  },

  resetClinicColor: (clinicId, userId) => {
    const next = { ...get().overrides };
    delete next[clinicId];
    set({ overrides: next });
    saveToCookie(userId, next);
  },
}));
