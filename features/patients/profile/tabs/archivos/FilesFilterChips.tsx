"use client";

interface Props {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

export function FilesFilterChip({ label, count, active, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold transition-colors ${
        active ? "bg-principal text-white border-transparent" : " text-subtitulo border-border-default hover:bg-interior"
      }`}
    >
      {label} <span className="ml-1 text-text-muted">({count})</span>
    </button>
  );
}
