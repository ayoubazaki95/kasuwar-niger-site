"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { useDrivers } from "@/lib/admin-store";

const EMPTY = { name: "", phone: "", vehicle: "Moto", zone: "", status: "Disponible" };
const STATUSES = ["Disponible", "En course", "Hors service"];
const VEHICLES = ["Moto", "Vélo", "Voiture"];

export default function AdminDriversPage() {
  const { items, add, update, remove } = useDrivers();
  const [form, setForm] = useState<any | null>(null);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.id) update(form.id, form);
    else add(form);
    setForm(null);
  };

  const statusColor = (s: string) =>
    s === "Disponible" ? "bg-[#E8F6ED] text-green" : s === "En course" ? "bg-[#FBF1DD] text-[#8a5a00]" : "bg-mist text-inkSoft";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-display font-bold">Livreurs</h1>
        <button onClick={() => setForm(EMPTY)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-orange">
          <Plus size={14} /> Nouveau livreur
        </button>
      </div>
      <p className="text-sm text-inkSoft mb-6">Gérez l&apos;équipe de livreurs et leur disponibilité.</p>

      {form && (
        <form onSubmit={save} className="bg-white rounded-2xl p-4 border border-line mb-6 grid md:grid-cols-2 gap-3">
          <div className="md:col-span-2 flex items-center justify-between">
            <span className="text-sm font-bold">{form.id ? "Modifier le livreur" : "Nouveau livreur"}</span>
            <button type="button" onClick={() => setForm(null)}><X size={16} /></button>
          </div>
          <Field label="Nom complet" value={form.name} onChange={(v: string) => setForm({ ...form, name: v })} required />
          <Field label="Téléphone" value={form.phone} onChange={(v: string) => setForm({ ...form, phone: v })} required />
          <Field label="Zone de livraison" value={form.zone} onChange={(v: string) => setForm({ ...form, zone: v })} required />
          <label className="block">
            <span className="text-xs font-semibold text-inkSoft">Véhicule</span>
            <select value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none">
              {VEHICLES.map((v) => <option key={v}>{v}</option>)}
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold text-inkSoft">Statut</span>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none">
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <button type="submit" className="md:col-span-2 mt-2 py-2.5 rounded-xl text-white text-sm font-bold bg-green">Enregistrer</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {items.map((d: any) => (
          <div key={d.id} className="bg-white rounded-2xl border border-line p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold">{d.name}</div>
              <div className="text-xs text-inkSoft">{d.phone} • {d.vehicle} • {d.zone}</div>
              <span className={`inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor(d.status)}`}>{d.status}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setForm(d)} className="w-8 h-8 rounded-full bg-mist flex items-center justify-center"><Pencil size={13} /></button>
              <button onClick={() => remove(d.id)} className="w-8 h-8 rounded-full bg-mist flex items-center justify-center"><Trash2 size={13} /></button>
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
  required = false,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
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
