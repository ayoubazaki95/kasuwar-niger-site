"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Star, Clock, Plus, ShoppingCart } from "lucide-react";
import { SectionTitle, Price } from "@/components/UI";
import { useRestaurants, useMenuItems } from "@/lib/admin-store";
import { useCart } from "@/lib/cart-context";

export default function RestaurantDetailPage() {
  const params = useParams();
  const { items: restaurants, hydrated: restaurantsHydrated } = useRestaurants();
  const { items: menu, hydrated: menuHydrated } = useMenuItems();
  const { addItem, items } = useCart();

  if (!restaurantsHydrated || !menuHydrated) return null;

  const restaurant = restaurants.find((r) => r.id === Number(params.id));

  if (!restaurant) {
    return <div className="px-5 py-10 text-sm text-inkSoft">Restaurant introuvable.</div>;
  }

  const dishes = menu.filter((m) => m.restaurantId === restaurant.id);
  const inCart = items.filter((i) => i.kind === "menu").reduce((s, i) => s + i.qty, 0);

  return (
    <div className="pb-2">
      <div className="px-5 pt-4">
        <Link href="/restaurants" className="inline-flex items-center gap-1.5 text-xs font-semibold text-inkSoft">
          <ArrowLeft size={14} /> Retour
        </Link>
      </div>
      <div className={`h-32 mt-3 bg-gradient-to-br ${restaurant.color}`} />
      <div className="px-5 -mt-6">
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-line">
          <div className="text-base font-bold font-display">{restaurant.name}</div>
          <div className="text-xs mt-0.5 text-inkSoft">{restaurant.tag} • {restaurant.quartier}</div>
          <div className="flex items-center gap-3 mt-2 text-xs text-inkSoft">
            <span className="flex items-center gap-1"><Star size={12} className="text-gold fill-gold" />{restaurant.rating}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{restaurant.time}</span>
            <span className="text-green font-semibold">● Ouvert</span>
          </div>
        </div>
      </div>

      <SectionTitle>Menu</SectionTitle>
      <div className="px-5 space-y-3">
        {dishes.length === 0 && (
          <div className="text-xs text-inkSoft py-4">Aucun plat ajouté pour ce restaurant pour le moment.</div>
        )}
        {dishes.map((m) => (
          <div key={m.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-line">
            <div>
              <div className="text-sm font-semibold">{m.name}</div>
              <div className="text-[11px] mt-0.5 text-inkSoft max-w-[190px]">{m.desc}</div>
              <Price amount={m.price} />
            </div>
            <button
              onClick={() => addItem({ id: m.id, kind: "menu", name: m.name, price: m.price, source: restaurant.name })}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-orange"
            >
              <Plus size={15} className="text-white" />
            </button>
          </div>
        ))}
      </div>

      {inCart > 0 && (
        <div className="px-5 mt-5">
          <Link href="/cart" className="w-full py-3 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2 bg-green">
            <ShoppingCart size={15} /> Voir le panier ({inCart})
          </Link>
        </div>
      )}
    </div>
  );
}
