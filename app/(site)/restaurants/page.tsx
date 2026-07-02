"use client";

import Link from "next/link";
import { Star, Clock } from "lucide-react";
import { SearchBar } from "@/components/UI";
import { useRestaurants } from "@/lib/admin-store";

export default function RestaurantsPage() {
  const { items: restaurants, hydrated } = useRestaurants();

  return (
    <div>
      <div className="px-5 pt-4 text-lg font-display font-bold">Restaurants</div>
      <SearchBar placeholder="Rechercher un restaurant..." />
      <div className="px-5 mt-4 space-y-3 pb-4">
        {!hydrated && <div className="text-xs text-inkSoft py-6 text-center">Chargement...</div>}
        {hydrated && restaurants.length === 0 && (
          <div className="text-xs text-inkSoft py-6 text-center">Aucun restaurant pour le moment.</div>
        )}
        {restaurants.map((r) => (
          <Link key={r.id} href={`/restaurants/${r.id}`} className="w-full flex gap-3 rounded-2xl overflow-hidden border border-line">
            <div className={`w-20 h-20 shrink-0 bg-gradient-to-br ${r.color}`} />
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
