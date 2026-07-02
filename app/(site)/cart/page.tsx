"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Price } from "@/components/UI";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, total, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-24 text-center">
        <ShoppingCart size={36} className="text-inkSoft" />
        <div className="text-sm font-semibold mt-3">Votre panier est vide</div>
        <Link href="/" className="mt-4 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-orange">
          Explorer
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="px-5 pt-4 text-lg font-display font-bold">Panier</div>
      <div className="px-5 mt-4 space-y-2.5">
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
      <div className="px-5 mt-5 flex items-center justify-between">
        <span className="text-sm font-bold">Total</span>
        <Price amount={total} size={16} />
      </div>
      <div className="px-5 mt-4">
        <button onClick={clear} className="w-full py-3 rounded-2xl text-white text-sm font-bold bg-green">
          Payer • Mobile Money / Cash
        </button>
      </div>
    </div>
  );
}
