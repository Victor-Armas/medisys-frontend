import { Loader2, LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "ghost";
  fullWidth?: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export function ButtonLogin({
  loading = false,
  variant = "primary",
  fullWidth = false,
  icon: Icon,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "h-12 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-opacity cursor-pointer disabled:opacity-60";

  const variants = {
    primary:
      "bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to text-text-on-brand hover:opacity-90",
    ghost:
      "bg-transparent hover:bg-surface-subtle text-brand border border-border-input",
  };

  const width = fullWidth ? "w-full" : "px-6";

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${width} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <>
          {children}
          {Icon && <Icon size={16} />}
        </>
      )}
    </button>
  );
}
