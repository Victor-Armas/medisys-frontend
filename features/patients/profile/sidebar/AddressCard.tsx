"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { MoreVertical, Pencil, Star, X, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
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
    : (address.foreignCity ?? null);

  const fullAddress = [
    line1,
    address.neighborhood?.name && `Col. ${address.neighborhood.name}`,
    cityLine,
    address.postalCode?.code,
  ]
    .filter(Boolean)
    .join(", ");

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  return (
    <div
      className={cn(
        "rounded-sm shadow-sm p-3 relative transition-colors",
        address.isPrimary ? "bg-inner-principal/30 " : "bg-interior ",
      )}
    >
      <div className="flex items-center gap-3">
        {address.isPrimary && <Star size={20} className="text-principal fill-inner-principal shrink-0" />}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-encabezado uppercase tracking-widest truncate">
              {address.isPrimary ? "Domicilio principal" : isMx ? "Domicilio (México)" : `Domicilio (${address.country})`}
            </span>
          </div>

          {line1 ? (
            <p className="text-[12px] font-semibold text-encabezado truncate mt-1">{line1}</p>
          ) : (
            <p className="text-[12px] text-subtitulo italic mt-1">Sin calle registrada</p>
          )}

          <div className={cn("mt-1.5 space-y-0.5", !expanded && "hidden")}>
            {address.neighborhood?.name && (
              <p className="text-[11px] text-subtitulo truncate">Col. {address.neighborhood.name}</p>
            )}
            {cityLine && <p className="text-[11px] text-subtitulo truncate">{cityLine}</p>}
            {address.postalCode?.code && <p className="text-[10px] text-subtitulo">C.P. {address.postalCode.code}</p>}
          </div>
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

              <DropdownMenuItem onClick={() => window.open(mapsUrl, "_blank")}>
                <ExternalLink size={11} className="mr-1.5" />
                Ver en Google Maps
              </DropdownMenuItem>

              {(address.neighborhood?.name || cityLine || address.postalCode?.code) && (
                <DropdownMenuItem onClick={() => setExpanded(!expanded)}>
                  {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {expanded ? "Ocultar" : "Ver detalles"}
                </DropdownMenuItem>
              )}

              {!address.isPrimary && (
                <DropdownMenuItem onClick={onMarkPrimary}>
                  <Star size={11} className="mr-1.5" />
                  Marcar como principal
                </DropdownMenuItem>
              )}

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
