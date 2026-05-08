import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";
import type { DashboardQuery, DashboardStats } from "../types/dashboard.types";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: (query: DashboardQuery) => [...dashboardKeys.all, "stats", query] as const,
};

export function useDashboard(query: DashboardQuery, initialData?: DashboardStats) {
  return useQuery({
    queryKey: dashboardKeys.stats(query),
    queryFn: () => dashboardService.getStats(query),
    initialData,
    staleTime: 2 * 60_000,
    placeholderData: (prev) => prev,
  });
}
