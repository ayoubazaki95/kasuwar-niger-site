"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { usePharmacies, Pharmacy } from "@/lib/admin-store";

const EMPTY: Omit<Pharmacy, "id"> = { name: "", quartier: "", distance: "", hours: "Garde 24h", phone: "" };

type PharmacyForm = Omit<Pharmacy, "id"> & { id?: number };

export default function AdminPharmaciesPage() {
  const { items, add, update, remove } = usePharmacies();
  const [form, setForm] = useState<PharmacyForm | null>(null);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (form.id) update(form.id, form);
    else add(form);
    setForm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-display font-bold">Pharmacies</h1>
        <button onClick={() => setForm(EMPTY)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-orange press-scale">
          <Plus size={14} /> Nouvelle pharmacie
        </button>
      </div>
      <p className="text-sm text-inkSoft mb-6">Gérez la liste des pharmacies de garde affichées aux clients.</p>

      {form && (
        <form onSubmit={save} className="bg-white rounded-2xl p-4 border border-line mb-6 grid md:grid-cols-2 gap-3 max-w-2xl">
          <div className="md:col-span-2 flex items-center justify-between">
            <span className="text-sm font-bold">{form.id ? "Modifier la pharmacie" : "Nouvelle pharmacie"}</span>
            <button type="button" onClick={() => setForm(null)}><X size={16} /></button>
          </div>
          <Field label="Nom" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field label="Téléphone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
          <Field label="Quartier / adresse" value={form.quartier} onChange={(v) => setForm({ ...form, quartier: v })} className="md:col-span-2" />
          <Field label="Distance affichée (ex: 1.2 km)" value={form.distance} onChange={(v) => setForm({ ...form, distance: v })} />
          <Field label="Horaires (ex: Garde 24h)" value={form.hours} onChange={(v) => setForm({ ...form, hours: v })} />
          <button type="submit" className="md:col-span-2 mt-2 py-2.5 rounded-xl text-white text-sm font-bold bg-green press-scale">Enregistrer</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {items.map((ph) => (
          <div key={ph.id} className="bg-white rounded-2xl border border-line p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold">{ph.name}</div>
              <div className="text-xs text-inkSoft">{ph.quartier}</div>
              <div className="text-xs text-inkSoft font-mono mt-0.5">{ph.distance} • {ph.hours}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setForm(ph)} className="w-8 h-8 rounded-full bg-mist flex items-center justify-center press-scale"><Pencil size={13} /></button>
              <button onClick={() => remove(ph.id)} className="w-8 h-8 rounded-full bg-mist flex items-center justify-center press-scale"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, required = false, className = "",
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-semibold text-inkSoft">{label}</span>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
      />
    </label>
  );
}
