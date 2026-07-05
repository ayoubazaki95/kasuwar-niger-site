import "../globals.css";
import { VendorAuthProvider } from "@/lib/vendor-auth";

export const metadata = {
  title: "Espace vendeur — Kasuwar Niger",
};

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-body text-ink bg-mist min-h-screen">
        <VendorAuthProvider>{children}</VendorAuthProvider>
      </body>
    </html>
  );
}
