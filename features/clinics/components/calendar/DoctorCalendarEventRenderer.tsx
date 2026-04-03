import { CustomCalendarEvent } from "../../hooks/useCalendarEvents";

interface Props {
  event: CustomCalendarEvent;
  view: string;
}

export function DoctorCalendarEventRenderer({ event, view }: Props) {
  const start = event.start.format("HH:mm");
  const end = event.end.format("HH:mm");

  // MONTH VIEW
  if (view === "month") {
    return (
      <div
        className="rounded-full px-2 py-[2px] text-[10px] font-semibold truncate text-center"
        style={{
          backgroundColor: `${event.backgroundColor}22`,
          color: event.backgroundColor,
          border: `1px solid ${event.backgroundColor}`,
          marginTop: event.type === "CUSTOM" ? "2px" : "0px",
        }}
      >
        {event.type === "UNAVAILABLE" ? "INHÁBIL" : `${start} - ${end}`}
      </div>
    );
  }

  // WEEK / DAY VIEW
  return (
    <div
      className="rounded-md px-2 py-1 text-[11px] font-medium"
      style={{
        backgroundColor: event.backgroundColor,
        color: event.color,
      }}
    >
      {start} – {end}
    </div>
  );
}
