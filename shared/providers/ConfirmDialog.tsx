"use client";

import { Trash2, AlertTriangle, Info } from "lucide-react";
import { ReactNode } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

type Variant = "danger" | "warning" | "primary";

const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: "bg-red-200",
    iconColor: "text-red-500",
    titleColor: "text-red-500",
    confirmBtn: "bg-red-500 hover:bg-red-600 shadow-red-200",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-yellow-200 ",
    iconColor: "text-yellow-500",
    titleColor: "text-yellow-500",
    confirmBtn: "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200",
  },
  primary: {
    icon: Info,
    iconBg: "bg-blue-200",
    iconColor: "text-blue-500",
    titleColor: "text-blue-500",
    confirmBtn: "bg-blue-500 hover:bg-blue-600 shadow-blue-200",
  },
};

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: Variant;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  variant = "primary",
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl">
        <DialogHeader className="text-center">
          <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4 ${config.iconBg}`}>
            <Icon size={24} className={config.iconColor} />
          </div>
          <DialogTitle className={`text-lg font-bold ${config.titleColor}`}>{title}</DialogTitle>
          <div className="text-sm text-charcoal/70 dark:text-white/50 mt-2">{message}</div>
        </DialogHeader>
        <DialogFooter className="flex gap-5 mt-4">
          <Button variant="outline" className="flex-1 py-4" onClick={() => onOpenChange(false)}>
            {cancelText}
          </Button>
          <Button
            className={`flex-1 text-white  py-4 ${config.confirmBtn}`}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
