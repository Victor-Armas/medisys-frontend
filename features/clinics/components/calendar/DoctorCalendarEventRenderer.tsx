import dayjs from "dayjs";
import { CustomCalendarEvent, parseEventId } from "../../hooks/useCalendarEvents";

interface Props {
  event: CustomCalendarEvent;
  view: string;
  today: dayjs.Dayjs;
}

export function DoctorCalendarEventRenderer({ event, view, today }: Props) {
  const parsed = parseEventId(event.id as string);
  const dateStr = parsed?.dateStr ?? (event.start as dayjs.Dayjs).format("YYYY-MM-DD");
  const isPast = dayjs(dateStr).isBefore(today, "day");
  const type = event.type ?? "BASE";

  // ── MONTH VIEW ─────────────────────────────────────────────────────────────
  if (view === "month") {
    if (event.allDay) {
      // UNAVAILABLE full-day pill
      return (
        <div
          tabIndex={-1}
          role="presentation"
          className="rounded-full px-2 py-[2px] text-[10px] font-bold tracking-wide text-center uppercase truncate"
          style={{
            backgroundColor: isPast ? "#ef444430" : `${event.backgroundColor}25`,
            color: isPast ? "#ef444460" : (event.backgroundColor as string),
            border: `1px solid ${isPast ? "#ef444440" : event.backgroundColor}`,
          }}
        >
          INHÁBIL
        </div>
      );
    }

    const start = (event.start as dayjs.Dayjs).format("HH:mm");
    const end = (event.end as dayjs.Dayjs).format("HH:mm");

    return (
      <div
        tabIndex={-1}
        role="presentation"
        className="rounded-full px-2 py-[2px] text-[10px] font-semibold truncate text-center"
        style={{
          backgroundColor: isPast ? `${event.backgroundColor}18` : `${event.backgroundColor}22`,
          color: isPast ? `${event.backgroundColor}70` : (event.backgroundColor as string),
          border: `1px solid ${isPast ? `${event.backgroundColor}30` : event.backgroundColor}`,
          opacity: isPast ? 0.65 : 1,
        }}
      >
        {start} - {end}
      </div>
    );
  }

  // ── WEEK / DAY VIEW ────────────────────────────────────────────────────────
  const start = (event.start as dayjs.Dayjs).format("HH:mm");
  const end = (event.end as dayjs.Dayjs).format("HH:mm");

  return (
    <div
      tabIndex={-1}
      role="presentation"
      className="flex flex-col h-full px-2 py-1.5  overflow-hidden gap-0.5"
      style={{
        backgroundColor: isPast ? `${event.backgroundColor}40` : (event.backgroundColor as string),
        color: isPast ? `${event.backgroundColor}90` : (event.color as string),
        opacity: isPast ? 0.7 : 1,
        borderLeft: `3px solid ${isPast ? `${event.backgroundColor}60` : `${event.backgroundColor}`}`,
      }}
    >
      {/* Time range */}
      <span className="text-[11px] font-bold leading-tight whitespace-nowrap">
        {start} – {end}
      </span>

      {/* Type badge */}

      {/* Note (CUSTOM / AVAILABLE) */}
      {event.title && type !== "BASE" && (
        <span className="text-[10px] leading-tight opacity-80 truncate mt-auto">{event.title}</span>
      )}
    </div>
  );
}
