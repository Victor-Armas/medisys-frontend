"use client";

import { Copy, MapPin, Navigation } from "lucide-react";
import { DoctorAddress } from "../../types/doctors.types";
import { notify } from "@/shared/ui/toaster";
import Link from "next/link";
import { Button } from "@/shared/ui/button";

interface Props {
  address: DoctorAddress;
}

export default function LocationCard({ address }: Props) {
  const fullAddress = `${address.address} ${address.numHome}, ${address.colony}, ${address.city}, ${address.state}`;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullAddress);
    notify.success("Dirección copiada");
  };

  return (
    // 1. Contenedor principal 100% alto y flexible. Sin bg, sin sombras (las hereda de HistorySection).
    <div className="flex flex-col h-full w-full pt-2">
      {/* 2. Banner Visual - Proporción fija para no deformarse */}
      <div className="h-28 bg-indigo-400/50 rounded-xl relative overflow-hidden shrink-0">
        <svg className="absolute inset-0 opacity-[0.15]" width="100%" height="100%">
          <pattern id="grid-pattern-location" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern-location)" className="text-indigo-700" />
        </svg>

        {/* Pin posicionado elegantemente */}
        <div className="absolute bottom-[-16px] left-6">
          <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-indigo-100/50 p-2 rounded-xl">
              <MapPin className="text-indigo-600 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Información textual (flex-grow para llenar el espacio) */}
      <div className="flex flex-col grow px-2 pt-8">
        <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Ubicación del Consultorio</h3>
        <p className="text-gray-800 font-semibold leading-snug text-[15px] mb-1">
          {address.address} {address.numHome}, {address.colony}
        </p>
        <p className="text-gray-500 font-normal text-sm">
          CP {address.zipCode}, {address.city}, {address.state}
        </p>
      </div>

      {/* 4. Botones anclados al fondo con mt-auto */}
      <div className="mt-auto pt-6 px-2 pb-2">
        <div className="grid grid-cols-2 gap-3">
          <Link
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-inner-principal text-principal hover:bg-principal-hover2/80 dark:text-white rounded-sm text-sm font-semibold transition-all shadow-sm duration-300"
          >
            <Navigation size={16} />
            Navegar
          </Link>
          <Button variant="secundario" onClick={copyToClipboard}>
            <Copy className="w-4 h-4 text-secundario" />
            Copiar
          </Button>
        </div>
      </div>
    </div>
  );
}
