"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * SearchBar fonctionnelle :
 * - si `value`/`onChange` sont fournis -> mode "filtre en direct" sur la page actuelle
 * - sinon -> à la validation, redirige vers /recherche?q=...
 */
export function SearchBar({
  placeholder,
  value,
  onChange,
  className = "",
}: {
  placeholder: string;
  value?: string;
  onChange?: (v: string) => void;
  className?: string;
}) {
  const router = useRouter();
  const [internal, setInternal] = useState("");
  const controlled = value !== undefined && onChange !== undefined;
  const current = controlled ? value! : internal;
  const setCurrent = controlled ? onChange! : setInternal;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = current.trim();
    if (!q) return;
    if (!controlled) router.push(`/recherche?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={submit} className={`mx-5 mt-4 flex items-center gap-2 px-4 py-3 rounded-2xl bg-mist ${className}`}>
      <Search size={16} className="text-inkSoft shrink-0" />
      <input
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent text-sm outline-none w-full placeholder:text-inkSoft"
      />
      {current && (
        <button type="button" onClick={() => setCurrent("")} className="shrink-0">
          <X size={14} className="text-inkSoft" />
        </button>
      )}
    </form>
  );
}

export function SectionTitle({ children, action, onAction }: { children: React.ReactNode; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 md:px-0 mt-6 mb-3">
      <h2 className="text-base font-display font-bold">{children}</h2>
      {action && (
        <button onClick={onAction} type="button" className="text-xs font-semibold text-orange">
          {action}
        </button>
      )}
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
    <svg width="100%" height="10" viewBox="0 0 320 10" className="px-5 md:hidden">
      <line x1="10" y1="5" x2="310" y2="5" stroke="var(--brand-primary)" strokeWidth="1.5" strokeDasharray="2 5" strokeLinecap="round" />
    </svg>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <p className="text-xs text-inkSoft py-8 text-center col-span-full">{text}</p>;
}
