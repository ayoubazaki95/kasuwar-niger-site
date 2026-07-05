"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useOrders, useSettings } from "@/lib/admin-store";

const STEPS = ["Commande reçue", "Coursier affecté", "En route", "Livré"];
const TYPES = ["Document", "Colis", "Course"];

export default function DeliveryPage() {
  const { add: addOrder } = useOrders();
  const { settings } = useSettings();

  const [type, setType] = useState("Colis");
  const [pickup, setPickup] = useState("Plateau, Rue NB-12");
  const [dropoff, setDropoff] = useState("Yantala, Avenue de la Liberté");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);

  const estimatedFee = settings.baseDeliveryFee ? settings.baseDeliveryFee * 2.4 : 1200;
  const canSubmit = name.trim() && phone.trim();

  const confirm = () => {
    if (!canSubmit) return;

    addOrder({
      createdAt: new Date().toISOString(),
      customerName: name.trim(),
      customerPhone: phone.trim(),
      address: dropoff.trim(),
      restaurantNote: "Livraison de colis",
      specialInstructions: `Type : ${type} • Récupération : ${pickup} → Livraison : ${dropoff}`,
      invoiceRequested: false,
      paymentMethod: "Cash à la livraison",
      items: [{ name: `Livraison — ${type}`, qty: 1, price: Math.round(estimatedFee), source: "Livraison de colis" }],
      total: Math.round(estimatedFee),
      status: "Nouvelle",
    });

    const message =
      `*Nouvelle demande — Livraison de colis (${settings.siteName})*%0A%0A` +
      `Client : ${encodeURIComponent(name)}%0A` +
      `Téléphone : ${encodeURIComponent(phone)}%0A` +
      `Type : ${encodeURIComponent(type)}%0A` +
      `Récupération : ${encodeURIComponent(pickup)}%0A` +
      `Livraison : ${encodeURIComponent(dropoff)}%0A` +
      `Estimation : ${Math.round(estimatedFee).toLocaleString("fr-FR")} F`;

    const waNumber = (settings.whatsappNumber || "").replace(/[^\d]/g, "");
    if (waNumber) window.open(`https://wa.me/${waNumber}?text=${message}`, "_blank");

    setStarted(true);
  };

  return (
    <div>
      <div className="px-5 md:px-0 pt-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-inkSoft hover:text-ink">
          <ArrowLeft size={14} /> Retour
        </Link>
        <div className="text-lg font-display font-bold mt-2">Livraison de colis</div>
      </div>

      <div className="px-5 md:px-0 mt-4 md:max-w-lg space-y-2.5">
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-line">
          <div className="w-2 h-2 rounded-full bg-green shrink-0" />
          <input value={pickup} onChange={(e) => setPickup(e.target.value)} disabled={started} className="text-sm bg-transparent outline-none w-full disabled:text-inkSoft" placeholder="Adresse de récupération" />
        </div>
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-line">
          <div className="w-2 h-2 rounded-full bg-orange shrink-0" />
          <input value={dropoff} onChange={(e) => setDropoff(e.target.value)} disabled={started} className="text-sm bg-transparent outline-none w-full disabled:text-inkSoft" placeholder="Adresse de livraison" />
        </div>
      </div>

      <div className="flex gap-2 px-5 md:px-0 mt-4">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => !started && setType(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold press-scale ${type === t ? "text-white" : "bg-mist"}`}
            style={type === t ? { background: "var(--brand-primary)" } : undefined}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mx-5 md:mx-0 mt-4 flex items-center justify-between px-4 py-3 rounded-2xl bg-mist md:max-w-lg">
        <span className="text-xs text-inkSoft">Estimation</span>
        <span className="text-xs font-bold font-mono">{Math.round(estimatedFee).toLocaleString("fr-FR")} F</span>
      </div>

      {!started ? (
        <div className="px-5 md:px-0 mt-5 md:max-w-lg space-y-2.5">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom complet" className="w-full px-3 py-2.5 rounded-xl bg-mist text-sm outline-none" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone" className="w-full px-3 py-2.5 rounded-xl bg-mist text-sm outline-none" />
          <button
            onClick={confirm}
            disabled={!canSubmit}
            className="w-full py-3 rounded-2xl text-white text-sm font-bold press-scale disabled:opacity-40"
            style={{ background: "var(--brand-primary)" }}
          >
            Commander un coursier
          </button>
        </div>
      ) : (
        <div className="px-5 md:px-0 mt-6">
          <div className="text-xs font-semibold mb-3 text-inkSoft">SUIVI EN TEMPS RÉEL</div>
          <p className="text-[11px] text-inkSoft mb-3">
            Une fenêtre WhatsApp s&apos;est ouverte pour transmettre votre demande — envoyez le message pour qu&apos;elle soit reçue immédiatement.
          </p>
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
