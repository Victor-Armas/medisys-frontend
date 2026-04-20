// src/shared/ui/loaders/ECGLoader.tsx
export function ECGLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <svg width="100" height="40" viewBox="0 0 100 40" className="text-principal">
        <polyline
          points="0,20 20,20 25,10 35,30 45,20 55,20 60,5 70,35 80,20 100,20"
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
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: draw-ecg 2s linear infinite;
        }
        @keyframes draw-ecg {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
      <span className="text-[10px] uppercase tracking-[0.2em] text-principal font-bold mt-2">Sincronizando</span>
    </div>
  );
}
