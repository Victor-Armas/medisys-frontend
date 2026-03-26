// components/ui/FormField.tsx
// Wrapper de campo de formulario: label + input + error.
// El input se pasa como children para que sea flexible
// (input, select, textarea, etc.)

interface Props {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, error, children }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-text-secondary">{label}</label>
      <div
        className={`flex items-center px-3 h-10 rounded-xl border bg-bg-base transition-colors
                    [&>input]:flex-1 [&>input]:bg-transparent [&>input]:text-sm
                    [&>input]:text-text-primary [&>input]:outline-none
                    [&>input]:placeholder:text-text-disabled
                    ${
                      error
                        ? "border-red-400"
                        : "border-border-input focus-within:border-brand/50"
                    }`}
      >
        {children}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
