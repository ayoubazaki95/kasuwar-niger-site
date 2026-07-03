"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { SearchBar, Price, EmptyState } from "@/components/UI";
import ImageSlider from "@/components/ImageSlider";
import { useProducts } from "@/lib/admin-store";

export default function MarketplacePage() {
  const { items: products, hydrated } = useProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tout");

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean) as string[]);
    return ["Tout", ...Array.from(set)];
  }, [products]);

  const filtered = products.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.store.toLowerCase().includes(q);
    const matchesCategory = category === "Tout" || p.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <div>
      <div className="px-5 md:px-0 pt-4 text-lg font-display font-bold">Marketplace</div>
      <SearchBar placeholder="Rechercher un produit, une boutique..." value={query} onChange={setQuery} />
      <div className="flex gap-2 px-5 md:px-0 mt-3 overflow-x-auto">
        {categories.map((f) => (
          <button
            key={f}
            onClick={() => setCategory(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap press-scale ${category === f ? "text-white" : "bg-mist"}`}
            style={category === f ? { background: "var(--brand-secondary)" } : undefined}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-5 md:px-0 mt-4 pb-4">
        {!hydrated && <div className="col-span-full text-xs text-inkSoft py-6 text-center">Chargement...</div>}
        {hydrated && filtered.length === 0 && <EmptyState text="Aucun article ne correspond." />}
        {filtered.map((p, i) => (
          <Link
            key={p.id}
            href={`/marketplace/${p.id}`}
            className={`rounded-2xl overflow-hidden border border-line hover-lift press-scale animate-fade-up stagger-${Math.min(i + 1, 6)}`}
          >
            <div className="relative">
              <ImageSlider images={p.images} fallbackColor={p.color} className="h-28 md:h-40 w-full" alt={p.name} />
              <Heart size={15} className="absolute top-2 right-2 text-white drop-shadow" />
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
