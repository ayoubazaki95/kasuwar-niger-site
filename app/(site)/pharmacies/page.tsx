import Link from "next/link";
import { ArrowLeft, MapPinned, Phone, Navigation } from "lucide-react";
import { PHARMACIES } from "@/lib/data";

export default function PharmaciesPage() {
  return (
    <div>
      <div className="px-5 pt-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-inkSoft">
          <ArrowLeft size={14} /> Retour
        </Link>
        <div className="text-lg font-display font-bold mt-2">Pharmacies de garde</div>
      </div>
      <div className="mx-5 mt-4 h-28 rounded-2xl flex items-center justify-center relative overflow-hidden bg-mist">
        <MapPinned size={26} className="text-green" />
        <span className="absolute bottom-2 text-[10px] text-inkSoft">Carte interactive — Niamey</span>
      </div>
      <div className="px-5 mt-4 space-y-3 pb-2">
        {PHARMACIES.map((ph) => (
          <div key={ph.id} className="p-3 rounded-2xl border border-line">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">{ph.name}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F6ED] text-green">{ph.hours}</span>
            </div>
            <div className="text-[11px] mt-1 text-inkSoft">{ph.quartier}</div>
            <div className="flex items-center justify-between mt-2.5">
              <span className="text-[11px] font-semibold font-mono">{ph.distance}</span>
              <div className="flex gap-2">
                <a href={`tel:${ph.phone}`} className="w-8 h-8 rounded-full flex items-center justify-center bg-mist">
                  <Phone size={13} />
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ph.name + " " + ph.quartier + " Niamey")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-green"
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
