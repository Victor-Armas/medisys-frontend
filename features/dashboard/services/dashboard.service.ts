import api from "@/shared/lib/api";
import type { DashboardQuery, DashboardStats } from "../types/dashboard.types";

export const dashboardService = {
  getStats: async (query: DashboardQuery): Promise<DashboardStats> => {
    const res = await api.get<DashboardStats>("/dashboard/stats", { params: query });
    return res.data;
  },
};
