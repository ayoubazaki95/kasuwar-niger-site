import type { Metadata, Viewport } from "next";
import "../globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import MaintenanceGate from "@/components/MaintenanceGate";
import ThemeApplier from "@/components/ThemeApplier";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { CartProvider } from "@/lib/cart-context";
import { CustomerAuthProvider } from "@/lib/customer-auth";

export const metadata: Metadata = {
  title: "Kasuwar Niger — E-commerce Marketplace",
  description: "Restaurants, marketplace, pressing, livraison et pharmacies de garde, dans une seule application.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#F5740F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-body text-ink bg-white">
        <MaintenanceGate>
          <CustomerAuthProvider>
            <CartProvider>
              <ThemeApplier />
              <ServiceWorkerRegister />
              <div className="min-h-screen flex flex-col relative">
                <Header />
                <main className="flex-1 pb-24 md:pb-10 w-full max-w-6xl mx-auto">{children}</main>
                <BottomNav />
              </div>
            </CartProvider>
          </CustomerAuthProvider>
        </MaintenanceGate>
      </body>
    </html>
  );
}
