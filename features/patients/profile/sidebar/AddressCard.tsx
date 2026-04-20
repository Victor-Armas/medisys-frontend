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
    <div className={cn("rounded-md p-2.5 relative", address.isPrimary ? " bg-inner-principal" : "bg-fondo-alternativo")}>
      <div className="flex items-start gap-2">
        <div className={cn("mt-0.5 shrink-0", address.isPrimary ? "text-principal" : "text-subtitulo")}>
          {isMx ? <MapPin size={12} /> : <Globe size={12} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            {address.isPrimary && <Star size={8} className="fill-brand text-principal shrink-0" />}
            <span className="text-[10px] font-bold text-encabezado uppercase tracking-wider truncate">
              {address.isPrimary ? "Principal" : isMx ? "México" : address.country}
            </span>
          </div>

          {line1 && <p className="text-[11px] text-encabezado truncate">{line1}</p>}

          {expanded && (
            <>
              {address.neighborhood?.name && <p className="text-[11px] text-subtitulo truncate">{address.neighborhood.name}</p>}
              {cityLine && <p className="text-[11px] text-subtitulo truncate">{cityLine}</p>}
              {address.postalCode?.code && <p className="text-[10px] text-subtitulo">C.P. {address.postalCode.code}</p>}
            </>
          )}

          {(address.neighborhood?.name || cityLine || address.postalCode?.code) && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 mt-1 text-[10px] font-medium text-principal hover:underline"
            >
              {expanded ? (
                <>
                  Ver menos <ChevronUp size={10} />
                </>
              ) : (
                <>
                  Ver más <ChevronDown size={10} />
                </>
              )}
            </button>
          )}
        </div>

        {hasEditPermission && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="p-0.5 text-principal rounded hover:text-principal hover:bg-principal-hover2 transition-colors shrink-0 mt-0.5" />
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
