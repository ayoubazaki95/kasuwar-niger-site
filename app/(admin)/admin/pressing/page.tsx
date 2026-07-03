"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { usePressingServices, PressingService } from "@/lib/admin-store";

const EMPTY: Omit<PressingService, "id"> = { name: "", unitPrice: 0, unitLabel: "F/pièce" };

type ServiceForm = Omit<PressingService, "id"> & { id?: number };

export default function AdminPressingPage() {
  const { items, add, update, remove } = usePressingServices();
  const [form, setForm] = useState<ServiceForm | null>(null);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    const payload = { ...form, unitPrice: Number(form.unitPrice) };
    if (form.id) update(form.id, payload);
    else add(payload);
    setForm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-display font-bold">Pressing</h1>
        <button onClick={() => setForm(EMPTY)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-orange press-scale">
          <Plus size={14} /> Nouveau service
        </button>
      </div>
      <p className="text-sm text-inkSoft mb-6">Gérez les types de services de pressing proposés et leurs tarifs.</p>

      {form && (
        <form onSubmit={save} className="bg-white rounded-2xl p-4 border border-line mb-6 grid md:grid-cols-3 gap-3 max-w-2xl">
          <div className="md:col-span-3 flex items-center justify-between">
            <span className="text-sm font-bold">{form.id ? "Modifier le service" : "Nouveau service"}</span>
            <button type="button" onClick={() => setForm(null)}><X size={16} /></button>
          </div>
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold text-inkSoft">Nom du service</span>
            <input
              value={form.name}
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-inkSoft">Prix unitaire (FCFA)</span>
            <input
              type="number"
              value={form.unitPrice}
              required
              onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) })}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
            />
          </label>
          <label className="block md:col-span-3">
            <span className="text-xs font-semibold text-inkSoft">Unité affichée (ex: F/pièce, F/kg)</span>
            <input
              value={form.unitLabel}
              onChange={(e) => setForm({ ...form, unitLabel: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
            />
          </label>
          <button type="submit" className="md:col-span-3 mt-2 py-2.5 rounded-xl text-white text-sm font-bold bg-green press-scale">Enregistrer</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {items.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border border-line p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold">{s.name}</div>
              <div className="text-xs text-inkSoft font-mono">{s.unitPrice.toLocaleString("fr-FR")} {s.unitLabel}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setForm(s)} className="w-8 h-8 rounded-full bg-mist flex items-center justify-center press-scale"><Pencil size={13} /></button>
              <button onClick={() => remove(s.id)} className="w-8 h-8 rounded-full bg-mist flex items-center justify-center press-scale"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
