"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { TooltipContentProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

import { STATUS_COLORS, STATUS_LABELS } from "../constants/dashboard.constants";
import type { StatusCount } from "../types/dashboard.types";

interface StatusDataPoint {
  name: string;
  value: number;
  fill: string;
}

function StatusTooltip({ active, payload }: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const statusLabel = STATUS_LABELS[item.name ?? ""] ?? item.name;

  return (
    <div className="bg-interior border border-disable/20 rounded-xl shadow-lg px-4 py-2.5 text-xs">
      <p className="font-bold" style={{ color: item.payload?.fill as string }}>
        {statusLabel}
      </p>
      <p className="text-encabezado font-semibold mt-0.5">{item.value} citas</p>
    </div>
  );
}

interface StatusDonutChartProps {
  data: StatusCount[];
}

export function StatusDonutChart({ data }: StatusDonutChartProps) {
  const mapped: StatusDataPoint[] = data.map((d) => ({
    name: d.status,
    value: d.count,
    fill: STATUS_COLORS[d.status] ?? "#94a3b8",
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={mapped} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
          {mapped.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip content={StatusTooltip} />
        <Legend
          formatter={(value: string) => STATUS_LABELS[value] ?? value}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, color: "var(--color-subtitulo)" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
