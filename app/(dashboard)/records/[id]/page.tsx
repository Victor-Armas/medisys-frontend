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

export default function PatientRecordPage({ params }: { params: { id: string } }) {
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
            className="p-2 border  rounded-xl text-subtitulo hover:text-encabezado hover:bg-subtitulo transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-encabezado tracking-tight">Expediente Clínico</h2>
            <p className="text-sm text-subtitulo mt-1">
              ID: <span className="font-mono">{patient.id}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            className="flex items-center justify-center gap-2 p-2.5 border  rounded-xl text-subtitulo hover:text-encabezado hover:bg-subtitulo transition-colors"
            title="Imprimir Expediente"
          >
            <Printer size={18} />
          </button>
          <button
            className="flex items-center justify-center gap-2 p-2.5 border  rounded-xl text-subtitulo hover:text-encabezado hover:bg-subtitulo transition-colors"
            title="Compartir"
          >
            <Share2 size={18} />
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-principal text-white rounded-xl text-sm font-medium hover:bg-principal-hover transition-colors shadow-sm">
            <Plus size={16} />
            Nueva Consulta
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* COLUMNA IZQUIERDA: Perfil del Paciente (Fixed / Sticky preferiblemente) */}
        <div className="xl:col-span-3 space-y-4">
          {/* Tarjeta de Identificación */}
          <div className=" border  rounded-2xl overflow-hidden shadow-sm">
            <div className="h-24 bg-linear-to-r from-brand-gradient-from to-brand-gradient-to relative">
              {/* Status Badge */}
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md text-white text-[11px] font-bold uppercase tracking-wide border border-white/30">
                ACTIVO
              </div>
            </div>

            <div className="px-5 pb-5 relative">
              <div className="w-20 h-20 rounded-full border-4 border-bg-surface bg-bg-base flex items-center justify-center text-3xl font-bold text-principal shadow-sm absolute -top-10">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>

              <div className="mt-12">
                <h3 className="text-lg font-bold text-encabezado leading-tight">{patient.name}</h3>
                <p className="text-sm text-subtitulo mt-1">
                  {patient.age} años • {patient.gender}
                </p>
                <div className="mt-4 pt-4 border-t  space-y-3">
                  <div className="flex items-center gap-2 text-sm text-subtitulo">
                    <Phone size={14} />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-subtitulo">
                    <Mail size={14} />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-subtitulo">
                    <FileText size={14} className="mt-0.5" />
                    <span className="break-all font-mono text-xs">{patient.curp}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de Constantes Físicas */}
          <div className=" border  rounded-2xl p-5 shadow-sm">
            <h4 className="font-semibold text-encabezado text-sm mb-4">Constantes Físicas</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-subtitulo p-3 rounded-xl border /50">
                <div className="flex items-center gap-1.5 text-subtitulo mb-1">
                  <Droplets size={12} className="text-red-500" />
                  <span className="text-[10px] font-bold uppercase">Sangre</span>
                </div>
                <p className="font-bold text-encabezado">{patient.bloodType}</p>
              </div>
              <div className="bg-subtitulo p-3 rounded-xl border /50">
                <div className="flex items-center gap-1.5 text-subtitulo mb-1">
                  <Activity size={12} className="text-blue-500" />
                  <span className="text-[10px] font-bold uppercase">Altura</span>
                </div>
                <p className="font-bold text-encabezado">{patient.height}</p>
              </div>
              <div className="bg-subtitulo p-3 rounded-xl border /50">
                <div className="flex items-center gap-1.5 text-subtitulo mb-1">
                  <HeartPulse size={12} className="text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase">Peso</span>
                </div>
                <p className="font-bold text-encabezado">{patient.weight}</p>
              </div>
              <div className="bg-subtitulo p-3 rounded-xl border /50">
                <div className="flex items-center gap-1.5 text-subtitulo mb-1">
                  <User size={12} className="text-principal" />
                  <span className="text-[10px] font-bold uppercase">IMC</span>
                </div>
                <p className="font-bold text-encabezado text-xs">{patient.imc}</p>
              </div>
            </div>
          </div>

          {/* Alertas */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-red-500" />
              <h4 className="font-semibold text-red-600 dark:text-red-400 text-sm">Alertas Médicas</h4>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-red-500/80 mb-1">Alergias</p>
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
                <p className="text-xs font-medium text-red-500/80 mb-1">Condiciones Crónicas</p>
                <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400">
                  {patient.chronic.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contacto de Emergencia */}
          <div className=" border  rounded-2xl p-5 shadow-sm">
            <h4 className="font-semibold text-encabezado text-sm mb-3">Contacto de Emergencia</h4>
            <div className="bg-subtitulo p-3 rounded-xl">
              <p className="font-medium text-sm text-encabezado">{patient.emergencyContact.name}</p>
              <div className="flex items-center gap-2 mt-1 text-sm text-subtitulo">
                <Phone size={14} />
                <span>{patient.emergencyContact.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Pestañas y Contenido Principal */}
        <div className="xl:col-span-9 flex flex-col gap-4">
          {/* Navegación del Expediente */}
          <div className=" border  rounded-2xl p-2 hide-scrollbar overflow-x-auto flex items-center gap-1">
            <button className="flex items-center gap-2 px-4 py-2 bg-subtitulo text-principal font-medium rounded-xl text-sm whitespace-nowrap">
              <Stethoscope size={16} />
              Historial Clínico
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-subtitulo hover:text-encabezado hover:bg-subtitulo/50 font-medium rounded-xl text-sm transition-colors whitespace-nowrap">
              <Pill size={16} />
              Recetas
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-subtitulo hover:text-encabezado hover:bg-subtitulo/50 font-medium rounded-xl text-sm transition-colors whitespace-nowrap">
              <FlaskConical size={16} />
              Laboratorios
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-subtitulo hover:text-encabezado hover:bg-subtitulo/50 font-medium rounded-xl text-sm transition-colors whitespace-nowrap">
              <FileText size={16} />
              Documentos
            </button>
          </div>

          {/* Área de Notas (Timeline) */}
          <div className=" border  rounded-2xl p-6 shadow-sm flex-1">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-encabezado">Evolución Médica</h3>
              <div className="flex items-center gap-2">
                <button className="flex items-center justify-center p-2 rounded-lg border  text-subtitulo hover:bg-subtitulo">
                  <Filter size={14} />
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-8 relative before:absolute before:inset-0 before:left-[19px] before:w-px before:bg-border-default">
              {/* Nota 1 */}
              <div className="relative pl-12">
                <div className="absolute left-0 top-1 w-10 h-10 bg-principal border border-brand/20 rounded-full flex items-center justify-center text-principal z-10">
                  <Stethoscope size={18} />
                </div>

                <div className="bg-bg-base border  rounded-xl p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-encabezado">Consulta de Seguimiento - Hipertensión</h4>
                      <p className="text-xs text-subtitulo mt-0.5">Por Dr. Arturo Ramos • 12 Mar 2026, 10:30 AM</p>
                    </div>
                    <button className="text-subtitulo hover:text-principal">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-bold text-subtitulo uppercase tracking-wider mb-1">Motivo de Consulta</p>
                      <p className="text-sm text-encabezado">
                        Revisión mensual de presión arterial. Paciente refiere dolor de cabeza esporádico nocturno.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-3 border-y /50">
                      <div>
                        <span className="block text-[10px] text-subtitulo uppercase">P. Arterial</span>
                        <span className="font-semibold text-sm text-red-500">135/85 mmHg</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-subtitulo uppercase">F. Cardiaca</span>
                        <span className="font-semibold text-sm text-encabezado">78 lpm</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-subtitulo uppercase">Temp</span>
                        <span className="font-semibold text-sm text-encabezado">36.5 °C</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-subtitulo uppercase">Sat O2</span>
                        <span className="font-semibold text-sm text-emerald-500">98%</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-subtitulo uppercase tracking-wider mb-1">Plan Trimestral</p>
                      <p className="text-sm text-encabezado">
                        Mantener Losartán 50mg cada 12 hrs. Se recomienda disminuir ingesta de sodio y aumentar cardio a 30 min
                        diarios. Próxima revisión en 1 mes con estudios de química sanguínea.
                      </p>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5  border  rounded-lg text-xs font-medium text-encabezado hover:border-brand ">
                        <Pill size={14} className="text-principal" /> Receta_Foliada_1203.pdf
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nota 2 */}
              <div className="relative pl-12">
                <div className="absolute left-0 top-1 w-10 h-10  border  rounded-full flex items-center justify-center text-subtitulo z-10">
                  <FlaskConical size={18} />
                </div>

                <div className=" border  rounded-xl p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-encabezado">Resultados de Laboratorio Integrados</h4>
                      <p className="text-xs text-subtitulo mt-0.5">Subido por Sistema Core • 10 Mar 2026, 08:15 AM</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border  rounded-lg bg-bg-base">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-encabezado">Química Sanguínea 24 Elementos</p>
                        <p className="text-xs text-subtitulo">Laboratorios Chopo - PDF 2.4 MB</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5  border  hover:border-brand rounded-lg text-xs font-medium text-encabezado transition-colors">
                      Visualizar
                    </button>
                  </div>
                </div>
              </div>

              {/* End Timeline Marker */}
              <div className="relative pl-12">
                <div className="absolute left-[15px] top-1 w-2 h-2 bg-border-strong rounded-full z-10"></div>
                <div className="text-xs font-medium text-subtitulo uppercase tracking-wide pt-0.5">
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
