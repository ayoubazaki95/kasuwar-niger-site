"use client";

import Link from "next/link";
import { ArrowLeft, MapPinned, Phone, Navigation } from "lucide-react";
import { usePharmacies } from "@/lib/admin-store";

export default function PharmaciesPage() {
  const { items: pharmacies, hydrated } = usePharmacies();

  return (
    <div>
      <div className="px-5 md:px-0 pt-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-inkSoft hover:text-ink">
          <ArrowLeft size={14} /> Retour
        </Link>
        <div className="text-lg font-display font-bold mt-2">Pharmacies de garde</div>
      </div>
      <div className="mx-5 md:mx-0 mt-4 h-28 md:h-40 rounded-2xl flex items-center justify-center relative overflow-hidden bg-mist">
        <MapPinned size={26} className="text-green" />
        <span className="absolute bottom-2 text-[10px] text-inkSoft">Carte interactive — Niamey</span>
      </div>
      <div className="grid md:grid-cols-2 gap-3 px-5 md:px-0 mt-4 pb-2">
        {!hydrated && <div className="text-xs text-inkSoft">Chargement...</div>}
        {pharmacies.map((ph) => (
          <div key={ph.id} className="p-3 rounded-2xl border border-line hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">{ph.name}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F6ED] text-green">{ph.hours}</span>
            </div>
            <div className="text-[11px] mt-1 text-inkSoft">{ph.quartier}</div>
            <div className="flex items-center justify-between mt-2.5">
              <span className="text-[11px] font-semibold font-mono">{ph.distance}</span>
              <div className="flex gap-2">
                <a href={`tel:${ph.phone}`} className="w-8 h-8 rounded-full flex items-center justify-center bg-mist press-scale">
                  <Phone size={13} />
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ph.name + " " + ph.quartier + " Niamey")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-green press-scale"
                >
                  <Navigation size={13} className="text-white" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
