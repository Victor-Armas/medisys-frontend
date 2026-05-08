"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { TooltipContentProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { CHART_COLORS, CONSULTATION_TYPE_LABELS } from "../constants/dashboard.constants";
import type { TypeCount } from "../types/dashboard.types";

interface ConsultTypeDataPoint {
  type: string;
  label: string;
  count: number;
}

function ConsultTooltip({ active, payload, label }: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-interior border border-disable/20 rounded-xl shadow-lg px-4 py-2.5 text-xs">
      <p className="font-bold text-encabezado">{CONSULTATION_TYPE_LABELS[label as string] ?? label}</p>
      <p className="text-principal font-semibold mt-0.5">{payload[0].value}</p>
    </div>
  );
}

interface ConsultationTypesChartProps {
  data: TypeCount[];
}

export function ConsultationTypesChart({ data }: ConsultationTypesChartProps) {
  const mapped: ConsultTypeDataPoint[] = data.map((d) => ({
    type: d.type,
    label: CONSULTATION_TYPE_LABELS[d.type] ?? d.type,
    count: d.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={mapped} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-disable)" opacity={0.4} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 9, fill: "var(--color-subtitulo)" }}
          tickLine={false}
          axisLine={false}
          interval={0}
          angle={-10}
          textAnchor="end"
          height={40}
        />
        <YAxis tick={{ fontSize: 10, fill: "var(--color-subtitulo)" }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip content={ConsultTooltip} cursor={{ fill: "var(--color-fondo-inputs)" }} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {mapped.map((_, index) => (
            <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
