import dayjs from "dayjs";
import type { DateRangeKey, DashboardQuery } from "../types/dashboard.types";

export function buildQueryFromRange(rangeKey: DateRangeKey, customFrom?: string, customTo?: string): DashboardQuery {
  const today = dayjs();

  if (rangeKey === "thisMonth") {
    return {
      dateFrom: today.startOf("month").format("YYYY-MM-DD"),
      dateTo: today.endOf("month").format("YYYY-MM-DD"),
    };
  }

  if (rangeKey === "7d") {
    return {
      dateFrom: today.subtract(6, "day").startOf("day").toISOString(),
      dateTo: today.endOf("day").toISOString(),
    };
  }

  if (rangeKey === "30d") {
    return {
      dateFrom: today.subtract(29, "day").format("YYYY-MM-DD"),
      dateTo: today.format("YYYY-MM-DD"),
    };
  }

  if (rangeKey === "3m") {
    return {
      dateFrom: today.subtract(3, "month").startOf("day").toISOString(),
      dateTo: today.endOf("day").toISOString(),
    };
  }

  return {
    dateFrom: customFrom,
    dateTo: customTo,
  };
}
