interface Props {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
  icon?: React.ReactNode;
}

export function FieldRow({ label, value, mono, icon }: Props) {
  return (
    <div className="flex items-start justify-between px-5 py-3 group hover:bg-bg-base/30 transition-colors">
      <span className="text-xs font-medium text-subtitulo w-36 shrink-0 pt-0.5">{label}</span>
      <span
        className={`text-right text-sm text-encabezado flex items-center gap-1.5 min-w-0 ${mono ? "font-mono text-xs tracking-wider" : ""}`}
      >
        {icon && <span className="text-subtitulo shrink-0">{icon}</span>}
        {value ? <span className="truncate">{value}</span> : <span className="text-subtitulo">—</span>}
      </span>
    </div>
  );
}
