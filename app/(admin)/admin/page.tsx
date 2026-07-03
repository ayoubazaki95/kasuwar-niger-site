"use client";

import Link from "next/link";
import { UtensilsCrossed, ShoppingBag, Bike, Shirt, Pill, Receipt, ArrowRight } from "lucide-react";
import { useRestaurants, useProducts, useDrivers, useMenuItems, usePressingServices, usePharmacies, useOrders } from "@/lib/admin-store";

export default function AdminHome() {
  const { items: restaurants } = useRestaurants();
  const { items: products } = useProducts();
  const { items: drivers } = useDrivers();
  const { items: menu } = useMenuItems();
  const { items: pressing } = usePressingServices();
  const { items: pharmacies } = usePharmacies();
  const { items: orders } = useOrders();

  const newOrders = orders.filter((o) => o.status === "Nouvelle").length;

  const cards = [
    { label: "Commandes reçues", value: orders.length, sub: newOrders > 0 ? `${newOrders} nouvelle${newOrders > 1 ? "s" : ""}` : undefined, icon: Receipt, href: "/admin/commandes" },
    { label: "Restaurants", value: restaurants.length, icon: UtensilsCrossed, href: "/admin/restaurants" },
    { label: "Plats au menu", value: menu.length, icon: UtensilsCrossed, href: "/admin/restaurants" },
    { label: "Produits marketplace", value: products.length, icon: ShoppingBag, href: "/admin/produits" },
    { label: "Services pressing", value: pressing.length, icon: Shirt, href: "/admin/pressing" },
    { label: "Pharmacies", value: pharmacies.length, icon: Pill, href: "/admin/pharmacies" },
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
            <Link key={c.label} href={c.href} className="bg-white rounded-2xl p-4 border border-line hover-lift press-scale">
              <Icon size={18} className="text-orange" />
              <div className="text-2xl font-bold font-mono mt-2">{c.value}</div>
              <div className="text-xs text-inkSoft mt-0.5">{c.label}</div>
              {c.sub && <div className="text-[10px] font-semibold text-orange mt-0.5">{c.sub}</div>}
            </Link>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-3 mt-6">
        <Link href="/admin/restaurants" className="bg-white rounded-2xl p-4 border border-line flex items-center justify-between press-scale">
          <span className="text-sm font-semibold">Ajouter un restaurant ou un plat</span>
          <ArrowRight size={16} className="text-orange" />
        </Link>
        <Link href="/admin/produits" className="bg-white rounded-2xl p-4 border border-line flex items-center justify-between press-scale">
          <span className="text-sm font-semibold">Ajouter un article au marketplace</span>
          <ArrowRight size={16} className="text-orange" />
        </Link>
        <Link href="/admin/livreurs" className="bg-white rounded-2xl p-4 border border-line flex items-center justify-between press-scale">
          <span className="text-sm font-semibold">Ajouter un livreur</span>
          <ArrowRight size={16} className="text-orange" />
        </Link>
      </div>
    </div>
  );
}
