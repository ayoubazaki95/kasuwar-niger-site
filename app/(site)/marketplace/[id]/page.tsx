"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { Price } from "@/components/UI";
import ImageSlider from "@/components/ImageSlider";
import { useProducts } from "@/lib/admin-store";
import { useCart } from "@/lib/cart-context";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { items: products, hydrated } = useProducts();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  if (!hydrated) return null;

  const product = products.find((p) => p.id === Number(params.id));

  if (!product) {
    return <div className="px-5 py-10 text-sm text-inkSoft">Produit introuvable.</div>;
  }

  const add = () => {
    addItem({ id: product.id, kind: "product", name: product.name, price: product.price, source: product.store }, qty);
    router.push("/cart");
  };

  return (
    <div>
      <div className="px-5 md:px-0 pt-4">
        <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-xs font-semibold text-inkSoft hover:text-ink">
          <ArrowLeft size={14} /> Retour
        </Link>
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-8 md:mt-4">
        <ImageSlider images={product.images} fallbackColor={product.color} className="h-56 md:h-96 mt-3 md:mt-0 md:rounded-2xl" alt={product.name} />
        <div className="px-5 md:px-0 mt-4 md:mt-0 animate-fade-up">
          {product.category && (
            <span className="inline-block text-[10px] font-semibold px-2 py-1 rounded-full bg-mist text-inkSoft mb-2">{product.category}</span>
          )}
          <div className="text-lg md:text-2xl font-bold font-display">{product.name}</div>
          <div className="text-xs mt-1 text-inkSoft">Vendu par {product.store}</div>
          <div className="mt-2"><Price amount={product.price} size={20} /></div>
          <p className="text-xs mt-3 leading-relaxed text-inkSoft max-w-md">
            {product.description || "Article authentique, fabriqué localement. Livraison estimée sous 24 à 48h selon votre quartier."}
          </p>
          <div className="flex items-center gap-3 mt-6">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 rounded-full flex items-center justify-center bg-mist press-scale">
              <Minus size={14} />
            </button>
            <span className="text-sm font-bold w-5 text-center font-mono">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="w-9 h-9 rounded-full flex items-center justify-center bg-mist press-scale">
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={add}
            className="w-full md:max-w-xs mt-5 py-3 rounded-2xl text-white text-sm font-bold press-scale hover-lift"
            style={{ background: "var(--brand-primary)" }}
          >
            Ajouter au panier — {(product.price * qty).toLocaleString("fr-FR")} F
          </button>
        </div>
      </div>
    </div>
  );
}
