import { Receipt } from "lucide-react";

export default function OrdersPage() {
  return (
    <div>
      <div className="px-5 md:px-0 pt-4 text-lg font-display font-bold">Mes commandes</div>
      <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
        <Receipt size={32} className="text-inkSoft" />
        <div className="text-sm font-semibold mt-3">Aucune commande pour le moment</div>
        <p className="text-xs mt-1 text-inkSoft">
          Vos commandes passées apparaîtront ici avec leur statut en temps réel.
        </p>
      </div>
    </div>
  );
}
