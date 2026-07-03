"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Receipt, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const TABS = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/orders", label: "Commandes", icon: Receipt },
  { href: "/cart", label: "Panier", icon: ShoppingCart },
  { href: "/account", label: "Compte", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-line">
      <div className="max-w-md mx-auto flex items-center justify-around py-2">
        {TABS.map((t) => {
          const active = pathname === t.href;
          const Icon = t.icon;
          return (
            <Link key={t.href} href={t.href} className="flex flex-col items-center gap-0.5 px-3 py-1 relative">
              <Icon size={20} className={active ? "text-orange" : "text-inkSoft"} strokeWidth={active ? 2.4 : 2} />
              {t.href === "/cart" && count > 0 && (
                <span className="absolute -top-0.5 right-1 w-4 h-4 rounded-full bg-orange text-white text-[9px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
              <span className={`text-[10px] ${active ? "text-orange font-bold" : "text-inkSoft font-medium"}`}>{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
