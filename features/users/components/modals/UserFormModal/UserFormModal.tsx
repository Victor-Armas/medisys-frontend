"use client";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { cn } from "@/shared/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
import { isDoctor } from "@/features/users/types/doctors.types";
import { unifiedUserSchema, FORM_STEPS_FIELDS, type UnifiedUserFormData } from "@/validations/user.schema";
import { StepperHeader } from "./components/StepperHeader";
import { ModalFooter } from "./components/ModalFooter";
import { StepRole } from "./steps/StepRole";
import { StepAccount } from "./steps/StepAccount";
import { StepDoctorProfile } from "./steps/StepDoctorProfile";
import { STEP_LABELS_STAFF, STEP_LABELS_DOCTOR } from "./types";
import { useCreateDoctor, useCreateUser } from "@/features/users/hooks";
import { toCreateDoctorPayload, toCreateUserPayload } from "@/features/users/mappers/user.mapper";

interface Props {
  onClose: () => void;
}

export function UserFormModal({ onClose }: Props) {
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState("");

  const createUser = useCreateUser();
  const createDoctor = useCreateDoctor();
  const isPending = createUser.isPending || createDoctor.isPending;

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm<UnifiedUserFormData>({
    resolver: zodResolver(unifiedUserSchema),
    mode: "onChange",
  });

  const selectedRole = useWatch({ control, name: "role" });
  const isSelectedDoctor = isDoctor({ role: selectedRole });
  const stepLabels = isSelectedDoctor ? STEP_LABELS_DOCTOR : STEP_LABELS_STAFF;
  const fieldsByStep = isSelectedDoctor ? FORM_STEPS_FIELDS.doctor : FORM_STEPS_FIELDS.staff;

  async function handleNext() {
    const isValid = await trigger(fieldsByStep[step]);
    if (isValid) {
      setStep((s) => s + 1);
      setServerError("");
    }
  }

  function handleBack() {
    if (step === 0) onClose();
    else setStep((s) => s - 1);
  }

  async function onSubmit(data: UnifiedUserFormData) {
    setServerError("");
    try {
      if (isSelectedDoctor) {
        await createDoctor.mutateAsync(toCreateDoctorPayload(data));
      } else {
        await createUser.mutateAsync(toCreateUserPayload(data));
      }
      onClose();
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message;
        setServerError(Array.isArray(msg) ? msg.join(", ") : (msg ?? "Error al crear el usuario"));
        if (msg?.includes("email")) setStep(1);
      }
    }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn("p-0 max-w-2xl gap-0 overflow-hidden rounded-3xl transition-all duration-200 shadow-xl")}>
        {/* Header */}
        <DialogHeader className="px-10 py-7 border-b border-border-default bg-bg-surface">
          <DialogTitle className="text-xl font-bold tracking-tight text-text-primary">Nuevo Usuario</DialogTitle>
          <DialogDescription className="text-[13px] text-text-secondary mt-1">Registra personal médico o administrativo en MediSys</DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <StepperHeader steps={stepLabels} currentStep={step} />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-h-[60vh]">
          <div className="flex-1 overflow-y-auto px-10 py-8 space-y-6 hide-scrollbar">
            {step === 0 && <StepRole control={control} />}

            {step === 1 && <StepAccount register={register} errors={errors} />}

            {step === 2 && isSelectedDoctor && <StepDoctorProfile register={register} errors={errors} />}

            {serverError && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20">
                <p className="text-[13px] text-red-700 dark:text-red-400 font-medium">{serverError}</p>
              </div>
            )}
          </div>

          <ModalFooter step={step} totalSteps={stepLabels.length} isPending={isPending} isDoctor={isSelectedDoctor} onBack={handleBack} onNext={handleNext} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
