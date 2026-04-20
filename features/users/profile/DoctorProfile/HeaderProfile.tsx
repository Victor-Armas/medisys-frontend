"use Client";
import { Button } from "@/shared/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

interface Props {
  backHref: string;
  showEditButton: boolean;
  setEditOpen: Dispatch<SetStateAction<boolean>>;
}

export default function HeaderProfile({ backHref, showEditButton, setEditOpen }: Props) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-encabezado text-2xl font-bold">Perfil Profesional</h1>
      <div className="flex items-center gap-4">
        <Link
          href={backHref}
          className="bg-inner-secundario p-2 rounded-sm flex items-center gap-3 hover:bg-secundario-hover/80 transition duration-300 shadow-sm"
        >
          <ArrowLeft size={17} strokeWidth={3} className="text-secundario" />
          <span className="text-secundario">Regresar</span>
        </Link>
        {showEditButton && (
          <Button onClick={() => setEditOpen(true)} variant="primary2" icon="editar" className="p-2">
            Editar Perfil
          </Button>
        )}
      </div>
    </div>
  );
}
