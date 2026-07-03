import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import MaintenanceGate from "@/components/MaintenanceGate";
import ThemeApplier from "@/components/ThemeApplier";
import { CartProvider } from "@/lib/cart-context";

export const metadata: Metadata = {
  title: "Kasuwar Niger — E-commerce Marketplace",
  description: "Restaurants, marketplace, pressing, livraison et pharmacies de garde, dans une seule application.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-body text-ink bg-white">
        <MaintenanceGate>
          <CartProvider>
            <ThemeApplier />
            <div className="min-h-screen flex flex-col relative">
              <Header />
              <main className="flex-1 pb-24 md:pb-10 w-full max-w-6xl mx-auto">{children}</main>
              <BottomNav />
            </div>
          </CartProvider>
        </MaintenanceGate>
      </body>
    </html>
  );
}
