"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { SearchBar, Price } from "@/components/UI";
import { useProducts } from "@/lib/admin-store";

const FILTERS = ["Tout", "Mode", "Artisanat", "Maison", "Beauté"];

export default function MarketplacePage() {
  const { items: products, hydrated } = useProducts();

  return (
    <div>
      <div className="px-5 pt-4 text-lg font-display font-bold">Marketplace</div>
      <SearchBar placeholder="Rechercher un produit..." />
      <div className="flex gap-2 px-5 mt-3 overflow-x-auto">
        {FILTERS.map((f, i) => (
          <span key={f} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${i === 0 ? "bg-green text-white" : "bg-mist"}`}>
            {f}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 px-5 mt-4 pb-4">
        {!hydrated && <div className="col-span-2 text-xs text-inkSoft py-6 text-center">Chargement...</div>}
        {hydrated && products.length === 0 && (
          <div className="col-span-2 text-xs text-inkSoft py-6 text-center">Aucun article pour le moment.</div>
        )}
        {products.map((p) => (
          <Link key={p.id} href={`/marketplace/${p.id}`} className="rounded-2xl overflow-hidden border border-line">
            <div className={`h-28 relative bg-gradient-to-br ${p.color}`}>
              <Heart size={15} className="absolute top-2 right-2 text-white" />
            </div>
            <div className="p-2.5">
              <div className="text-xs font-semibold truncate">{p.name}</div>
              <div className="text-[10px] mt-0.5 text-inkSoft">{p.store}</div>
              <Price amount={p.price} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
