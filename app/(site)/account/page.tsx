import { ChevronRight } from "lucide-react";

const ITEMS = ["Mes commandes", "Mes adresses", "Moyens de paiement", "Notifications", "Aide & support"];

export default function AccountPage() {
  return (
    <div>
      <div className="px-5 pt-4 text-lg font-display font-bold">Mon compte</div>
      <div className="flex items-center gap-3 px-5 mt-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold bg-orange font-display">
          AI
        </div>
        <div>
          <div className="text-sm font-bold">Aïcha Ibrahim</div>
          <div className="text-[11px] text-inkSoft">+227 96 00 00 00</div>
        </div>
      </div>
      <div className="px-5 mt-5 space-y-1">
        {ITEMS.map((it) => (
          <button key={it} className="w-full flex items-center justify-between py-3 border-b border-line">
            <span className="text-sm">{it}</span>
            <ChevronRight size={15} className="text-inkSoft" />
          </button>
        ))}
      </div>
    </div>
  );
}
