"use client";

import { Phone, Trash2 } from "lucide-react";
import { useOrders, Order } from "@/lib/admin-store";

const STATUSES: Order["status"][] = ["Nouvelle", "En préparation", "En livraison", "Livrée", "Annulée"];

function statusColor(s: Order["status"]) {
  switch (s) {
    case "Nouvelle": return "bg-[#FBF1DD] text-[#8a5a00]";
    case "En préparation": return "bg-orange/10 text-orange";
    case "En livraison": return "bg-green/10 text-green";
    case "Livrée": return "bg-[#E8F6ED] text-green";
    case "Annulée": return "bg-mist text-inkSoft";
  }
}

export default function AdminOrdersPage() {
  const { items, update, remove, hydrated } = useOrders();
  const sorted = [...items].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <div>
      <h1 className="text-xl font-display font-bold mb-1">Commandes</h1>
      <p className="text-sm text-inkSoft mb-6">
        Commandes passées depuis le site (dans ce navigateur). Chaque commande est aussi envoyée par WhatsApp au moment de la validation —
        cette liste sert à en garder une trace et à suivre leur statut.
      </p>

      {hydrated && sorted.length === 0 && (
        <div className="text-sm text-inkSoft py-10 text-center bg-white rounded-2xl border border-line">Aucune commande pour le moment.</div>
      )}

      <div className="space-y-3">
        {sorted.map((o) => (
          <div key={o.id} className="bg-white rounded-2xl border border-line p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-bold">{o.customerName}</div>
                <div className="text-xs text-inkSoft flex items-center gap-1"><Phone size={11} /> {o.customerPhone}</div>
                <div className="text-xs text-inkSoft mt-0.5">{o.address}</div>
                <div className="text-[11px] text-inkSoft mt-1">{new Date(o.createdAt).toLocaleString("fr-FR")} • {o.paymentMethod}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold font-mono">{o.total.toLocaleString("fr-FR")} F</div>
                <button onClick={() => remove(o.id)} className="mt-2 w-8 h-8 rounded-full bg-mist flex items-center justify-center press-scale">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <div className="mt-3 pl-3 border-l-2 border-line space-y-1">
              {o.items.length === 0 && <div className="text-xs text-inkSoft italic">Commande personnalisée (pas d&apos;articles du catalogue)</div>}
              {o.items.map((it, i) => (
                <div key={i} className="text-xs text-inkSoft">
                  {it.qty}x {it.name} <span className="text-inkSoft/70">({it.source})</span> — {(it.price * it.qty).toLocaleString("fr-FR")} F
                </div>
              ))}
            </div>

            {o.restaurantNote && (
              <div className="mt-2 text-xs"><span className="font-semibold text-inkSoft">Restaurant / boutique : </span>{o.restaurantNote}</div>
            )}
            {o.specialInstructions && (
              <div className="mt-1 text-xs bg-mist rounded-lg px-2.5 py-2"><span className="font-semibold text-inkSoft">Demande du client : </span>{o.specialInstructions}</div>
            )}
            {o.invoiceRequested && (
              <div className="mt-2 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange/10 text-orange">🧾 Facture demandée</div>
            )}

            <div className="flex flex-wrap gap-1.5 mt-3">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => update(o.id, { status: s })}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full press-scale ${o.status === s ? statusColor(s) : "bg-mist text-inkSoft"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
