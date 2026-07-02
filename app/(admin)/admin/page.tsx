"use client";

import Link from "next/link";
import { UtensilsCrossed, ShoppingBag, Bike, ArrowRight } from "lucide-react";
import { useRestaurants, useProducts, useDrivers, useMenuItems } from "@/lib/admin-store";

export default function AdminHome() {
  const { items: restaurants } = useRestaurants();
  const { items: products } = useProducts();
  const { items: drivers } = useDrivers();
  const { items: menu } = useMenuItems();

  const cards = [
    { label: "Restaurants", value: restaurants.length, icon: UtensilsCrossed, href: "/admin/restaurants" },
    { label: "Plats au menu", value: menu.length, icon: UtensilsCrossed, href: "/admin/restaurants" },
    { label: "Produits marketplace", value: products.length, icon: ShoppingBag, href: "/admin/produits" },
    { label: "Livreurs", value: drivers.length, icon: Bike, href: "/admin/livreurs" },
  ];

  return (
    <div>
      <h1 className="text-xl font-display font-bold mb-1">Tableau de bord</h1>
      <p className="text-sm text-inkSoft mb-6">Vue d&apos;ensemble de la plateforme.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.label} href={c.href} className="bg-white rounded-2xl p-4 border border-line">
              <Icon size={18} className="text-orange" />
              <div className="text-2xl font-bold font-mono mt-2">{c.value}</div>
              <div className="text-xs text-inkSoft mt-0.5">{c.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-3 mt-6">
        <Link href="/admin/restaurants" className="bg-white rounded-2xl p-4 border border-line flex items-center justify-between">
          <span className="text-sm font-semibold">Ajouter un restaurant ou un plat</span>
          <ArrowRight size={16} className="text-orange" />
        </Link>
        <Link href="/admin/produits" className="bg-white rounded-2xl p-4 border border-line flex items-center justify-between">
          <span className="text-sm font-semibold">Ajouter un article au marketplace</span>
          <ArrowRight size={16} className="text-orange" />
        </Link>
        <Link href="/admin/livreurs" className="bg-white rounded-2xl p-4 border border-line flex items-center justify-between">
          <span className="text-sm font-semibold">Ajouter un livreur</span>
          <ArrowRight size={16} className="text-orange" />
        </Link>
      </div>
    </div>
  );
}
