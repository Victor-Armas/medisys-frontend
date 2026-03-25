import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Calendar, 
  Phone, 
  Mail, 
  Users, 
  Activity,
  ChevronRight
} from "lucide-react";

const mockPatients = [
  {
    id: "PAT-001",
    name: "Elena Rodríguez Sánchez",
    email: "elena.rodriguez@email.com",
    phone: "+52 55 1234 5678",
    age: 34,
    gender: "F",
    lastVisit: "12 Mar 2026",
    nextApt: "28 Mar 2026",
    status: "Activo",
  },
  {
    id: "PAT-002",
    name: "Carlos Mendoza Ruiz",
    email: "cmendoza@email.com",
    phone: "+52 55 8765 4321",
    age: 45,
    gender: "M",
    lastVisit: "05 Feb 2026",
    nextApt: "No programada",
    status: "Inactivo",
  },
  {
    id: "PAT-003",
    name: "Sofía Arango López",
    email: "sofia.arango@email.com",
    phone: "+52 55 1122 3344",
    age: 28,
    gender: "F",
    lastVisit: "22 Mar 2026",
    nextApt: "02 Abr 2026",
    status: "Activo",
  },
  {
    id: "PAT-004",
    name: "Roberto Castillo H.",
    email: "rcastillo@email.com",
    phone: "+52 55 9988 7766",
    age: 52,
    gender: "M",
    lastVisit: "15 Ene 2026",
    nextApt: "No programada",
    status: "Activo",
  },
];

export default function PatientsPage() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* 1. Encabezado y Acciones Principales */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Pacientes</h2>
          <p className="text-sm text-text-secondary mt-1">
            Directorio completo y gestión de expedientes clínicos.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-bg-surface border border-border-default rounded-xl text-sm font-medium text-text-primary hover:bg-bg-subtle transition-colors">
            <Download size={16} />
            <span className="hidden sm:inline">Exportar</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-brand text-white rounded-xl text-sm font-medium hover:bg-brand-hover transition-colors shadow-sm">
            <Plus size={16} />
            Nuevo Paciente
          </button>
        </div>
      </div>

      {/* 2. Tarjetas de Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-bg-surface border border-border-default flex items-center justify-between group cursor-pointer hover:border-brand/30 transition-colors">
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Pacientes Totales</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-text-primary">1,248</h3>
              <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+12 este mes</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-bg-subtle flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
            <Users size={24} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-bg-surface border border-border-default flex items-center justify-between group cursor-pointer hover:border-brand/30 transition-colors">
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">En Tratamiento</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-text-primary">342</h3>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-bg-subtle flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
            <Activity size={24} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-bg-surface border border-border-default flex items-center justify-between group cursor-pointer hover:border-brand/30 transition-colors">
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Citas Hoy</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-text-primary">24</h3>
              <span className="text-xs font-medium text-text-secondary">8 pendientes</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-bg-subtle flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
            <Calendar size={24} />
          </div>
        </div>
      </div>

      {/* 3. Barra de Navegación Secundaria (Tabs) y Filtros */}
      <div className="bg-bg-surface border border-border-default rounded-2xl flex flex-col sm:flex-row justify-between items-center p-2 gap-4">
        {/* Tabs */}
        <div className="flex items-center w-full sm:w-auto overflow-x-auto hide-scrollbar">
          <button className="px-5 py-2 text-sm font-medium text-brand bg-bg-subtle rounded-xl whitespace-nowrap">
            Todos los pacientes
          </button>
          <button className="px-5 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-subtle/50 rounded-xl transition-colors whitespace-nowrap">
            Recientes
          </button>
          <button className="px-5 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-subtle/50 rounded-xl transition-colors whitespace-nowrap">
            Inactivos
          </button>
        </div>

        {/* Búsqueda y Filtros */}
        <div className="flex items-center gap-2 w-full sm:w-auto px-2 sm:px-0">
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, CURP..." 
              className="w-full pl-9 pr-4 py-2 bg-bg-base border border-border-default rounded-xl text-sm outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all text-text-primary placeholder:text-text-disabled"
            />
          </div>
          <button className="flex items-center justify-center w-9 h-9 rounded-xl border border-border-default text-text-secondary hover:bg-bg-subtle hover:text-brand transition-colors shrink-0">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* 4. Tabla de Datos */}
      <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-bg-base/50 text-text-secondary font-medium">
              <tr>
                <th className="px-6 py-4 rounded-tl-2xl">Paciente</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Última Visita</th>
                <th className="px-6 py-4">Próxima Cita</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right rounded-tr-2xl">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {mockPatients.map((patient) => {
                const initials = patient.name.split(" ").map(n => n[0]).slice(0, 2).join("");
                return (
                  <tr key={patient.id} className="hover:bg-bg-subtle/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-gradient-from to-brand-gradient-to flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {initials}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary text-[13px]">{patient.name}</p>
                          <p className="text-[11px] text-text-secondary mt-0.5">ID: {patient.id} • {patient.age} años, {patient.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-text-secondary">
                          <Phone size={12} />
                          <span className="text-[12px]">{patient.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-text-secondary">
                          <Mail size={12} />
                          <span className="text-[12px]">{patient.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-text-primary">
                      {patient.lastVisit}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className={patient.nextApt !== "No programada" ? "text-brand" : "text-text-disabled"} />
                        <span className={`text-[13px] ${patient.nextApt !== "No programada" ? "text-text-primary font-medium" : "text-text-secondary"}`}>
                          {patient.nextApt}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium ${
                        patient.status === 'Activo' 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-text-secondary hover:text-brand hover:bg-bg-subtle rounded-lg transition-colors">
                          <Search size={16} />
                        </button>
                        <button className="p-1.5 text-text-secondary hover:text-brand hover:bg-bg-subtle rounded-lg transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Paginación */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border-default bg-bg-base/30">
          <p className="text-xs text-text-secondary">Mostrando 1 a 4 de 1,248 pacientes</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-default text-text-disabled cursor-not-allowed">
              <ChevronRight size={14} className="rotate-180" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand text-white text-xs font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-subtle text-text-secondary text-xs font-medium transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-subtle text-text-secondary text-xs font-medium transition-colors">3</button>
            <span className="px-1 text-text-secondary">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-default text-text-secondary hover:border-brand hover:text-brand transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
