"use client";

export function ECGLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <svg width="140" height="50" viewBox="0 0 140 50" className="text-principal">
        {/* Glow (copia del trazo detrás) */}
        <polyline
          points="0,25 25,25 32,10 40,40 48,25 60,25 68,5 78,45 88,25 100,25 108,15 115,35 125,25 140,25"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ecg-glow"
        />

        {/* Línea principal */}
        <polyline
          points="0,25 25,25 32,10 40,40 48,25 60,25 68,5 78,45 88,25 100,25 108,15 115,35 125,25 140,25"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ecg-line"
        />
      </svg>

      <style>{`
        .ecg-line {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: ecg-draw 1.8s linear infinite;
        }

        .ecg-glow {
          opacity: 0.15;
          filter: blur(4px);
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: ecg-draw 1.8s linear infinite;
        }

        @keyframes ecg-draw {
          0% {
            stroke-dashoffset: 300;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      <span className="text-[10px] uppercase tracking-[0.2em] text-principal font-bold mt-3">Sincronizando sistema</span>
    </div>
  );
}
