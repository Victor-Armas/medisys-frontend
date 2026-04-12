import {
  Plus,
  Filter,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Video,
  MapPin,
  MoreHorizontal,
  User,
} from "lucide-react";

// Datos simulados (Mock) para el calendario
const mockSchedule = [
  {
    hour: "08:00",
    appointments: [],
  },
  {
    hour: "09:00",
    appointments: [
      {
        id: "APT-1",
        patient: "Elena Rodríguez Sánchez",
        title: "Revisión Cardiología",
        duration: "45 min",
        type: "Presencial",
        doctor: "Dr. Arturo Ramos",
        status: "Atendiendo",
        bgColor: "bg-brand/15",
        borderColor: "border-brand/30",
        textColor: "text-brand",
      },
    ],
  },
  {
    hour: "10:00",
    appointments: [
      {
        id: "APT-2",
        patient: "Carlos Mendoza Ruiz",
        title: "Consulta General",
        duration: "30 min",
        type: "Video",
        doctor: "Dra. Silvia López",
        status: "Confirmada",
        bgColor: "bg-emerald-500/15",
        borderColor: "border-emerald-500/30",
        textColor: "text-emerald-700 dark:text-emerald-400",
      },
      {
        id: "APT-3",
        patient: "Roberto Castillo H.",
        title: "Dermatología",
        duration: "30 min",
        type: "Presencial",
        doctor: "Dr. Marcos Reyes",
        status: "En sala",
        bgColor: "bg-amber-500/15",
        borderColor: "border-amber-500/30",
        textColor: "text-amber-700 dark:text-amber-500",
      },
    ],
  },
  { hour: "11:00", appointments: [] },
  {
    hour: "12:00",
    appointments: [
      {
        id: "APT-4",
        patient: "Sofía Arango",
        title: "Resultados de Laboratorio",
        duration: "60 min",
        type: "Video",
        doctor: "Dr. Arturo Ramos",
        status: "Confirmada",
        bgColor: "bg-emerald-500/15",
        borderColor: "border-emerald-500/30",
        textColor: "text-emerald-700 dark:text-emerald-400",
      },
    ],
  },
  { hour: "13:00", appointments: [] },
  { hour: "14:00", appointments: [] },
  {
    hour: "15:00",
    appointments: [
      {
        id: "APT-5",
        patient: "Luis Fernández",
        title: "Terapia Física",
        duration: "45 min",
        type: "Presencial",
        doctor: "Lic. Ana Gómez",
        status: "Cancelada",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        textColor: "text-red-600 dark:text-red-400",
      },
    ],
  },
  { hour: "16:00", appointments: [] },
  { hour: "17:00", appointments: [] },
];

