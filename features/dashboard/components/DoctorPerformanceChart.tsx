"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { TooltipContentProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { DoctorPerformanceStat } from "../types/dashboard.types";

function DoctorTooltip({ active, payload, label }: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-interior border border-disable/20 rounded-xl shadow-lg px-4 py-2.5 text-xs">
      <p className="font-bold text-encabezado mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.fill as string }} className="font-medium">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

interface DoctorPerformanceChartProps {
  data: DoctorPerformanceStat[];
}

export function DoctorPerformanceChart({ data }: DoctorPerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-disable)" opacity={0.4} />
        <XAxis dataKey="name" tick={{ fontSize: 9, fill: "var(--color-subtitulo)" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "var(--color-subtitulo)" }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip content={(props) => <DoctorTooltip {...props} />} cursor={{ fill: "var(--color-fondo-inputs)" }} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "var(--color-subtitulo)" }} />
        <Bar dataKey="total" name="Total" fill="#7405a6" radius={[4, 4, 0, 0]} maxBarSize={32} />
        <Bar dataKey="completed" name="Completadas" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={32} />
        <Bar dataKey="cancelled" name="Canceladas" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}
