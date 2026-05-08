import { cn } from "@/shared/lib/utils";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className }: ChartCardProps) {
  return (
    <div className={cn("bg-interior rounded-xl p-5 shadow-sm border border-disable/10 flex flex-col gap-4", className)}>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-subtitulo">{title}</h3>
      {children}
    </div>
  );
}
