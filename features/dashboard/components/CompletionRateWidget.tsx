interface CompletionRateWidgetProps {
  rate: number;
  completed: number;
  cancelled: number;
  noShow: number;
  total: number;
}

export function CompletionRateWidget({ rate, completed, cancelled, noShow, total }: CompletionRateWidgetProps) {
  const circumference = 2 * Math.PI * 50;
  const offset = circumference * (1 - rate / 100);
  const lossRate = total > 0 ? Math.round(((cancelled + noShow) / total) * 100) : 0;

  return (
    <div className="bg-interior rounded-xl p-5 shadow-sm border border-disable/10">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-32 h-32 shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-fondo-inputs)" strokeWidth="12" />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#7405a6"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-principal tabular-nums">{rate}%</span>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-bold text-encabezado">Tasa de cumplimiento</h4>
          <p className="text-sm text-subtitulo mt-1 leading-relaxed max-w-sm">
            De las citas agendadas, <strong className="text-positive-text">{completed}</strong> fueron atendidas. Las
            cancelaciones ({cancelled}) y ausencias ({noShow}) representan el{" "}
            <strong className="text-negative-text">{lossRate}%</strong> de pérdida.
          </p>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-principal shrink-0" />
              <span className="text-xs text-subtitulo">Completadas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-fondo-inputs border border-disable shrink-0" />
              <span className="text-xs text-subtitulo">Restantes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
