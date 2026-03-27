import { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  rightElement?: React.ReactNode;
}

export function InputLogin({
  label,
  error,
  icon: Icon,
  rightElement,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-text-base">{label}</label>
      )}
      <div
        className={`flex items-center gap-2 px-3 rounded-xl h-11 border bg-surface-input transition-colors ${
          error ? "border-red-400" : "border-border-input"
        }`}
      >
        {Icon && <Icon size={15} className="text-text-accent shrink-0" />}
        <input
          className={`flex-1 bg-transparent text-sm outline-none text-text-base placeholder:text-text-muted ${className}`}
          {...props}
        />
        {rightElement && <div className="shrink-0">{rightElement}</div>}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
