import { Loader2 } from "lucide-react";

interface Props {
  step: number;
  totalSteps: number;
  isPending: boolean;
  isDoctor: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function ModalFooter({ step, totalSteps, isPending, isDoctor, onBack, onNext }: Props) {
  const isLastStep = step === totalSteps - 1;

  return (
    <div className="px-10 py-6 border-t border-border-default bg-bg-base mt-auto">
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 text-sm font-medium rounded-xl border border-border-default cursor-pointer
                     text-text-secondary hover:bg-bg-subtle transition-colors"
        >
          {step === 0 ? "Cancelar" : "Anterior"}
        </button>

        {!isLastStep ? (
          <button
            type="button"
            onClick={onNext}
            className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all cursor-pointer
                       bg-brand hover:bg-brand-hover shadow-lg shadow-brand/15"
          >
            Continuar
          </button>
        ) : (
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-8 py-2.5 text-sm font-semibold text-white cursor-pointer active:shadow-inner active:translate-y-1
                       rounded-xl bg-linear-to-br from-brand-gradient-from to-brand-gradient-to
                       shadow-lg shadow-brand/20 hover:opacity-90 transition-all
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            {isDoctor ? "Crear perfil médico" : "Crear usuario"}
          </button>
        )}
      </div>
    </div>
  );
}
