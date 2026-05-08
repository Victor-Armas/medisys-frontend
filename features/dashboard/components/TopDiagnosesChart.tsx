"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { TooltipContentProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { CHART_COLORS } from "../constants/dashboard.constants";
import type { TopDiagnosisStat } from "../types/dashboard.types";

interface DiagDataPoint extends TopDiagnosisStat {
  label: string;
}

function DiagTooltip({ active, payload }: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;

  const d = payload[0].payload as DiagDataPoint;

  return (
    <div className="bg-interior border border-disable/20 rounded-xl shadow-lg px-4 py-2.5 text-xs max-w-[220px]">
      {d.icd10Code && <p className="font-mono text-principal font-bold">{d.icd10Code}</p>}
      <p className="text-encabezado font-medium leading-snug mt-0.5">{d.description}</p>
      <p className="text-subtitulo mt-1">{d.count} consultas</p>
    </div>
  );
}

interface TopDiagnosesChartProps {
  data: TopDiagnosisStat[];
}

export function TopDiagnosesChart({ data }: TopDiagnosesChartProps) {
  const mapped: DiagDataPoint[] = data.map((d) => ({
    ...d,
    label: d.icd10Code ? d.icd10Code : d.description.length > 14 ? `${d.description.slice(0, 13)}…` : d.description,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart layout="vertical" data={mapped} margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-disable)" opacity={0.4} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 10, fill: "var(--color-subtitulo)" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={64}
          tick={{
            fontSize: 9,
            fill: "var(--color-subtitulo)",
            fontFamily: "monospace",
          }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={DiagTooltip} cursor={{ fill: "var(--color-fondo-inputs)" }} />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={20}>
          {mapped.map((_, index) => (
            <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
