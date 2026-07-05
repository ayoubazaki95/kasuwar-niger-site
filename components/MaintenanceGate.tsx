"use client";

import { useEffect, useState, ReactNode } from "react";
import { Wrench } from "lucide-react";
import Logo from "./Logo";

export default function MaintenanceGate({ children }: { children: ReactNode }) {
  const [maintenance, setMaintenance] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setMaintenance(!!data?.item?.maintenance_mode))
      .catch(() => {
        /* si l'API échoue, on n'affiche pas la maintenance par défaut */
      })
      .finally(() => setChecked(true));
  }, []);

  if (!checked) return null;

  if (maintenance) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
        <Logo size={26} />
        <Wrench size={28} className="text-orange mt-6" />
        <div className="text-base font-bold font-display mt-3">Site en maintenance</div>
        <p className="text-xs text-inkSoft mt-2 max-w-xs">
          Nous mettons à jour la plateforme. Le service sera de nouveau disponible très bientôt.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
