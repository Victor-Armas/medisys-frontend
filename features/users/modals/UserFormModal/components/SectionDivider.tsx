interface Props {
  label: string;
}

export function SectionDivider({ label }: Props) {
  return (
    <div className="flex items-center gap-4 py-1">
      <div className="flex-1 h-px bg-border-default dark:bg-white/5" />
      <span className="text-[10.5px] font-bold text-text-muted dark:text-subtitulo uppercase tracking-[0.15em] whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-border-default dark:bg-white/5" />
    </div>
  );
}
