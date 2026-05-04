import { AlertTriangle, AlertCircle, Info, ShieldAlert } from "lucide-react";

// 1. Tipado estricto extraído para mayor limpieza
type AllergySeverity = "MILD" | "MODERATE" | "SEVERE" | "UNKNOWN";

type Allergy = {
  id: string;
  substance: string;
  severity: AllergySeverity;
};

type Props = {
  allergies?: Allergy[];
};

const ORDER: AllergySeverity[] = ["SEVERE", "MODERATE", "MILD", "UNKNOWN"];

const SEVERITY_CONFIG: Record<AllergySeverity, { icon: React.ElementType; label: string; className: string }> = {
  SEVERE: { icon: ShieldAlert, label: "Severa", className: "bg-red-50    border-red-300    text-red-800" },
  MODERATE: { icon: AlertTriangle, label: "Moderada", className: "bg-amber-50  border-amber-300  text-amber-900" },
  MILD: { icon: AlertCircle, label: "Leve", className: "bg-green-50  border-green-300  text-green-900" },
  UNKNOWN: { icon: Info, label: "Otra", className: "bg-violet-50 border-violet-300 text-violet-900" },
};

// 3. Subcomponente aplicando DRY y KISS
const AllergyChip = ({ allergy }: { allergy: Allergy }) => {
  const { icon: Icon, label, className } = SEVERITY_CONFIG[allergy.severity];

  return (
    <span
      title={label}
      className={`group relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}
    >
      <Icon size={12} className="shrink-0" />
      {allergy.substance}

      {/* Tooltip con severidad al hover */}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md bg-white border border-gray-200 px-2 py-1 text-[11px] text-gray-500 shadow-sm opacity-0 transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </span>
  );
};

export const AllergyPanel = ({ allergies }: Props) => {
  if (!allergies?.length) return null;

  // 🥇 Caso 1: UNA sola alergia → barra completa
  if (allergies.length === 1) {
    const a = allergies[0];
    const { icon: Icon, label, className } = SEVERITY_CONFIG[a.severity];

    return (
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Alergias</p>

        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${className}`}>
          <Icon size={16} className="shrink-0" />
          <span>
            {a.substance}
            <span className="ml-2 text-xs opacity-70">({label})</span>
          </span>
        </div>
      </div>
    );
  }

  // 🥈 Caso normal: múltiples → chips
  const sorted = [...allergies].sort((a, b) => ORDER.indexOf(a.severity) - ORDER.indexOf(b.severity));

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Alergias</p>

      <div className="flex flex-wrap gap-1.5">
        {sorted.map((a) => (
          <AllergyChip key={a.id} allergy={a} />
        ))}
      </div>
    </div>
  );
};
