import { Clock } from "lucide-react";
import type { DoctorSchedule } from "@features/users/types/doctors.types";

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

interface Props {
  schedules: DoctorSchedule[];
}

function calcBlockHours(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh + em / 60 - (sh + sm / 60);
}

function formatHours(hrs: number): string {
  return hrs % 1 === 0 ? `${hrs}` : hrs.toFixed(1);
}

export function ClinicWeeklySchedule({ schedules }: Props) {
  const byDay = schedules.reduce<Record<number, DoctorSchedule[]>>((acc, s) => {
    if (!acc[s.weekDay]) acc[s.weekDay] = [];
    acc[s.weekDay].push(s);
    return acc;
  }, {});

  const totalHours = schedules.reduce((acc, s) => acc + calcBlockHours(s.startTime, s.endTime), 0);

  if (schedules.length === 0) {
    return (
      <p className="text-xs text-text-disabled flex items-center gap-1.5">
        <Clock size={11} /> Sin horarios configurados
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-7 gap-1.5">
        {DAYS.map((day, i) => {
          const blocks = byDay[i] ?? [];
          const hrs = blocks.reduce((acc, s) => acc + calcBlockHours(s.startTime, s.endTime), 0);
          const hasBlocks = blocks.length > 0;

          return (
            <div key={i} className="flex flex-col gap-1">
              <div
                className={`text-[10px] font-medium text-center py-1 rounded-md ${hasBlocks ? "bg-brand/10 text-brand" : "bg-bg-subtle text-text-secondary"}`}
              >
                {day}
              </div>
              {hasBlocks ? (
                blocks.map((s) => (
                  <div key={s.id} className="text-[10px] text-brand bg-brand/10 border border-brand/20 rounded-md py-1 px-0.5 text-center leading-tight">
                    {s.startTime}
                    <br />
                    {s.endTime}
                  </div>
                ))
              ) : (
                <div className="text-[10px] text-text-disabled text-center py-1">—</div>
              )}
              <div
                className={`text-[10px] font-medium text-center py-0.5 rounded-md mt-auto ${hasBlocks ? "bg-brand/10 text-brand border border-brand/20" : "text-text-disabled"}`}
              >
                {hasBlocks ? `${formatHours(hrs)} hrs` : "0 hrs"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-default/50">
        <span className="text-xs text-text-secondary flex items-center gap-1.5">
          <Clock size={11} /> Total semanal
        </span>
        <span className="text-xs font-semibold text-brand bg-brand/10 border border-brand/20 px-3 py-0.5 rounded-full">
          {formatHours(totalHours)} hrs / semana
        </span>
      </div>
    </>
  );
}
