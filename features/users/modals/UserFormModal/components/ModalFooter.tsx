import { Button } from "@/shared/ui/button";
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
    <div className="px-10 py-6  bg-bg-base mt-auto">
      <div className="flex justify-between items-center">
        <Button type="button" variant="cancelar" className="p-2" onClick={onBack}>
          {step === 0 ? "Cancelar" : "Anterior"}
        </Button>

        {!isLastStep ? (
          <Button type="button" variant="primary2" className="p-2" onClick={onNext}>
            Continuar
          </Button>
        ) : (
          <Button type="submit" variant="positive" className="p-2" disabled={isPending}>
            {isPending && <Loader2 size={16} className="animate-spin" />}
            {isDoctor ? "Crear perfil médico" : "Crear usuario"}
          </Button>
        )}
      </div>
    </div>
  );
}
