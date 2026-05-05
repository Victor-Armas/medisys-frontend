"use client";

export default function EmptyPatientMsg({ tab }: { tab: string }) {
  return (
    <div className="flex-1 flex items-center justify-center text-subtitulo text-sm bg-interior rounded-xl border border-disable/20 py-16">
      <p>Selecciona un paciente para ver el {tab}</p>
    </div>
  );
}
