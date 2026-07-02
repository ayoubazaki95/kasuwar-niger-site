"use client";

import Link from "next/link";
import { UtensilsCrossed, ShoppingBag, Shirt, Package, Pill, Truck, Star, Clock } from "lucide-react";
import { SearchBar, SectionTitle, Price, RouteThread } from "@/components/UI";
import { useRestaurants, useProducts } from "@/lib/admin-store";

const CATEGORIES = [
  { href: "/restaurants", label: "Restaurants", icon: UtensilsCrossed, color: "text-orange", bg: "bg-orange/10" },
  { href: "/marketplace", label: "Produits", icon: ShoppingBag, color: "text-green", bg: "bg-green/10" },
  { href: "/pressing", label: "Pressing", icon: Shirt, color: "text-gold", bg: "bg-gold/10" },
  { href: "/delivery", label: "Livraison", icon: Package, color: "text-orange", bg: "bg-orange/10" },
  { href: "/pharmacies", label: "Pharmacies", icon: Pill, color: "text-green", bg: "bg-green/10" },
  { href: "/delivery", label: "Courses", icon: Truck, color: "text-gold", bg: "bg-gold/10" },
];

const STEPS = [
  ["Choisissez un service", "Restaurant, boutique, pressing, livraison ou pharmacie."],
  ["Passez commande", "Paiement Mobile Money, carte ou cash à la livraison."],
  ["Suivez en temps réel", "Votre livreur vous tient informé jusqu'à la porte."],
];

export default function HomePage() {
  const { items: restaurants } = useRestaurants();
  const { items: products } = useProducts();

  return (
    <div>
      <SearchBar placeholder="Rechercher restaurants, produits, services..." />

      <div className="mx-5 mt-4 rounded-3xl p-5 relative overflow-hidden bg-gradient-to-br from-green to-green-dark">
        <p className="text-[11px] uppercase tracking-wider font-semibold text-white/75">Offre du jour</p>
        <h2 className="text-xl font-display font-extrabold mt-1 text-white max-w-[200px]">
          -20% sur votre première commande
        </h2>
        <button className="mt-3 px-4 py-2 rounded-full text-xs font-bold bg-white text-green-dark">
          En profiter
        </button>
      </div>

      <SectionTitle>Que cherchez-vous ?</SectionTitle>
      <div className="grid grid-cols-3 gap-3 px-5">
        {CATEGORIES.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link key={i} href={c.href} className="flex flex-col items-center gap-2 py-3 rounded-2xl bg-mist">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg}`}>
                <Icon size={18} className={c.color} />
              </div>
              <span className="text-[11px] font-semibold text-center">{c.label}</span>
            </Link>
          );
        })}
      </div>
      <RouteThread />

      <SectionTitle action="Voir tout">
        <Link href="/restaurants">Près de chez vous</Link>
      </SectionTitle>
      <div className="flex gap-3 px-5 overflow-x-auto pb-1">
        {restaurants.map((r) => (
          <Link key={r.id} href={`/restaurants/${r.id}`} className="min-w-[150px] rounded-2xl overflow-hidden border border-line">
            <div className={`h-20 bg-gradient-to-br ${r.color}`} />
            <div className="p-2.5">
              <div className="text-xs font-bold truncate">{r.name}</div>
              <div className="text-[10px] mt-0.5 text-inkSoft truncate">{r.tag}</div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-inkSoft">
                <Star size={10} className="text-gold fill-gold" />
                <span className="font-semibold text-ink">{r.rating}</span>
                <span>• {r.time}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <SectionTitle action="Voir tout">
        <Link href="/marketplace">Tendances marketplace</Link>
      </SectionTitle>
      <div className="grid grid-cols-2 gap-3 px-5">
        {products.slice(0, 2).map((p) => (
          <Link key={p.id} href={`/marketplace/${p.id}`} className="rounded-2xl overflow-hidden border border-line">
            <div className={`h-24 bg-gradient-to-br ${p.color}`} />
            <div className="p-2.5">
              <div className="text-xs font-semibold truncate">{p.name}</div>
              <Price amount={p.price} />
            </div>
          </Link>
        ))}
      </div>

      <SectionTitle>Comment ça marche</SectionTitle>
      <div className="px-5 space-y-2.5 mb-4">
        {STEPS.map(([t, d], i) => (
          <div key={i} className="flex gap-3 items-start p-3 rounded-2xl bg-mist">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 bg-orange font-mono">
              {i + 1}
            </div>
            <div>
              <div className="text-xs font-bold">{t}</div>
              <div className="text-[11px] mt-0.5 text-inkSoft">{d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
