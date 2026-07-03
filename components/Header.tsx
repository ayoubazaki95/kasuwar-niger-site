"use client";

import { MapPin, Bell, ChevronRight, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "./Logo";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { href: "/restaurants", label: "Restaurants" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/pressing", label: "Pressing" },
  { href: "/delivery", label: "Livraison" },
  { href: "/pharmacies", label: "Pharmacies" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { count } = useCart();
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery("");
  }, [pathname]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/recherche?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-line">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 gap-4">
          <Link href="/" className="shrink-0">
            <Logo size={22} />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors ${pathname === l.href ? "text-orange" : "text-inkSoft hover:text-ink"}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop search */}
          <form onSubmit={submitSearch} className="hidden md:flex items-center gap-2 flex-1 max-w-xs px-3 py-2 rounded-full bg-mist">
            <Search size={15} className="text-inkSoft shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher..."
              className="bg-transparent text-sm outline-none w-full"
            />
          </form>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/cart" className="hidden md:flex relative w-9 h-9 rounded-full items-center justify-center bg-mist press-scale">
              <ShoppingCart size={16} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange text-white text-[9px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <button className="w-9 h-9 rounded-full flex items-center justify-center bg-mist press-scale">
              <Bell size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-4 md:px-6 pb-3 text-ink">
          <MapPin size={14} className="text-orange" />
          <span className="text-xs font-semibold flex items-center gap-0.5">
            Livrer à Plateau, Niamey <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </header>
  );
}
