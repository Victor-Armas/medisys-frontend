"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { MapPin, Globe, MoreVertical, Pencil, Star, X, ChevronUp, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { PatientAddress } from "../../types/patient.types";

interface Props {
  address: PatientAddress;
  hasEditPermission: boolean;
  onEdit: () => void;
  onMarkPrimary: () => void;
}

export function AddressCard({ address, hasEditPermission, onEdit, onMarkPrimary }: Props) {
  const [expanded, setExpanded] = useState(false);
  const isMx = !address.country || address.country === "MX";

  const line1 = address.street ? `${address.street}${address.extNumber ? ` #${address.extNumber}` : ""}` : null;
  const cityLine = address.postalCode
    ? `${address.postalCode.municipality.name}, ${address.postalCode.municipality.state.name}`
    : address.foreignCity
      ? `${address.foreignCity}${address.foreignState ? `, ${address.foreignState}` : ""}`
      : null;

  return (
    <div
      className={cn(
        "rounded-xl border p-3 relative transition-colors",
        address.isPrimary ? "bg-inner-principal border-principal/25" : "bg-interior border-disable/25 hover:border-disable/40",
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5 shrink-0", address.isPrimary ? "text-principal" : "text-subtitulo")}>
          {isMx ? <MapPin size={14} /> : <Globe size={14} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-encabezado uppercase tracking-widest truncate">
              {address.isPrimary ? "Domicilio principal" : isMx ? "Domicilio (México)" : `Domicilio (${address.country})`}
            </span>
            {address.isPrimary && <Star size={10} className="fill-brand text-principal shrink-0" />}
          </div>

          {line1 ? (
            <p className="text-[12px] font-semibold text-encabezado truncate mt-1">{line1}</p>
          ) : (
            <p className="text-[12px] text-subtitulo italic mt-1">Sin calle registrada</p>
          )}

          <div className={cn("mt-1.5 space-y-0.5", !expanded && "hidden")}>
            {address.neighborhood?.name && <p className="text-[11px] text-subtitulo truncate">Col. {address.neighborhood.name}</p>}
            {cityLine && <p className="text-[11px] text-subtitulo truncate">{cityLine}</p>}
            {address.postalCode?.code && <p className="text-[10px] text-subtitulo">C.P. {address.postalCode.code}</p>}
          </div>

          {(address.neighborhood?.name || cityLine || address.postalCode?.code) && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold text-principal hover:text-principal-hover transition-colors"
            >
              {expanded ? "Ocultar" : "Ver detalles"} {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>

        {hasEditPermission && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="p-1 text-subtitulo rounded-lg hover:text-encabezado hover:bg-fondo-inputs transition-colors shrink-0 mt-0.5" />
              }
            >
              <MoreVertical size={12} />
            </DropdownMenuTrigger>

            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil size={11} className="mr-1.5" />
                Editar
              </DropdownMenuItem>

              {!address.isPrimary && (
                <DropdownMenuItem onClick={onMarkPrimary}>
                  <Star size={11} className="mr-1.5" />
                  Marcar como principal
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem variant="destructive">
                <X size={11} className="mr-1.5" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
