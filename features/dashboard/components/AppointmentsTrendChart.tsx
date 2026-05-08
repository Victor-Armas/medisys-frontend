"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { TooltipContentProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import dayjs from "dayjs";
import "dayjs/locale/es";
import type { AppointmentByDay } from "../types/dashboard.types";

interface TrendDataPoint extends AppointmentByDay {
  label: string;
}

function TrendTooltip({ active, payload, label }: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;

  const dateStr = payload[0]?.payload?.date as string | undefined;

  return (
    <div className="bg-interior border border-disable/20 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-encabezado mb-2">
        {dateStr
          ? dayjs(dateStr).locale("es").format("D MMM YYYY")
          : label}
      </p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="font-medium">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

interface AppointmentsTrendChartProps {
  data: AppointmentByDay[];
}

export function AppointmentsTrendChart({ data }: AppointmentsTrendChartProps) {
  const formatted: TrendDataPoint[] = data.map((d) => ({
    ...d,
    label: dayjs(d.date).locale("es").format("D MMM"),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={formatted} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7405a6" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#7405a6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-disable)" opacity={0.4} />
        <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--color-subtitulo)" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "var(--color-subtitulo)" }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip content={TrendTooltip} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "var(--color-subtitulo)" }} />
        <Area
          type="monotone"
          dataKey="total"
          name="Total"
          stroke="#7405a6"
          strokeWidth={2}
          fill="url(#gradTotal)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="completed"
          name="Completadas"
          stroke="#22c55e"
          strokeWidth={2}
          fill="url(#gradCompleted)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="cancelled"
          name="Canceladas"
          stroke="#ef4444"
          strokeWidth={1.5}
          fill="none"
          dot={false}
          strokeDasharray="4 4"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
