import {
  ArrowLeft,
  User,
  Activity,
  Filter,
  FileText,
  Pill,
  FlaskConical,
  Printer,
  Share2,
  Plus,
  HeartPulse,
  Droplets,
  AlertCircle,
  Stethoscope,
  Phone,
  Mail,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";

export default function PatientRecordPage({
  params,
}: {
  params: { id: string };
}) {
  // Simulando el expediente de "Elena Rodríguez" basándose en el mock
  const patient = {
    id: params.id || "PAT-001",
    name: "Elena Rodríguez Sánchez",
    curp: "ROSE890524MDFXNR01",
    dob: "24 Mayo 1989",
    age: 34,
    gender: "Femenino",
    phone: "+52 55 1234 5678",
    email: "elena.rodriguez@email.com",
    bloodType: "O+",
    weight: "65 kg",
    height: "1.68 m",
    imc: "23.0 (Normal)",
    allergies: ["Penicilina", "Nueces"],
    chronic: ["Hipertensión Arterial (2020)"],
    emergencyContact: {
      name: "Roberto Martínez (Esposo)",
      phone: "+52 55 8765 4321",
    },
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-10">
      {/* 1. Header Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/records"
            className="p-2 border border-border-default rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">
              Expediente Clínico
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              ID: <span className="font-mono">{patient.id}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            className="flex items-center justify-center gap-2 p-2.5 border border-border-default rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
            title="Imprimir Expediente"
          >
            <Printer size={18} />
          </button>
          <button
            className="flex items-center justify-center gap-2 p-2.5 border border-border-default rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
            title="Compartir"
          >
            <Share2 size={18} />
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-brand text-white rounded-xl text-sm font-medium hover:bg-brand-hover transition-colors shadow-sm">
            <Plus size={16} />
            Nueva Consulta
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* COLUMNA IZQUIERDA: Perfil del Paciente (Fixed / Sticky preferiblemente) */}
        <div className="xl:col-span-3 space-y-4">
          {/* Tarjeta de Identificación */}
          <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden shadow-sm">
            <div className="h-24 bg-linear-to-r from-brand-gradient-from to-brand-gradient-to relative">
              {/* Status Badge */}
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md text-white text-[11px] font-bold uppercase tracking-wide border border-white/30">
                ACTIVO
              </div>
            </div>

            <div className="px-5 pb-5 relative">
              <div className="w-20 h-20 rounded-full border-4 border-bg-surface bg-bg-base flex items-center justify-center text-3xl font-bold text-brand shadow-sm absolute -top-10">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>

              <div className="mt-12">
                <h3 className="text-lg font-bold text-text-primary leading-tight">
                  {patient.name}
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  {patient.age} años • {patient.gender}
                </p>
                <div className="mt-4 pt-4 border-t border-border-default space-y-3">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Phone size={14} />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Mail size={14} />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-text-secondary">
                    <FileText size={14} className="mt-0.5" />
                    <span className="break-all font-mono text-xs">
                      {patient.curp}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de Constantes Físicas */}
          <div className="bg-bg-surface border border-border-default rounded-2xl p-5 shadow-sm">
            <h4 className="font-semibold text-text-primary text-sm mb-4">
              Constantes Físicas
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-bg-subtle p-3 rounded-xl border border-border-default/50">
                <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                  <Droplets size={12} className="text-red-500" />
                  <span className="text-[10px] font-bold uppercase">
                    Sangre
                  </span>
                </div>
                <p className="font-bold text-text-primary">
                  {patient.bloodType}
                </p>
              </div>
              <div className="bg-bg-subtle p-3 rounded-xl border border-border-default/50">
                <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                  <Activity size={12} className="text-blue-500" />
                  <span className="text-[10px] font-bold uppercase">
                    Altura
                  </span>
                </div>
                <p className="font-bold text-text-primary">{patient.height}</p>
              </div>
              <div className="bg-bg-subtle p-3 rounded-xl border border-border-default/50">
                <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                  <HeartPulse size={12} className="text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase">Peso</span>
                </div>
                <p className="font-bold text-text-primary">{patient.weight}</p>
              </div>
              <div className="bg-bg-subtle p-3 rounded-xl border border-border-default/50">
                <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                  <User size={12} className="text-brand" />
                  <span className="text-[10px] font-bold uppercase">IMC</span>
                </div>
                <p className="font-bold text-text-primary text-xs">
                  {patient.imc}
                </p>
              </div>
            </div>
          </div>

          {/* Alertas */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-red-500" />
              <h4 className="font-semibold text-red-600 dark:text-red-400 text-sm">
                Alertas Médicas
              </h4>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-red-500/80 mb-1">
                  Alergias
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {patient.allergies.map((a) => (
                    <span
                      key={a}
                      className="px-2 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold rounded-md border border-red-500/20"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-red-500/80 mb-1">
                  Condiciones Crónicas
                </p>
                <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400">
                  {patient.chronic.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contacto de Emergencia */}
          <div className="bg-bg-surface border border-border-default rounded-2xl p-5 shadow-sm">
            <h4 className="font-semibold text-text-primary text-sm mb-3">
              Contacto de Emergencia
            </h4>
            <div className="bg-bg-subtle p-3 rounded-xl">
              <p className="font-medium text-sm text-text-primary">
                {patient.emergencyContact.name}
              </p>
              <div className="flex items-center gap-2 mt-1 text-sm text-text-secondary">
                <Phone size={14} />
                <span>{patient.emergencyContact.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Pestañas y Contenido Principal */}
        <div className="xl:col-span-9 flex flex-col gap-4">
          {/* Navegación del Expediente */}
          <div className="bg-bg-surface border border-border-default rounded-2xl p-2 hide-scrollbar overflow-x-auto flex items-center gap-1">
            <button className="flex items-center gap-2 px-4 py-2 bg-bg-subtle text-brand font-medium rounded-xl text-sm whitespace-nowrap">
              <Stethoscope size={16} />
              Historial Clínico
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-subtle/50 font-medium rounded-xl text-sm transition-colors whitespace-nowrap">
              <Pill size={16} />
              Recetas
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-subtle/50 font-medium rounded-xl text-sm transition-colors whitespace-nowrap">
              <FlaskConical size={16} />
              Laboratorios
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-subtle/50 font-medium rounded-xl text-sm transition-colors whitespace-nowrap">
              <FileText size={16} />
              Documentos
            </button>
          </div>

          {/* Área de Notas (Timeline) */}
          <div className="bg-bg-surface border border-border-default rounded-2xl p-6 shadow-sm flex-1">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-text-primary">
                Evolución Médica
              </h3>
              <div className="flex items-center gap-2">
                <button className="flex items-center justify-center p-2 rounded-lg border border-border-default text-text-secondary hover:bg-bg-subtle">
                  <Filter size={14} />
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-8 relative before:absolute before:inset-0 before:left-[19px] before:w-px before:bg-border-default">
              {/* Nota 1 */}
              <div className="relative pl-12">
                <div className="absolute left-0 top-1 w-10 h-10 bg-brand/10 border border-brand/20 rounded-full flex items-center justify-center text-brand z-10">
                  <Stethoscope size={18} />
                </div>

                <div className="bg-bg-base border border-border-default rounded-xl p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-text-primary">
                        Consulta de Seguimiento - Hipertensión
                      </h4>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Por Dr. Arturo Ramos • 12 Mar 2026, 10:30 AM
                      </p>
                    </div>
                    <button className="text-text-secondary hover:text-brand">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                        Motivo de Consulta
                      </p>
                      <p className="text-sm text-text-primary">
                        Revisión mensual de presión arterial. Paciente refiere
                        dolor de cabeza esporádico nocturno.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-3 border-y border-border-default/50">
                      <div>
                        <span className="block text-[10px] text-text-secondary uppercase">
                          P. Arterial
                        </span>
                        <span className="font-semibold text-sm text-red-500">
                          135/85 mmHg
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-text-secondary uppercase">
                          F. Cardiaca
                        </span>
                        <span className="font-semibold text-sm text-text-primary">
                          78 lpm
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-text-secondary uppercase">
                          Temp
                        </span>
                        <span className="font-semibold text-sm text-text-primary">
                          36.5 °C
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-text-secondary uppercase">
                          Sat O2
                        </span>
                        <span className="font-semibold text-sm text-emerald-500">
                          98%
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                        Plan Trimestral
                      </p>
                      <p className="text-sm text-text-primary">
                        Mantener Losartán 50mg cada 12 hrs. Se recomienda
                        disminuir ingesta de sodio y aumentar cardio a 30 min
                        diarios. Próxima revisión en 1 mes con estudios de
                        química sanguínea.
                      </p>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-surface border border-border-default rounded-lg text-xs font-medium text-text-primary hover:border-brand cursor-pointer">
                        <Pill size={14} className="text-brand" />{" "}
                        Receta_Foliada_1203.pdf
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nota 2 */}
              <div className="relative pl-12">
                <div className="absolute left-0 top-1 w-10 h-10 bg-bg-surface border border-border-default rounded-full flex items-center justify-center text-text-secondary z-10">
                  <FlaskConical size={18} />
                </div>

                <div className="bg-bg-surface border border-border-default rounded-xl p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-text-primary">
                        Resultados de Laboratorio Integrados
                      </h4>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Subido por Sistema Core • 10 Mar 2026, 08:15 AM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border-default rounded-lg bg-bg-base">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          Química Sanguínea 24 Elementos
                        </p>
                        <p className="text-xs text-text-secondary">
                          Laboratorios Chopo - PDF 2.4 MB
                        </p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-bg-surface border border-border-default hover:border-brand rounded-lg text-xs font-medium text-text-primary transition-colors">
                      Visualizar
                    </button>
                  </div>
                </div>
              </div>

              {/* End Timeline Marker */}
              <div className="relative pl-12">
                <div className="absolute left-[15px] top-1 w-2 h-2 bg-border-strong rounded-full z-10"></div>
                <div className="text-xs font-medium text-text-disabled uppercase tracking-wide pt-0.5">
                  Fin de los registros (2025)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
