"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { useProducts } from "@/lib/admin-store";

const EMPTY = { name: "", price: 0, store: "", color: "from-green to-ink" };

export default function AdminProductsPage() {
  const { items, add, update, remove } = useProducts();
  const [form, setForm] = useState<any | null>(null);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    if (form.id) update(form.id, payload);
    else add(payload);
    setForm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-display font-bold">Produits (marketplace)</h1>
        <button onClick={() => setForm(EMPTY)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-orange">
          <Plus size={14} /> Nouvel article
        </button>
      </div>
      <p className="text-sm text-inkSoft mb-6">Gérez les articles vendus sur le marketplace.</p>

      {form && (
        <form onSubmit={save} className="bg-white rounded-2xl p-4 border border-line mb-6 grid md:grid-cols-2 gap-3">
          <div className="md:col-span-2 flex items-center justify-between">
            <span className="text-sm font-bold">{form.id ? "Modifier l'article" : "Nouvel article"}</span>
            <button type="button" onClick={() => setForm(null)}><X size={16} /></button>
          </div>
          <Field label="Nom de l'article" value={form.name} onChange={(v: string) => setForm({ ...form, name: v })} required />
          <Field label="Boutique / vendeur" value={form.store} onChange={(v: string) => setForm({ ...form, store: v })} required />
          <Field label="Prix (FCFA)" type="number" value={form.price} onChange={(v: string) => setForm({ ...form, price: v })} required />
          <button type="submit" className="md:col-span-2 mt-2 py-2.5 rounded-xl text-white text-sm font-bold bg-green">Enregistrer</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {items.map((p: any) => (
          <div key={p.id} className="bg-white rounded-2xl border border-line p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold">{p.name}</div>
              <div className="text-xs text-inkSoft">{p.store} • {p.price.toLocaleString("fr-FR")} F</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setForm(p)} className="w-8 h-8 rounded-full bg-mist flex items-center justify-center"><Pencil size={13} /></button>
              <button onClick={() => remove(p.id)} className="w-8 h-8 rounded-full bg-mist flex items-center justify-center"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-inkSoft">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
      />
    </label>
  );
}
