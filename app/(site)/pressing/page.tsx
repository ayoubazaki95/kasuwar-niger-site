"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, CheckCircle2 } from "lucide-react";
import { usePressingServices } from "@/lib/admin-store";

const SLOTS = ["Aujourd'hui, 16h-18h", "Demain, 9h-11h"];

export default function PressingPage() {
  const { items: services, hydrated } = usePressingServices();
  const [service, setService] = useState<number | null>(null);
  const [slot, setSlot] = useState(SLOTS[0]);
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-20 text-center animate-fade-up">
        <CheckCircle2 size={48} className="text-green" />
        <div className="text-base font-bold mt-4 font-display">Collecte programmée</div>
        <p className="text-xs mt-2 text-inkSoft max-w-xs">
          Un agent passera récupérer vos vêtements à l&apos;adresse indiquée ({slot}). Vous recevrez une notification 15 minutes avant son arrivée.
        </p>
        <Link href="/" className="mt-6 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-green press-scale">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="px-5 md:px-0 pt-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-inkSoft hover:text-ink">
          <ArrowLeft size={14} /> Retour
        </Link>
        <div className="text-lg font-display font-bold mt-2">Pressing</div>
      </div>
      <div className="px-5 md:px-0 mt-4 md:max-w-lg">
        <div className="text-xs font-semibold mb-2 text-inkSoft">TYPE DE SERVICE</div>
        <div className="space-y-2">
          {!hydrated && <div className="text-xs text-inkSoft">Chargement...</div>}
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => setService(s.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-[1.5px] press-scale ${
                service === s.id ? "border-gold bg-[#FBF1DD]" : "border-line"
              }`}
            >
              <span className="text-sm font-medium">{s.name}</span>
              <span className="text-xs font-semibold font-mono">{s.unitPrice.toLocaleString("fr-FR")} {s.unitLabel}</span>
            </button>
          ))}
        </div>

        <div className="text-xs font-semibold mt-5 mb-2 text-inkSoft">COLLECTE</div>
        <div className="grid grid-cols-2 gap-2">
          {SLOTS.map((t) => (
            <button
              key={t}
              onClick={() => setSlot(t)}
              className={`px-3 py-2.5 rounded-xl text-xs font-medium text-center border press-scale ${slot === t ? "border-orange" : "border-line"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="text-xs font-semibold mt-5 mb-2 text-inkSoft">ADRESSE</div>
        <div className="px-4 py-3 rounded-2xl text-sm flex items-center gap-2 bg-mist">
          <MapPin size={14} className="text-orange" /> Quartier Plateau, Rue NB-12
        </div>

        <button
          onClick={() => service && setConfirmed(true)}
          disabled={!service}
          className="w-full mt-6 py-3 rounded-2xl text-white text-sm font-bold press-scale disabled:opacity-40"
          style={{ background: "var(--brand-accent)" }}
        >
          Confirmer la collecte
        </button>
      </div>
    </div>
  );
}
