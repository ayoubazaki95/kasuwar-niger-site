"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, CheckCircle2 } from "lucide-react";
import { usePressingServices, useOrders, useSettings } from "@/lib/admin-store";

const SLOTS = ["Aujourd'hui, 16h-18h", "Demain, 9h-11h"];

export default function PressingPage() {
  const { items: services, hydrated } = usePressingServices();
  const { add: addOrder } = useOrders();
  const { settings } = useSettings();

  const [service, setService] = useState<number | null>(null);
  const [slot, setSlot] = useState(SLOTS[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("Quartier Plateau, Rue NB-12");
  const [confirmed, setConfirmed] = useState(false);

  const selected = services.find((s) => s.id === service);
  const canSubmit = !!service && name.trim() && phone.trim();

  const confirm = () => {
    if (!canSubmit || !selected) return;

    addOrder({
      createdAt: new Date().toISOString(),
      customerName: name.trim(),
      customerPhone: phone.trim(),
      address: address.trim(),
      restaurantNote: "Service Pressing",
      specialInstructions: `Collecte : ${slot}`,
      invoiceRequested: false,
      paymentMethod: "Cash à la livraison",
      items: [{ name: selected.name, qty: 1, price: selected.unitPrice, source: "Pressing" }],
      total: selected.unitPrice,
      status: "Nouvelle",
    });

    const message =
      `*Nouvelle demande — Pressing (${settings.siteName})*%0A%0A` +
      `Client : ${encodeURIComponent(name)}%0A` +
      `Téléphone : ${encodeURIComponent(phone)}%0A` +
      `Adresse : ${encodeURIComponent(address)}%0A` +
      `Service : ${encodeURIComponent(selected.name)} — ${selected.unitPrice.toLocaleString("fr-FR")} ${selected.unitLabel}%0A` +
      `Collecte : ${encodeURIComponent(slot)}`;

    const waNumber = (settings.whatsappNumber || "").replace(/[^\d]/g, "");
    if (waNumber) window.open(`https://wa.me/${waNumber}?text=${message}`, "_blank");

    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-20 text-center animate-fade-up">
        <CheckCircle2 size={48} className="text-green" />
        <div className="text-base font-bold mt-4 font-display">Collecte programmée</div>
        <p className="text-xs mt-2 text-inkSoft max-w-xs">
          Un agent passera récupérer vos vêtements à l&apos;adresse indiquée ({slot}). Une fenêtre WhatsApp s&apos;est ouverte pour transmettre la demande — envoyez le message pour qu&apos;elle soit reçue immédiatement.
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

        <div className="text-xs font-semibold mt-5 mb-2 text-inkSoft">VOS COORDONNÉES</div>
        <div className="space-y-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom complet" className="w-full px-3 py-2.5 rounded-xl bg-mist text-sm outline-none" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone" className="w-full px-3 py-2.5 rounded-xl bg-mist text-sm outline-none" />
        </div>

        <div className="text-xs font-semibold mt-4 mb-2 text-inkSoft">ADRESSE</div>
        <div className="px-4 py-3 rounded-2xl text-sm flex items-center gap-2 bg-mist">
          <MapPin size={14} className="text-orange shrink-0" />
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="bg-transparent outline-none w-full" />
        </div>

        <button
          onClick={confirm}
          disabled={!canSubmit}
          className="w-full mt-6 py-3 rounded-2xl text-white text-sm font-bold press-scale disabled:opacity-40"
          style={{ background: "var(--brand-accent)" }}
        >
          Confirmer la collecte
        </button>
      </div>
    </div>
  );
}
