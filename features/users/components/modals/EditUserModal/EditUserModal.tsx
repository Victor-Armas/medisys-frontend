"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { UserCog, Stethoscope } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
import { cn } from "@/shared/lib/utils";
import { isDoctor } from "@/features/users/types/doctors.types";
import { useUpdateUser, useUpdateDoctorProfile } from "@/features/users/hooks/useUsers";
import { notify } from "@/shared/ui/toaster";

import { SectionUserAccount } from "./sections/SectionUserAccount";
import { SectionDoctorProfile } from "./sections/SectionDoctorProfile";

import type { User } from "@/features/users/types/users.types";
import { EditDoctorProfileFormData, editDoctorProfileSchema, EditUserFormData, editUserSchema } from "@/validations/user.schema";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActiveTab = "account" | "profile";

interface Props {
  user: User;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EditUserModal({ user, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("account");
  const doctor = isDoctor(user);
  const profile = user.doctorProfile;

  const updateUser = useUpdateUser();
  const updateDoctorProfile = useUpdateDoctorProfile();

  // ── User form ──────────────────────────────────────────────────────────────
  const userForm = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: user.firstName,
      middleName: user.middleName ?? "",
      lastNamePaternal: user.lastNamePaternal,
      lastNameMaternal: user.lastNameMaternal,
      phone: user.phone ?? "",
      role: user.role as EditUserFormData["role"],
      isActive: user.isActive,
    },
  });

  // ── Doctor profile form ────────────────────────────────────────────────────
  const profileForm = useForm<EditDoctorProfileFormData>({
    resolver: zodResolver(editDoctorProfileSchema),
    defaultValues: profile
      ? {
          professionalLicense: profile.professionalLicense,
          specialty: profile.specialty ?? "",
          university: profile.university ?? "",
          fullTitle: profile.fullTitle ?? "",
          address: profile.address,
          numHome: profile.numHome,
          colony: profile.colony,
          city: profile.city,
          state: profile.state,
          zipCode: profile.zipCode,
          defaultAppointmentDuration: profile.defaultAppointmentDuration,
        }
      : undefined,
  });

  // ── Submit user ────────────────────────────────────────────────────────────
  async function onSubmitUser(data: EditUserFormData) {
    const loadId = notify.loading("Guardando cambios...");
    try {
      await updateUser.mutateAsync({ id: user.id, payload: data });
      notify.dismiss(loadId);
      onClose();
    } catch (err) {
      notify.dismiss(loadId);
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message;
        notify.error(Array.isArray(msg) ? msg.join(", ") : (msg ?? "Error al guardar"));
      }
    }
  }

  // ── Submit doctor profile ──────────────────────────────────────────────────
  async function onSubmitProfile(data: EditDoctorProfileFormData) {
    if (!profile) return;
    const loadId = notify.loading("Guardando perfil médico...");
    try {
      await updateDoctorProfile.mutateAsync({ doctorProfileId: profile.id, payload: data });
      notify.dismiss(loadId);
      onClose();
    } catch (err) {
      notify.dismiss(loadId);
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message;
        notify.error(Array.isArray(msg) ? msg.join(", ") : (msg ?? "Error al guardar"));
      }
    }
  }

  const isPending = updateUser.isPending || updateDoctorProfile.isPending;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 gap-0 rounded-2xl overflow-hidden">
        <DialogHeader className="px-8 py-6 border-b border-border-default">
          <DialogTitle className="text-lg font-bold text-text-primary">Editar usuario</DialogTitle>
          <DialogDescription className="text-xs text-text-secondary mt-1">
            {user.firstName} {user.lastNamePaternal} · {user.email}
          </DialogDescription>
        </DialogHeader>

        {/* Tab navigation — only shown for doctors */}
        {doctor && (
          <div className="flex border-b border-border-default bg-bg-base px-8 gap-1 pt-2">
            {(
              [
                { key: "account", label: "Datos de cuenta", icon: UserCog },
                { key: "profile", label: "Perfil médico", icon: Stethoscope },
              ] as const
            ).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px cursor-pointer",
                  activeTab === key
                    ? "border-brand text-brand"
                    : "border-transparent text-text-secondary hover:text-text-primary",
                )}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Forms */}
        <div className="max-h-[65vh] overflow-y-auto">
          {/* Account tab */}
          {activeTab === "account" && (
            <form onSubmit={userForm.handleSubmit(onSubmitUser)} className="px-8 py-6 space-y-6">
              <SectionUserAccount register={userForm.register} errors={userForm.formState.errors} control={userForm.control} />
              <ModalFooter isPending={isPending} onClose={onClose} label="Guardar cuenta" />
            </form>
          )}

          {/* Doctor profile tab */}
          {activeTab === "profile" && doctor && profile && (
            <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="px-8 py-6 space-y-6">
              <SectionDoctorProfile register={profileForm.register} errors={profileForm.formState.errors} />
              <ModalFooter isPending={isPending} onClose={onClose} label="Guardar perfil médico" />
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Footer reutilizable ──────────────────────────────────────────────────────

function ModalFooter({ isPending, onClose, label }: { isPending: boolean; onClose: () => void; label: string }) {
  return (
    <div className="flex gap-3 pt-4 border-t border-border-default">
      <button
        type="button"
        onClick={onClose}
        className="flex-1 py-2.5 rounded-xl border border-border-default text-sm text-text-secondary hover:bg-bg-subtle transition-colors cursor-pointer"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={isPending}
        className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-60 cursor-pointer"
      >
        {isPending ? "Guardando..." : label}
      </button>
    </div>
  );
}
