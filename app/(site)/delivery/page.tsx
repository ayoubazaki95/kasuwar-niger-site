"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const STEPS = ["Commande reçue", "Coursier affecté", "En route", "Livré"];

export default function DeliveryPage() {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);

  return (
    <div>
      <div className="px-5 md:px-0 pt-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-inkSoft">
          <ArrowLeft size={14} /> Retour
        </Link>
        <div className="text-lg font-display font-bold mt-2">Livraison de colis</div>
      </div>

      <div className="px-5 md:px-0 mt-4 space-y-2.5">
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-line">
          <div className="w-2 h-2 rounded-full bg-green" />
          <span className="text-sm">Récupération — Plateau, Rue NB-12</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-line">
          <div className="w-2 h-2 rounded-full bg-orange" />
          <span className="text-sm">Livraison — Yantala, Avenue de la Liberté</span>
        </div>
      </div>

      <div className="flex gap-2 px-5 md:px-0 mt-4">
        {["Document", "Colis", "Course"].map((t, i) => (
          <span key={t} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${i === 1 ? "bg-orange text-white" : "bg-mist"}`}>
            {t}
          </span>
        ))}
      </div>

      <div className="mx-5 md:mx-0 mt-4 flex items-center justify-between px-4 py-3 rounded-2xl bg-mist">
        <span className="text-xs text-inkSoft">Distance estimée</span>
        <span className="text-xs font-bold font-mono">4.8 km • 1 200 F</span>
      </div>

      {!started ? (
        <div className="px-5 mt-5">
          <button onClick={() => setStarted(true)} className="w-full py-3 rounded-2xl text-white text-sm font-bold bg-orange">
            Commander un coursier
          </button>
        </div>
      ) : (
        <div className="px-5 mt-6">
          <div className="text-xs font-semibold mb-3 text-inkSoft">SUIVI EN TEMPS RÉEL</div>
          <div className="relative pl-6">
            <div className="absolute left-[7px] top-1 bottom-1 w-px bg-line" />
            {STEPS.map((s, i) => (
              <div key={s} className="relative pb-5 last:pb-0">
                <div className={`absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full ${i <= step ? "bg-green" : "bg-line"}`} />
                <div className={`text-sm font-semibold ${i <= step ? "text-ink" : "text-inkSoft"}`}>{s}</div>
                {i === step && i < STEPS.length - 1 && (
                  <button onClick={() => setStep((p) => Math.min(STEPS.length - 1, p + 1))} className="text-[11px] mt-1 font-semibold text-orange">
                    Simuler l&apos;étape suivante →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
