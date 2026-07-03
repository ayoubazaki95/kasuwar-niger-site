"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Star, Clock, Plus, ShoppingCart } from "lucide-react";
import { SectionTitle, Price, EmptyState } from "@/components/UI";
import ImageSlider from "@/components/ImageSlider";
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
      <div className="px-5 md:px-0 pt-4">
        <Link href="/restaurants" className="inline-flex items-center gap-1.5 text-xs font-semibold text-inkSoft hover:text-ink">
          <ArrowLeft size={14} /> Retour
        </Link>
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-8 md:mt-4">
        <ImageSlider images={restaurant.images} fallbackColor={restaurant.color} className="h-40 md:h-80 mt-3 md:mt-0 md:rounded-2xl" alt={restaurant.name} />

        <div>
          <div className="px-5 md:px-0 -mt-6 md:mt-0">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-line animate-fade-up">
              <div className="text-base md:text-xl font-bold font-display">{restaurant.name}</div>
              <div className="text-xs mt-0.5 text-inkSoft">{restaurant.tag} • {restaurant.quartier}</div>
              <div className="flex items-center gap-3 mt-2 text-xs text-inkSoft">
                <span className="flex items-center gap-1"><Star size={12} className="text-gold fill-gold" />{restaurant.rating}</span>
                <span className="flex items-center gap-1"><Clock size={12} />{restaurant.time}</span>
                <span className="text-green font-semibold">● Ouvert</span>
              </div>
              {restaurant.description && <p className="text-xs text-inkSoft mt-3 leading-relaxed">{restaurant.description}</p>}
            </div>
          </div>

          <SectionTitle>Menu</SectionTitle>
          <div className="px-5 md:px-0 space-y-3">
            {dishes.length === 0 && <EmptyState text="Aucun plat ajouté pour ce restaurant pour le moment." />}
            {dishes.map((m, i) => (
              <div key={m.id} className={`flex items-center gap-3 p-3 rounded-2xl border border-line hover-lift animate-fade-up stagger-${Math.min(i + 1, 6)}`}>
                {m.images && m.images.length > 0 && (
                  <ImageSlider images={m.images} fallbackColor={restaurant.color} className="w-16 h-16 rounded-xl shrink-0" alt={m.name} />
                )}
                <div className="flex-1">
                  <div className="text-sm font-semibold">{m.name}</div>
                  <div className="text-[11px] mt-0.5 text-inkSoft">{m.desc}</div>
                  <Price amount={m.price} />
                </div>
                <button
                  onClick={() => addItem({ id: m.id, kind: "menu", name: m.name, price: m.price, source: restaurant.name })}
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 press-scale"
                  style={{ background: "var(--brand-primary)" }}
                >
                  <Plus size={16} className="text-white" />
                </button>
              </div>
            ))}
          </div>

          {inCart > 0 && (
            <div className="px-5 md:px-0 mt-5">
              <Link
                href="/cart"
                className="w-full py-3 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2 press-scale"
                style={{ background: "var(--brand-secondary)" }}
              >
                <ShoppingCart size={15} /> Voir le panier ({inCart})
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
