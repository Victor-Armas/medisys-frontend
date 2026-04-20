import { Search, Filter, Download, FileText, AlertCircle, Activity, ChevronRight, HeartPulse, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const mockRecords = [
  {
    id: "PAT-001",
    name: "Elena Rodríguez Sánchez",
    gender: "F",
    age: 34,
    bloodType: "O+",
    lastDiagnosis: "Control de Hipertensión",
    allergies: ["Penicilina"],
    lastUpdate: "Hace 2 días",
    status: "Estable",
    statusClasses: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    id: "PAT-002",
    name: "Carlos Mendoza Ruiz",
    gender: "M",
    age: 45,
    bloodType: "A-",
    lastDiagnosis: "Diabetes Mellitus Tipo II",
    allergies: [],
    lastUpdate: "Hace 1 semana",
    status: "Requiere Atención",
    statusClasses: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    id: "PAT-003",
    name: "Sofía Arango López",
    gender: "F",
    age: 28,
    bloodType: "B+",
    lastDiagnosis: "Embarazo 14 SDG",
    allergies: ["Ibuprofeno"],
    lastUpdate: "Hoy",
    status: "Observación",
    statusClasses: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    id: "PAT-004",
    name: "Roberto Castillo H.",
    gender: "M",
    age: 52,
    bloodType: "O-",
    lastDiagnosis: "Post-operatorio Apendicectomía",
    allergies: ["Látex", "Aspirina"],
    lastUpdate: "Hace 3 días",
    status: "Crítico",
    statusClasses: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
];

export default function RecordsPage() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      {/* 1. Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-encabezado tracking-tight">Expedientes Clínicos</h2>
          <p className="text-sm text-subtitulo mt-1">Plataforma central de historias clínicas y control médico avanzado.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5  border  rounded-xl text-sm font-medium text-encabezado hover:bg-subtitulo transition-colors">
            <Download size={16} />
            <span className="hidden sm:inline">Exportar Base</span>
          </button>
        </div>
      </div>

      {/* 2. KPIs Clínicos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl  border  flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-principal flex items-center justify-center text-principal shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-subtitulo">Expedientes Activos</p>
            <h3 className="text-xl font-bold text-encabezado">1,248</h3>
          </div>
        </div>
        <div className="p-4 rounded-2xl  border  flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-subtitulo">Con Alergias / Riesgo</p>
            <h3 className="text-xl font-bold text-encabezado">184</h3>
          </div>
        </div>
        <div className="p-4 rounded-2xl  border  flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-subtitulo">Monitoreo Crónico</p>
            <h3 className="text-xl font-bold text-encabezado">342</h3>
          </div>
        </div>
        <div className="p-4 rounded-2xl  border  flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
            <HeartPulse size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-subtitulo">Actualizados (&lt;30d)</p>
            <h3 className="text-xl font-bold text-encabezado">89%</h3>
          </div>
        </div>
      </div>

      {/* 3. Toolbar */}
      <div className=" border  rounded-2xl flex flex-col md:flex-row justify-between items-center p-2 gap-4">
        <div className="flex items-center w-full md:w-auto overflow-x-auto hide-scrollbar">
          <button className="px-5 py-2 text-sm font-medium text-principal bg-subtitulo rounded-xl whitespace-nowrap">
            Recientes
          </button>
          <button className="px-5 py-2 text-sm font-medium text-subtitulo hover:text-encabezado hover:bg-subtitulo/50 rounded-xl transition-colors whitespace-nowrap">
            Con Alertas
          </button>
          <button className="px-5 py-2 text-sm font-medium text-subtitulo hover:text-encabezado hover:bg-subtitulo/50 rounded-xl transition-colors whitespace-nowrap">
            Pacientes Crónicos
          </button>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto px-2 md:px-0">
          <div className="relative flex-1 md:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtitulo" />
            <input
              type="text"
              placeholder="Buscar por nombre, ID o diagnóstico..."
              className="w-full pl-9 pr-4 py-2 bg-bg-base border  rounded-xl text-sm outline-none focus:border-principal focus:ring-1 focus:ring-brand/50 transition-all text-encabezado placeholder:text-subtitulo"
            />
          </div>
          <button className="flex items-center justify-center w-9 h-9 rounded-xl border  text-subtitulo hover:bg-subtitulo hover:text-principal transition-colors shrink-0">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* 4. Lista de Expedientes GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockRecords.map((record) => {
          const initials = record.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("");
          return (
            <div key={record.id} className=" border  hover: rounded-2xl p-5 transition-all hover:shadow-sm group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-brand-gradient-from to-brand-gradient-to flex items-center justify-center text-white font-bold shrink-0">
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-encabezado text-[15px] group-hover:text-principal transition-colors">
                      {record.name}
                    </h3>
                    <p className="text-xs text-subtitulo mt-0.5">
                      Expediente: <span className="font-mono">{record.id}</span> • {record.age} años, {record.gender}
                    </p>
                  </div>
                </div>
                {/* Status Badge */}
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${record.statusClasses}`}
                >
                  {record.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-bg-base/50 p-3 rounded-xl border /50">
                  <p className="text-[11px] font-medium text-subtitulo uppercase tracking-wider mb-1">Diagnóstico Principal</p>
                  <p className="text-sm font-semibold text-encabezado truncate" title={record.lastDiagnosis}>
                    {record.lastDiagnosis}
                  </p>
                </div>
                <div className="bg-bg-base/50 p-3 rounded-xl border /50 flex flex-col justify-center">
                  <p className="text-[11px] font-medium text-subtitulo uppercase tracking-wider mb-1">Grupo Sanguíneo</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-red-500">{record.bloodType}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t /50">
                <div className="flex items-center gap-2">
                  {record.allergies.length > 0 ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded-md">
                      <AlertCircle size={12} />
                      Alergias: {record.allergies.join(", ")}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-subtitulo">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      Sin alergias
                    </div>
                  )}
                </div>

                <Link
                  href={`/records/${record.id}`}
                  className="flex items-center gap-1.5 text-sm font-semibold text-principal hover:text-principal-hover transition-colors"
                >
                  Abrir Expediente
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
