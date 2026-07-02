import { Search } from "lucide-react";

export function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <div className="mx-5 mt-4 flex items-center gap-2 px-4 py-3 rounded-2xl bg-mist">
      <Search size={16} className="text-inkSoft" />
      <span className="text-sm text-inkSoft">{placeholder}</span>
    </div>
  );
}

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: string }) {
  return (
    <div className="flex items-center justify-between px-5 mt-6 mb-3">
      <h2 className="text-base font-display font-bold">{children}</h2>
      {action && <span className="text-xs font-semibold text-orange">{action}</span>}
    </div>
  );
}

export function Price({ amount, size = 13 }: { amount: number; size?: number }) {
  return (
    <span className="font-mono font-semibold" style={{ fontSize: size }}>
      {amount.toLocaleString("fr-FR")} F
    </span>
  );
}

export function RouteThread() {
  return (
    <svg width="100%" height="10" viewBox="0 0 320 10" className="px-5">
      <line x1="10" y1="5" x2="310" y2="5" stroke="#F5740F" strokeWidth="1.5" strokeDasharray="2 5" strokeLinecap="round" />
    </svg>
  );
}
