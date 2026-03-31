interface Props {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  accentColor?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, icon, action, accentColor = "var(--color-brand)", children }: Props) {
  return (
    <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-default relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full" style={{ background: accentColor }} />
        <div className="flex items-center gap-2 pl-2">
          {icon && <span style={{ color: accentColor }}>{icon}</span>}
          <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
