"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, CheckCircle2, Wallet, Banknote, PenLine } from "lucide-react";
import { Price } from "@/components/UI";
import { useCart } from "@/lib/cart-context";
import { useOrders, useSettings } from "@/lib/admin-store";
import { useCustomerAuth } from "@/lib/customer-auth";

type PaymentMethod = "Cash à la livraison" | "Mobile Money";

export default function CartPage() {
  const { items, total, clear } = useCart();
  const { add: addOrder } = useOrders();
  const { settings } = useSettings();
  const { user } = useCustomerAuth();

  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("Quartier Plateau, Rue NB-12");
  const [restaurantNote, setRestaurantNote] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [invoiceRequested, setInvoiceRequested] = useState(false);
  const [payment, setPayment] = useState<PaymentMethod>("Cash à la livraison");
  const [lastOrderSummary, setLastOrderSummary] = useState("");

  const deliveryFee = settings.baseDeliveryFee || 0;
  const grandTotal = total + (items.length > 0 ? deliveryFee : 0);
  const canSubmit = name.trim() && phone.trim() && (items.length > 0 || specialInstructions.trim());

  const confirmOrder = () => {
    if (!canSubmit) return;

    addOrder({
      createdAt: new Date().toISOString(),
      userId: user?.id,
      customerName: name.trim(),
      customerPhone: phone.trim(),
      address: address.trim(),
      restaurantNote: restaurantNote.trim(),
      specialInstructions: specialInstructions.trim(),
      invoiceRequested,
      paymentMethod: payment,
      items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price, source: i.source })),
      total: grandTotal,
      status: "Nouvelle",
    });

    const itemLines = items.length > 0
      ? items.map((i) => `• ${i.qty}x ${i.name} — ${(i.price * i.qty).toLocaleString("fr-FR")} F`).join("%0A")
      : "(Commande personnalisée — voir détails ci-dessous)";

    const message =
      `*Nouvelle commande — ${settings.siteName}*%0A%0A` +
      `Client : ${encodeURIComponent(name)}%0A` +
      `Téléphone : ${encodeURIComponent(phone)}%0A` +
      `Adresse : ${encodeURIComponent(address)}%0A` +
      (restaurantNote.trim() ? `Restaurant / boutique concerné : ${encodeURIComponent(restaurantNote)}%0A` : "") +
      `Paiement : ${encodeURIComponent(payment)}%0A%0A` +
      `${itemLines}%0A` +
      (specialInstructions.trim() ? `%0A*Demande du client :* ${encodeURIComponent(specialInstructions)}%0A` : "") +
      (invoiceRequested ? `%0A🧾 *Le client souhaite recevoir une facture*%0A` : "") +
      (items.length > 0 ? `%0ALivraison : ${deliveryFee.toLocaleString("fr-FR")} F%0A*Total : ${grandTotal.toLocaleString("fr-FR")} F*` : "");

    const waNumber = (settings.whatsappNumber || "").replace(/[^\d]/g, "");
    if (waNumber) {
      window.open(`https://wa.me/${waNumber}?text=${message}`, "_blank");
    }

    setLastOrderSummary(items.length > 0 ? `${items.length} article${items.length > 1 ? "s" : ""} • ${grandTotal.toLocaleString("fr-FR")} F` : "Commande personnalisée envoyée");
    clear();
    setStep("done");
  };

  if (step === "done") {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-20 text-center animate-fade-up">
        <CheckCircle2 size={48} className="text-green" />
        <div className="text-base font-bold mt-4 font-display">Commande envoyée</div>
        <p className="text-xs mt-2 text-inkSoft max-w-xs">
          {lastOrderSummary}. Une fenêtre WhatsApp s&apos;est ouverte pour transmettre les détails — envoyez le message pour que la commande soit reçue immédiatement.
        </p>
        <Link href="/" className="mt-6 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-green press-scale">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  if (step === "checkout") {
    return (
      <div className="px-5 md:px-0 pt-4 pb-6 md:max-w-lg">
        <button onClick={() => setStep("cart")} className="text-xs font-semibold text-inkSoft mb-3">← Retour</button>
        <p className="text-lg font-display font-bold mb-1">Finaliser la commande</p>
        {items.length === 0 && (
          <p className="text-xs text-inkSoft mb-4">Commande personnalisée — décrivez ce que vous souhaitez ci-dessous.</p>
        )}

        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-semibold text-inkSoft">Nom complet</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl bg-mist text-sm outline-none" placeholder="Votre nom" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-inkSoft">Téléphone</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl bg-mist text-sm outline-none" placeholder="+227 90 00 00 00" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-inkSoft">Adresse de livraison</span>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl bg-mist text-sm outline-none" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-inkSoft">Restaurant, boutique ou pharmacie concerné{items.length === 0 ? "" : " (facultatif)"}</span>
            <input
              value={restaurantNote}
              onChange={(e) => setRestaurantNote(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-mist text-sm outline-none"
              placeholder="Ex: Chez Mariama, Pharmacie du Plateau..."
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-inkSoft flex items-center gap-1.5">
              <PenLine size={12} /> {items.length > 0 ? "Instructions spéciales" : "Décrivez votre commande"}
            </span>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-mist text-sm outline-none resize-none"
              placeholder={items.length > 0 ? "Ex: sans piment, livrer avant 13h..." : "Ex: 2 plats de riz au gras sans oignon, 1 jus de bissap..."}
            />
          </label>

          <label className="flex items-center gap-2 px-1">
            <input type="checkbox" checked={invoiceRequested} onChange={(e) => setInvoiceRequested(e.target.checked)} className="w-4 h-4" />
            <span className="text-xs font-medium">Je souhaite recevoir une facture pour cette commande</span>
          </label>

          <div>
            <span className="text-xs font-semibold text-inkSoft">Mode de paiement</span>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              <button
                onClick={() => setPayment("Cash à la livraison")}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-[1.5px] press-scale ${payment === "Cash à la livraison" ? "border-green bg-green/5" : "border-line"}`}
              >
                <Banknote size={18} className={payment === "Cash à la livraison" ? "text-green" : "text-inkSoft"} />
                <span className="text-xs font-medium">Cash à la livraison</span>
              </button>
              <button
                onClick={() => setPayment("Mobile Money")}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-[1.5px] press-scale ${payment === "Mobile Money" ? "border-orange bg-orange/5" : "border-line"}`}
              >
                <Wallet size={18} className={payment === "Mobile Money" ? "text-orange" : "text-inkSoft"} />
                <span className="text-xs font-medium">Mobile Money</span>
              </button>
            </div>
            {payment === "Mobile Money" && (
              <p className="text-[11px] text-inkSoft mt-2 leading-relaxed">
                Le paiement Mobile Money en ligne n&apos;est pas encore connecté à un compte marchand — vous recevrez les instructions
                de paiement directement par WhatsApp après validation.
              </p>
            )}
          </div>
        </div>

        {items.length > 0 && (
          <div className="border-t border-line mt-5 pt-4 space-y-1.5">
            <div className="flex justify-between text-xs text-inkSoft"><span>Sous-total</span><Price amount={total} /></div>
            <div className="flex justify-between text-xs text-inkSoft"><span>Livraison</span><Price amount={deliveryFee} /></div>
            <div className="flex justify-between text-sm font-bold mt-1"><span>Total</span><Price amount={grandTotal} size={16} /></div>
          </div>
        )}

        <button
          onClick={confirmOrder}
          disabled={!canSubmit}
          className="w-full mt-5 py-3 rounded-2xl text-white text-sm font-bold press-scale disabled:opacity-40"
          style={{ background: "var(--brand-secondary)" }}
        >
          Valider et envoyer la commande
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-24 text-center gap-3">
        <ShoppingCart size={36} className="text-inkSoft" />
        <div className="text-sm font-semibold">Votre panier est vide</div>
        <div className="flex flex-col gap-2 mt-2 w-full max-w-xs">
          <Link href="/" className="px-5 py-2.5 rounded-full text-xs font-bold text-white press-scale" style={{ background: "var(--brand-primary)" }}>
            Explorer le catalogue
          </Link>
          <button
            onClick={() => setStep("checkout")}
            className="px-5 py-2.5 rounded-full text-xs font-bold border border-line press-scale"
          >
            Composer une commande personnalisée
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 md:px-0 pt-4 pb-6 md:max-w-lg">
      <p className="text-lg font-display font-bold mb-4">Panier</p>
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-2xl border border-line">
            <div>
              <div className="text-sm font-semibold">{item.name}</div>
              <div className="text-[11px] text-inkSoft">{item.source} • x{item.qty}</div>
            </div>
            <Price amount={item.price * item.qty} />
          </div>
        ))}
      </div>
      <button onClick={() => setStep("checkout")} className="text-xs font-semibold mt-3" style={{ color: "var(--brand-primary)" }}>
        + Ajouter une instruction spéciale ou un article personnalisé
      </button>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-sm font-bold">Total</span>
        <Price amount={total} size={16} />
      </div>
      <div className="mt-4">
        <button
          onClick={() => setStep("checkout")}
          className="w-full py-3 rounded-2xl text-white text-sm font-bold press-scale hover-lift"
          style={{ background: "var(--brand-secondary)" }}
        >
          Passer la commande
        </button>
      </div>
    </div>
  );
}
