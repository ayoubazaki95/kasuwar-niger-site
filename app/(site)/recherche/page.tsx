"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Star, Clock } from "lucide-react";
import { Price, EmptyState } from "@/components/UI";
import ImageSlider from "@/components/ImageSlider";
import { useRestaurants, useProducts } from "@/lib/admin-store";

function SearchResultsContent() {
  const params = useSearchParams();
  const q = (params.get("q") || "").trim().toLowerCase();
  const { items: restaurants } = useRestaurants();
  const { items: products } = useProducts();

  const matchedRestaurants = q
    ? restaurants.filter((r) => r.name.toLowerCase().includes(q) || r.tag.toLowerCase().includes(q) || r.quartier.toLowerCase().includes(q))
    : [];
  const matchedProducts = q
    ? products.filter((p) => p.name.toLowerCase().includes(q) || p.store.toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q))
    : [];
  const total = matchedRestaurants.length + matchedProducts.length;

  return (
    <div className="px-5 md:px-0 pt-4 pb-6">
      <p className="text-lg font-display font-bold mb-1">Résultats pour « {params.get("q")} »</p>
      <p className="text-xs text-inkSoft mb-6">{total} résultat{total !== 1 ? "s" : ""} trouvé{total !== 1 ? "s" : ""}</p>

      {total === 0 && <EmptyState text="Aucun résultat. Essayez un autre mot-clé." />}

      {matchedRestaurants.length > 0 && (
        <>
          <p className="text-sm font-bold mb-3">Restaurants</p>
          <div className="space-y-3 mb-6">
            {matchedRestaurants.map((r) => (
              <Link key={r.id} href={`/restaurants/${r.id}`} className="flex gap-3 rounded-2xl overflow-hidden border border-line hover-lift">
                <ImageSlider images={r.images} fallbackColor={r.color} className="w-20 h-20 shrink-0" alt={r.name} />
                <div className="py-2 pr-2">
                  <p className="text-sm font-bold">{r.name}</p>
                  <p className="text-[11px] text-inkSoft">{r.tag}</p>
                  <p className="flex items-center gap-1.5 mt-1 text-[11px] text-inkSoft">
                    <Star size={11} className="text-gold fill-gold" /> {r.rating}
                    <Clock size={11} className="ml-1" /> {r.time}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {matchedProducts.length > 0 && (
        <>
          <p className="text-sm font-bold mb-3">Marketplace</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {matchedProducts.map((p) => (
              <Link key={p.id} href={`/marketplace/${p.id}`} className="rounded-2xl overflow-hidden border border-line hover-lift">
                <ImageSlider images={p.images} fallbackColor={p.color} className="h-28 w-full" alt={p.name} />
                <div className="p-2.5">
                  <p className="text-xs font-semibold truncate">{p.name}</p>
                  <p className="text-[10px] text-inkSoft">{p.store}</p>
                  <Price amount={p.price} />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="px-5 py-10 text-sm text-inkSoft">Chargement...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
