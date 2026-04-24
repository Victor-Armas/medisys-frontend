"use client";
import { useState } from "react";
import { HistorySection } from "@/features/patients/shared/HistorySection";
import { StaffRole, User } from "../../types";
import HeaderProfile from "./HeaderProfile";
import { usePermissions } from "@/shared/hooks/usePermissions";
import AccountProfileCard from "./AccountProfileCard";
import ProfessionalProfileCard from "./ProfessionalProfileCard";
import AddressProfileCard from "./AddressProfileCard";
import { DoctorSignatureCard } from "./DoctorSignatureCard";
import CalendarDoctorCard from "./CalendarDoctorCard";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, Hospital } from "lucide-react";
import { EditUserModal } from "../../modals/EditUserModal";

interface Props {
  user: User;
  isOwnProfile?: boolean;
  canEditOtherProfilesServer?: boolean;
  role: StaffRole;
}

export type ViewMode = "week" | "month";

export default function DoctorProfileClient({ user, isOwnProfile = false, role }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  //ESTADO GLOBAL DEL CALENDARIO
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [baseDate, setBaseDate] = useState(new Date());

  const { canEditOtherProfiles, userId } = usePermissions(role); // No sobreescribir con el rol del usuario visto
  const actualIsOwnProfile = isOwnProfile || userId === user.id;
  const showEditButton = canEditOtherProfiles || actualIsOwnProfile;
  const backHref = actualIsOwnProfile ? "/dashboard" : "/users";

  // LÓGICA DE NAVEGACIÓN (Solo renderiza lo que ves)
  const handlePrev = () =>
    setBaseDate((d) =>
      dayjs(d)
        .subtract(1, viewMode === "week" ? "week" : "month")
        .toDate(),
    );
  const handleNext = () =>
    setBaseDate((d) =>
      dayjs(d)
        .add(1, viewMode === "week" ? "week" : "month")
        .toDate(),
    );

  const calendarToolbar = (
    <div className="flex items-center gap-4">
      <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200/50">
        <button
          onClick={() => setViewMode("week")}
          className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${viewMode === "week" ? "bg-principal text-white shadow-sm" : "text-subtitulo hover:text-encabezado"}`}
        >
          SEMANA
        </button>
        <button
          onClick={() => setViewMode("month")}
          className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${viewMode === "month" ? "bg-principal text-white shadow-sm" : "text-subtitulo hover:text-encabezado"}`}
        >
          MES
        </button>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={handlePrev} className="p-1 text-subtitulo hover:text-principal transition-colors">
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
        <button onClick={handleNext} className="p-1 text-subtitulo hover:text-principal transition-colors">
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );

  const clinics = user.doctorProfile?.doctorClinics || [];

  return (
    <div className="max-w-[1400px] mx-auto pb-10 p-6 space-y-4">
      <HeaderProfile backHref={backHref} showEditButton={showEditButton} setEditOpen={setEditOpen} />

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="col-span-1 lg:col-span-4 flex flex-col h-full">
          <HistorySection title="Datos de la cuenta" icon="clipuser" className="h-full">
            <AccountProfileCard user={user} />
          </HistorySection>
        </div>
        <div className="col-span-1 lg:col-span-2 lg:col-start-5 flex flex-col h-full">
          {/* Datos Profesionales */}
          <HistorySection title="Datos Profesionales" icon="professional" className="h-full">
            <ProfessionalProfileCard doctor={user.doctorProfile} />
          </HistorySection>
        </div>
        <div className="col-span-1 lg:col-span-3 flex flex-col h-full">
          <HistorySection title="Datos Profesionales" icon="address" className="h-full">
            {user.doctorProfile && <AddressProfileCard address={user.doctorProfile} />}
          </HistorySection>
        </div>
        <div className="col-span-1 lg:col-span-3 lg:col-start-4 flex flex-col h-full">
          <HistorySection title="Firma Medica" icon="signature" className="h-full">
            {user.doctorProfile ? (
              <DoctorSignatureCard profile={user.doctorProfile} canEdit={actualIsOwnProfile || canEditOtherProfiles} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 mt-4">
                <p className="text-sm font-medium text-gray-400">Sin perfil médico</p>
                <p className="text-xs text-gray-400 border-t items-center justify-center">
                  Para subir una firma registrate como médico.
                </p>
              </div>
            )}
          </HistorySection>
        </div>
      </div>
      <HistorySection
        title="Consultorios y Horarios"
        icon="hospital"
        className="h-full"
        headerAction={clinics.length > 0 ? calendarToolbar : undefined}
      >
        {clinics.length > 0 ? (
          <CalendarDoctorCard clinics={clinics} viewMode={viewMode} baseDate={baseDate} />
        ) : (
          /* ESTADO VACÍO GLOBAL (Si no tiene ningún consultorio) */
          <div className="flex flex-col items-center justify-center py-12 text-center h-full">
            <div className="bg-gray-50 p-4 rounded-full mb-3">
              <Hospital size={32} className="text-gray-300" />
            </div>
            <p className="text-sm font-bold text-gray-400">Sin consultorio asignado</p>
            <p className="text-xs text-gray-400 mt-1">Este perfil aún no cuenta con clínicas vinculadas.</p>
          </div>
        )}
      </HistorySection>
      {editOpen && <EditUserModal user={user} onClose={() => setEditOpen(false)} />}
    </div>
  );
}
