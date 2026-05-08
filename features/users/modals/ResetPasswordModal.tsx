"use client";

import { useState } from "react";
import { ShieldAlert, Copy, CheckCheck, AlertTriangle } from "lucide-react";
import { isAxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { notify } from "@/shared/ui/toaster";
import { resetUserPassword } from "@/features/users/services/users.service";
import { userKeys } from "@/features/users/hooks/useUsers";
import type { User } from "@/features/users/types/users.types";
import { getFullName } from "@/features/users/types/users.types";

interface Props {
  user: User;
  onClose: () => void;
}

type Step = "confirm" | "result";

export function ResetPasswordModal({ user, onClose }: Props) {
  const [step, setStep] = useState<Step>("confirm");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => resetUserPassword(user.id),
    onSuccess: (data) => {
      setTemporaryPassword(data.temporaryPassword);
      setStep("result");
      // Invalidar para que el badge "debe cambiar contraseña" se actualice
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (err) => {
      const msg = isAxiosError(err) ? (err.response?.data?.message ?? "Error al resetear") : "Error inesperado";
      notify.error(msg);
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(temporaryPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const fullName = getFullName(user);

  return (
    <Dialog open onOpenChange={(open) => !open && step === "result" && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-wairning">
              <ShieldAlert size={20} className="text-wairning-text" />
            </div>
            <DialogTitle>Resetear contraseña</DialogTitle>
          </div>
          <DialogDescription>
            {step === "confirm" ? `Estás por resetear la contraseña de ${fullName}` : "Contraseña temporal generada"}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5">
          {step === "confirm" && (
            <>
              {/* Advertencia */}
              <div className="flex gap-3 p-4 bg-wairning rounded-md">
                <AlertTriangle size={18} className="text-wairning-text shrink-0 mt-0.5" />
                <div className="text-sm text-wairning-text">
                  <p className="font-semibold mb-1">Antes de continuar</p>
                  <ul className="space-y-1 text-xs opacity-90">
                    <li>• Se generará una contraseña temporal automáticamente</li>
                    <li>• El usuario deberá cambiarla en su próximo acceso</li>
                    <li>
                      • La contraseña solo se mostrará <strong>una vez</strong>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 justify-between pt-2">
                <Button variant="cancelar" className="p-2 flex-1" onClick={onClose}>
                  Cancelar
                </Button>
                <Button variant="wairning" className="p-2 flex-1" disabled={isPending} onClick={() => mutate()}>
                  {isPending ? "Generando..." : "Sí, resetear contraseña"}
                </Button>
              </div>
            </>
          )}

          {step === "result" && (
            <>
              {/* Contraseña generada */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-subtitulo uppercase tracking-wider">Contraseña temporal</p>
                <div className="flex items-center gap-2 p-3 bg-fondo-inputs rounded-md">
                  <code className="flex-1 font-mono text-sm font-bold text-encabezado tracking-wider break-all">
                    {temporaryPassword}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 p-2 rounded-md text-subtitulo hover:text-principal hover:bg-inner-principal transition-colors"
                    title="Copiar contraseña"
                  >
                    {copied ? <CheckCheck size={16} className="text-positive-text" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* Aviso importante */}
              <div className="flex gap-3 p-3 bg-negative/10 rounded-md border border-negative/20">
                <AlertTriangle size={16} className="text-negative-text shrink-0 mt-0.5" />
                <p className="text-xs text-negative-text">
                  <strong>Esta es la única vez que se muestra esta contraseña.</strong> Compártela de forma segura con{" "}
                  {user.firstName} y pídele que la cambie al ingresar.
                </p>
              </div>

              <Button variant="primary2" className="w-full p-2" onClick={onClose}>
                Entendido, cerrar
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
