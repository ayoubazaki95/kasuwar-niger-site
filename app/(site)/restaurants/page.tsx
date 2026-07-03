"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Clock } from "lucide-react";
import { SearchBar, EmptyState } from "@/components/UI";
import ImageSlider from "@/components/ImageSlider";
import { useRestaurants } from "@/lib/admin-store";

export default function RestaurantsPage() {
  const { items: restaurants, hydrated } = useRestaurants();
  const [query, setQuery] = useState("");

  const filtered = restaurants.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return r.name.toLowerCase().includes(q) || r.tag.toLowerCase().includes(q) || r.quartier.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="px-5 md:px-0 pt-4 text-lg font-display font-bold">Restaurants</div>
      <SearchBar placeholder="Rechercher un restaurant, un plat, un quartier..." value={query} onChange={setQuery} />
      <div className="grid md:grid-cols-2 gap-3 px-5 md:px-0 mt-4 pb-4">
        {!hydrated && <div className="text-xs text-inkSoft py-6 text-center col-span-full">Chargement...</div>}
        {hydrated && filtered.length === 0 && <EmptyState text="Aucun restaurant ne correspond à votre recherche." />}
        {filtered.map((r, i) => (
          <Link
            key={r.id}
            href={`/restaurants/${r.id}`}
            className={`w-full flex gap-3 rounded-2xl overflow-hidden border border-line hover-lift press-scale animate-fade-up stagger-${Math.min(i + 1, 6)}`}
          >
            <ImageSlider images={r.images} fallbackColor={r.color} className="w-24 h-24 md:w-28 md:h-28 shrink-0" alt={r.name} />
            <div className="py-2 pr-2">
              <div className="text-sm font-bold">{r.name}</div>
              <div className="text-[11px] text-inkSoft">{r.tag}</div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-inkSoft">
                <Star size={11} className="text-gold fill-gold" /> {r.rating}
                <Clock size={11} className="ml-1" /> {r.time}
              </div>
              <div className="text-[11px] mt-0.5 text-green">{r.quartier} • Livraison {r.fee} F</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
