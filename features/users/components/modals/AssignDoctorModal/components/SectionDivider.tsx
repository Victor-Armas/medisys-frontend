interface Props {
  label: string;
  icon: React.ReactNode;
  color: string;
}

export function SectionDivider({ label, icon, color }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.15em] whitespace-nowrap"
        style={{ color }}
      >
        {icon}
        {label}
      </div>
      <div className="flex-1 h-px bg-border-default dark:bg-white/5" />
    </div>
  );
}
