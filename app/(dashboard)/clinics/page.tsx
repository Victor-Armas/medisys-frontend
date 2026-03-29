export default function ClinicsPage() {
  return (
    <div className="flex h-full gap-0 overflow-hidden">
      {/* ── Panel izquierdo — lista de consultorios ── */}
      <aside className="w-72 shrink-0 border-r border-border-default bg-bg-surface flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-default">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Consultorios
            </h2>
            <p className="text-[11px] text-text-secondary mt-0.5">
              3 registrados
            </p>
          </div>
          <button className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-white hover:bg-brand-hover transition-colors">
            <span className="text-lg leading-none">+</span>
          </button>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto py-2 space-y-1 px-2">
          {/* Clínica activa — seleccionada */}
          <div className="rounded-xl border border-brand/30 bg-brand/5 p-3 cursor-pointer">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                  {/* ícono consultorio */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="text-brand"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary leading-tight">
                    Clínica Principal
                  </p>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Monterrey, N.L.
                  </p>
                </div>
              </div>
              {/* Toggle activo */}
              <div className="w-9 h-5 bg-brand rounded-full flex items-center px-0.5 shrink-0 mt-0.5">
                <div className="w-4 h-4 bg-white rounded-full ml-auto" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Activo
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-text-secondary">
                  Capacidad
                </span>
                <span className="text-[11px] font-semibold text-text-primary">
                  2/3
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-brand/10 text-brand">
                  Médicos
                </span>
              </div>
            </div>
          </div>

          {/* Clínica activa — no seleccionada */}
          <div className="rounded-xl border border-border-default hover:border-brand/20 bg-bg-base hover:bg-brand/5 p-3 cursor-pointer transition-all">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-bg-subtle flex items-center justify-center shrink-0">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="text-text-secondary"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary leading-tight">
                    Clínica Norte
                  </p>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    San Nicolás, N.L.
                  </p>
                </div>
              </div>
              <div className="w-9 h-5 bg-brand rounded-full flex items-center px-0.5 shrink-0 mt-0.5">
                <div className="w-4 h-4 bg-white rounded-full ml-auto" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Activo
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-text-secondary">
                  Capacidad
                </span>
                <span className="text-[11px] font-semibold text-text-primary">
                  1/2
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-bg-subtle text-text-secondary">
                  Médicos
                </span>
              </div>
            </div>
          </div>

          {/* Clínica inactiva */}
          <div className="rounded-xl border border-border-default bg-bg-base/50 p-3 cursor-pointer opacity-60 hover:opacity-80 transition-opacity">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-bg-subtle flex items-center justify-center shrink-0">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="text-text-disabled"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-secondary leading-tight">
                    Consulta a Domicilio
                  </p>
                  <p className="text-[11px] text-text-disabled mt-0.5">
                    Sin dirección física
                  </p>
                </div>
              </div>
              {/* Toggle inactivo */}
              <div className="w-9 h-5 bg-border-strong rounded-full flex items-center px-0.5 shrink-0 mt-0.5">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                <span className="text-[11px] text-text-secondary font-medium">
                  Inactivo
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-text-secondary">
                  Capacidad
                </span>
                <span className="text-[11px] font-semibold text-text-secondary">
                  0/1
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Panel derecho — detalle del consultorio seleccionado ── */}
      <main className="flex-1 overflow-y-auto bg-bg-base">
        {/* Header del consultorio */}
        <div className="bg-bg-surface border-b border-border-default px-8 py-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">
                Gestión de consultorio
              </p>
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                Clínica Principal
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Av. Constitución 1200, Monterrey · RFC: CPR123456ABC · Cédula:
                12345678
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-default bg-bg-surface text-sm text-text-primary hover:bg-bg-subtle transition-colors">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Editar datos
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand-hover transition-colors shadow-sm">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Agregar médico
              </button>
            </div>
          </div>

          {/* Barra de capacidad */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-text-secondary">Capacidad</span>
            <div className="flex-1 max-w-xs h-1.5 bg-bg-subtle rounded-full overflow-hidden">
              <div
                className="h-full bg-brand rounded-full"
                style={{ width: "66%" }}
              />
            </div>
            <span className="text-xs font-semibold text-text-primary">
              2 / 3 médicos
            </span>
            <div className="w-px h-4 bg-border-default" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-text-secondary">Color marca</span>
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: "#534AB7" }}
              />
            </div>
          </div>
        </div>

        {/* Lista de médicos con sus horarios */}
        <div className="px-8 py-6 space-y-4">
          {/* ── Médico 1 — Disponible ── */}
          <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden">
            {/* Cabecera del médico */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-border-default">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-brand-gradient-from to-brand-gradient-to flex items-center justify-center text-white font-bold text-sm">
                  CC
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-bg-surface" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-text-primary">
                  Dra. Carolina Cervantes Arellano
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Medicina General · Cédula 12345678
                </p>
              </div>

              {/* Controles del médico */}
              <div className="flex items-center gap-6">
                {/* Global Status */}
                <div className="text-center">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                    Estado global
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      Disponible
                    </span>
                    {/* Toggle ON */}
                    <div className="w-9 h-5 bg-emerald-500 rounded-full flex items-center px-0.5 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                    </div>
                  </div>
                </div>

                <div className="w-px h-8 bg-border-default" />

                {/* Duración */}
                <div className="text-center">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                    Duración cita
                  </p>
                  <span className="text-xs font-semibold text-text-primary">
                    30 min
                  </span>
                </div>

                <div className="w-px h-8 bg-border-default" />

                {/* Permiso */}
                <div className="text-center">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                    Permisos
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-text-primary">
                      Auto-gestión
                    </span>
                    <div className="w-4 h-4 rounded bg-brand flex items-center justify-center">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="w-px h-8 bg-border-default" />

                {/* Acciones */}
                <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Bloques horarios */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Bloques semanales
                </p>
                <button className="text-xs text-red-500 hover:text-red-600 font-medium">
                  Limpiar todo
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Bloque existente */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand/10 border border-brand/20 group">
                  <span className="text-[11px] font-bold text-brand bg-brand/15 px-2 py-0.5 rounded-md">
                    Lunes
                  </span>
                  <span className="text-[12px] font-medium text-text-primary">
                    08:00 — 14:00
                  </span>
                  <button className="opacity-0 group-hover:opacity-100 ml-1 text-text-secondary hover:text-red-500 transition-all">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand/10 border border-brand/20 group">
                  <span className="text-[11px] font-bold text-brand bg-brand/15 px-2 py-0.5 rounded-md">
                    Lunes
                  </span>
                  <span className="text-[12px] font-medium text-text-primary">
                    16:00 — 20:00
                  </span>
                  <button className="opacity-0 group-hover:opacity-100 ml-1 text-text-secondary hover:text-red-500 transition-all">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand/10 border border-brand/20 group">
                  <span className="text-[11px] font-bold text-brand bg-brand/15 px-2 py-0.5 rounded-md">
                    Martes
                  </span>
                  <span className="text-[12px] font-medium text-text-primary">
                    08:00 — 14:00
                  </span>
                  <button className="opacity-0 group-hover:opacity-100 ml-1 text-text-secondary hover:text-red-500 transition-all">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand/10 border border-brand/20 group">
                  <span className="text-[11px] font-bold text-brand bg-brand/15 px-2 py-0.5 rounded-md">
                    Miércoles
                  </span>
                  <span className="text-[12px] font-medium text-text-primary">
                    08:00 — 14:00
                  </span>
                  <button className="opacity-0 group-hover:opacity-100 ml-1 text-text-secondary hover:text-red-500 transition-all">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Botón agregar bloque */}
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-border-strong text-text-secondary hover:border-brand hover:text-brand hover:bg-brand/5 transition-all">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span className="text-[12px] font-medium">
                    Agregar bloque
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Médico 2 — Pausado ── */}
          <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden">
            <div className="flex items-center gap-4 px-6 py-4 border-b border-border-default">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white font-bold text-sm">
                  AR
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-amber-500 border-2 border-bg-surface" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-text-primary">
                    Dr. Arturo Ramos García
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wide">
                    Pausado
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  Cardiología · Cédula 87654321
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                    Estado global
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      Pausado
                    </span>
                    {/* Toggle OFF */}
                    <div className="w-9 h-5 bg-border-strong rounded-full flex items-center px-0.5 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="w-px h-8 bg-border-default" />

                <div className="text-center">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                    Duración cita
                  </p>
                  <span className="text-xs font-semibold text-text-primary">
                    45 min
                  </span>
                </div>

                <div className="w-px h-8 bg-border-default" />

                <div className="text-center">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                    Permisos
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-text-primary">
                      Auto-gestión
                    </span>
                    {/* Checkbox OFF */}
                    <div className="w-4 h-4 rounded border border-border-strong bg-bg-subtle" />
                  </div>
                </div>

                <div className="w-px h-8 bg-border-default" />

                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-default text-xs text-text-secondary hover:bg-bg-subtle transition-colors">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Editar horario
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Bloques semanales
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-subtle border border-border-default group opacity-60">
                  <span className="text-[11px] font-bold text-text-secondary bg-bg-base px-2 py-0.5 rounded-md">
                    Martes
                  </span>
                  <span className="text-[12px] font-medium text-text-secondary">
                    09:00 — 17:00
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-subtle border border-border-default group opacity-60">
                  <span className="text-[11px] font-bold text-text-secondary bg-bg-base px-2 py-0.5 rounded-md">
                    Jueves
                  </span>
                  <span className="text-[12px] font-medium text-text-secondary">
                    09:00 — 17:00
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-subtle border border-border-default group opacity-60">
                  <span className="text-[11px] font-bold text-text-secondary bg-bg-base px-2 py-0.5 rounded-md">
                    Sábado
                  </span>
                  <span className="text-[12px] font-medium text-text-secondary">
                    08:00 — 13:00
                  </span>
                </div>
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-border-strong text-text-disabled cursor-not-allowed opacity-40">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span className="text-[12px] font-medium">
                    Agregar bloque
                  </span>
                </button>
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-3 flex items-center gap-1.5">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Médico pausado — las citas quedarán en espera hasta que reanude
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
