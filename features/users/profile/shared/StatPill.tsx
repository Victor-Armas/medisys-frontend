interface Props {
  icon: React.ReactNode;
  label: string;
  color: string;
  bg: string;
}

export function StatPill({ icon, label, color, bg }: Props) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border"
      style={{ color, backgroundColor: bg, borderColor: `${color}30` }}
    >
      {icon}
      {label}
    </span>
  );
}
