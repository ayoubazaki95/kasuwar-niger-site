"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, UtensilsCrossed, ShoppingBag, Bike, Settings, LogOut, Shirt, Pill, Receipt, Users, Store,
} from "lucide-react";
import "../globals.css";
import Logo from "@/components/Logo";
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/restaurants", label: "Restaurants & plats", icon: UtensilsCrossed },
  { href: "/admin/produits", label: "Produits (marketplace)", icon: ShoppingBag },
  { href: "/admin/pressing", label: "Pressing", icon: Shirt },
  { href: "/admin/pharmacies", label: "Pharmacies", icon: Pill },
  { href: "/admin/livreurs", label: "Livreurs", icon: Bike },
  { href: "/admin/vendeurs", label: "Vendeurs", icon: Store },
  { href: "/admin/commandes", label: "Commandes", icon: Receipt },
  { href: "/admin/administrateurs", label: "Administrateurs", icon: Users },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading, logout } = useAdminAuth();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoginPage) router.replace("/admin/login");
  }, [loading, isAuthenticated, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;
  if (loading) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-mist">
      <aside className="w-60 shrink-0 bg-white border-r border-line min-h-screen p-4 hidden md:flex flex-col">
        <div className="px-2 mb-6">
          <Logo size={20} />
          <p className="text-[10px] text-inkSoft mt-1">Administration</p>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map((n) => {
            const active = pathname === n.href;
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  active ? "bg-orange/10 text-orange font-semibold" : "text-inkSoft hover:bg-mist"
                }`}
              >
                <Icon size={16} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={logout} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-inkSoft">
          <LogOut size={16} /> Déconnexion
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-line flex items-center justify-between px-4 py-3">
        <Logo size={18} />
        <button onClick={logout} className="text-xs font-semibold text-inkSoft flex items-center gap-1">
          <LogOut size={14} /> Quitter
        </button>
      </div>

      <div className="flex-1 min-h-screen">
        <div className="md:hidden h-14" />
        <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
          <div className="mb-5 px-3 py-2 rounded-xl text-[11px] bg-gold/10 text-[#8a5a00] border border-gold/30">
            Mode démonstration — ce que vous ajoutez ici apparaît immédiatement sur le site public, mais uniquement dans <strong>ce
            navigateur</strong> (stockage local). Un visiteur sur un autre appareil ne le verra pas tant qu&apos;il n&apos;y a pas de
            base de données partagée derrière.
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-body text-ink bg-white">
        <AdminAuthProvider>
          <AdminShell>{children}</AdminShell>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
