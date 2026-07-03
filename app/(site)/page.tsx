"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { UtensilsCrossed, ShoppingBag, Shirt, Package, Pill, Truck, Star, Clock } from "lucide-react";
import { SearchBar, SectionTitle, Price, RouteThread } from "@/components/UI";
import ImageSlider from "@/components/ImageSlider";
import { useRestaurants, useProducts, useSettings } from "@/lib/admin-store";

const CATEGORIES = [
  { href: "/restaurants", label: "Restaurants", icon: UtensilsCrossed, color: "text-orange", bg: "bg-orange/10" },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag, color: "text-green", bg: "bg-green/10" },
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
  const router = useRouter();
  const { items: restaurants } = useRestaurants();
  const { items: products } = useProducts();
  const { settings, hydrated } = useSettings();

  return (
    <div>
      <div className="md:hidden">
        <SearchBar placeholder="Rechercher restaurants, produits, services..." />
      </div>

      <div className="mx-5 md:mx-0 mt-4 md:mt-6 rounded-3xl p-6 md:p-10 relative overflow-hidden animate-fade-up"
        style={{ background: "linear-gradient(135deg, var(--brand-secondary), var(--brand-secondary))" }}>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute right-16 bottom-4 w-16 h-16 rounded-full bg-white/10" />
        <p className="text-[11px] uppercase tracking-wider font-semibold text-white/75 relative">
          {hydrated ? settings.heroSubtitle : "Offre du jour"}
        </p>
        <h2 className="text-xl md:text-3xl font-display font-extrabold mt-1 text-white max-w-[220px] md:max-w-md relative">
          {hydrated ? settings.heroTitle : "-20% sur votre première commande"}
        </h2>
        <button
          onClick={() => router.push("/marketplace")}
          className="mt-4 px-5 py-2.5 rounded-full text-xs font-bold bg-white relative press-scale hover-lift"
          style={{ color: "var(--brand-secondary)" }}
        >
          {hydrated ? settings.promoButtonLabel : "En profiter"}
        </button>
      </div>

      <SectionTitle>Que cherchez-vous ?</SectionTitle>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 px-5 md:px-0">
        {CATEGORIES.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link
              key={i}
              href={c.href}
              className={`flex flex-col items-center gap-2 py-4 rounded-2xl bg-mist hover-lift press-scale animate-fade-up stagger-${Math.min(i + 1, 6)}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg}`}>
                <Icon size={18} className={c.color} />
              </div>
              <span className="text-[11px] font-semibold text-center">{c.label}</span>
            </Link>
          );
        })}
      </div>
      <RouteThread />

      <SectionTitle action="Voir tout" onAction={() => router.push("/restaurants")}>
        <Link href="/restaurants">Près de chez vous</Link>
      </SectionTitle>
      <div className="flex md:grid md:grid-cols-4 gap-3 px-5 md:px-0 overflow-x-auto pb-1">
        {restaurants.map((r, i) => (
          <Link
            key={r.id}
            href={`/restaurants/${r.id}`}
            className={`min-w-[150px] md:min-w-0 rounded-2xl overflow-hidden border border-line hover-lift press-scale animate-fade-up stagger-${Math.min(i + 1, 6)}`}
          >
            <ImageSlider images={r.images} fallbackColor={r.color} className="h-20 md:h-32 w-full" alt={r.name} />
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

      <SectionTitle action="Voir tout" onAction={() => router.push("/marketplace")}>
        <Link href="/marketplace">Tendances marketplace</Link>
      </SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-5 md:px-0">
        {products.slice(0, 4).map((p, i) => (
          <Link
            key={p.id}
            href={`/marketplace/${p.id}`}
            className={`rounded-2xl overflow-hidden border border-line hover-lift press-scale animate-fade-up stagger-${Math.min(i + 1, 6)}`}
          >
            <ImageSlider images={p.images} fallbackColor={p.color} className="h-24 md:h-36 w-full" alt={p.name} />
            <div className="p-2.5">
              <div className="text-xs font-semibold truncate">{p.name}</div>
              <Price amount={p.price} />
            </div>
          </Link>
        ))}
      </div>

      <SectionTitle>Comment ça marche</SectionTitle>
      <div className="grid md:grid-cols-3 gap-2.5 px-5 md:px-0 mb-4">
        {STEPS.map(([t, d], i) => (
          <div key={i} className={`flex gap-3 items-start p-3 rounded-2xl bg-mist animate-fade-up stagger-${i + 1}`}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 font-mono" style={{ background: "var(--brand-primary)" }}>
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