export default function AppointmentsPage() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      {/* 1. Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Agenda Médica</h2>
          <p className="text-sm text-text-secondary mt-1">Gestión de citas, horarios y disponibilidad de la clínica.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-brand text-white rounded-xl text-sm font-medium hover:bg-brand-hover transition-colors shadow-sm">
            <Plus size={16} />
            Programar Cita
          </button>
        </div>
      </div>

      {/* 2. KPIs Rápidos (Mismo estilo que pacientes para consistencia) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-bg-surface border border-border-default flex items-center justify-between group">
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Citas Hoy</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-text-primary">18</h3>
              <span className="text-xs font-semibold text-brand bg-bg-subtle px-2 py-0.5 rounded-full">4 completadas</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-bg-subtle flex items-center justify-center text-brand">
            <CalendarIcon size={24} />
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-bg-surface border border-border-default flex items-center justify-between group">
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">En Consultorio</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-text-primary">3</h3>
              <span className="text-xs font-medium text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full dark:text-amber-400">
                Espera: 12m
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-bg-subtle flex items-center justify-center text-brand">
            <Clock size={24} />
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-bg-surface border border-border-default flex items-center justify-between group">
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Confirmaciones</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-text-primary">92%</h3>
              <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">Óptimo</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-bg-subtle flex items-center justify-center text-brand">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      {/* 3. Área del Calendario Principal */}
      <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[600px]">
        {/* Panel Izquierdo: Mini-Calendario y Filtros */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border-default p-5 bg-bg-base/30 flex flex-col gap-6">
          {/* Mock de Mini Calendario Mes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-text-primary">Marzo 2026</h4>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-bg-subtle rounded-lg text-text-secondary">
                  <ChevronLeft size={16} />
                </button>
                <button className="p-1 hover:bg-bg-subtle rounded-lg text-text-secondary">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            {/* Grid simple del mes */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
              {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"].map((d) => (
                <span key={d} className="text-text-secondary font-medium">
                  {d}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {/* Días vacíos al inicio */}
              <div className="p-2"></div>
              <div className="p-2"></div>
              {/* Días del mes (mock truncado para ui visual) */}
              {[...Array(24)].map((_, i) => (
                <button
                  key={i}
                  className={`p-1.5 rounded-lg flex items-center justify-center ${i + 1 === 24 ? "bg-brand text-white font-bold" : "text-text-primary hover:bg-bg-subtle"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-border-default w-full"></div>

          {/* Filtros de Doctores */}
          <div>
            <h4 className="font-semibold text-text-primary text-sm mb-3">Doctores</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded-sm text-brand border-border-strong focus:ring-brand outline-none"
                />
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                  Dr. Arturo Ramos
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded-sm text-brand border-border-strong focus:ring-brand outline-none"
                />
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                  Dra. Silvia López
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded-sm text-brand border-border-strong focus:ring-brand outline-none"
                />
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                  Dr. Marcos Reyes
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Línea de Tiempo del Día */}
        <div className="flex-1 flex flex-col relative w-full overflow-x-auto">
          {/* Header del timeline */}
          <div className="p-4 border-b border-border-default flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 bg-bg-surface z-10">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-text-primary">24 Marzo, 2026</h3>
              <span className="px-2 py-1 bg-bg-subtle text-text-secondary rounded-md text-xs font-medium">Hoy</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-bg-base border border-border-default flex p-1 rounded-xl">
                <button className="px-4 py-1.5 text-xs font-semibold bg-bg-surface shadow-sm rounded-lg text-text-primary">
                  Día
                </button>
                <button className="px-4 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary rounded-lg">
                  Semana
                </button>
                <button className="px-4 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary rounded-lg">
                  Mes
                </button>
              </div>
              <button className="p-2 border border-border-default rounded-xl text-text-secondary hover:text-brand hover:bg-bg-subtle transition-colors">
                <Filter size={16} />
              </button>
            </div>
          </div>

          {/* Grid de Horas (Timeline) */}
          <div className="p-4 min-w-[600px]">
            <div className="relative">
              {/* Línea roja de "Hora Actual" (Mock) */}
              <div className="absolute left-16 right-0 border-t-2 border-red-500 z-0 top-[180px] flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 absolute -left-1"></div>
              </div>

              {mockSchedule.map((block) => (
                <div key={block.hour} className="flex group min-h-[100px]">
                  {/* Etiqueta de Hora */}
                  <div className="w-16 shrink-0 text-right pr-4 pt-2">
                    <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                      {block.hour}
                    </span>
                  </div>

                  {/* Bloque de Contenido / Citas */}
                  <div className="flex-1 border-t border-border-default relative pt-2 pb-2 mr-4">
                    <div className="flex flex-col gap-2 relative z-10">
                      {block.appointments.length === 0 && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 w-full">
                          <button className="w-full border border-dashed border-border-strong rounded-xl h-12 flex items-center justify-center text-text-disabled hover:text-brand hover:border-brand hover:bg-brand/5 text-xs font-medium transition-all">
                            + Añadir cita a las {block.hour}
                          </button>
                        </div>
                      )}

                      {block.appointments.map((apt) => (
                        <div
                          key={apt.id}
                          className={`p-3 border rounded-xl flex items-start gap-3 hover:shadow-md transition-shadow cursor-pointer ${apt.bgColor} ${apt.borderColor}`}
                        >
                          <div className={`w-1 shrink-0 h-full rounded-full bg-current ${apt.textColor}`} />

                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className={`text-sm font-bold ${apt.textColor}`}>{apt.patient}</h4>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/50 dark:bg-black/20 ${apt.textColor}`}
                              >
                                {apt.status}
                              </span>
                            </div>
                            <p className="text-xs text-text-primary font-medium mt-1">{apt.title}</p>

                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                                <Clock size={12} />
                                {block.hour} <span className="opacity-70">({apt.duration})</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                                <User size={12} />
                                {apt.doctor}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                                {apt.type === "Video" ? <Video size={12} className={apt.textColor} /> : <MapPin size={12} />}
                                {apt.type}
                              </div>
                            </div>
                          </div>

                          <button className="text-text-secondary hover:text-text-primary p-1">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Fin del día de trabajo */}
            <div className="flex">
              <div className="w-16 shrink-0 text-right pr-4 border-t border-border-default pt-2">
                <span className="text-xs font-medium text-text-disabled">18:00</span>
              </div>
              <div className="flex-1 border-t border-border-default mr-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
