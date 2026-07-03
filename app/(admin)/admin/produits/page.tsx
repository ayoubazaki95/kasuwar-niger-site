"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { useProducts, Product } from "@/lib/admin-store";
import ImageUploadField from "@/components/ImageUploadField";
import ImageSlider from "@/components/ImageSlider";

const EMPTY: Omit<Product, "id"> = { name: "", price: 0, store: "", color: "from-green to-ink", category: "", description: "", images: [] };

type ProductForm = Omit<Product, "id"> & { id?: number };

export default function AdminProductsPage() {
  const { items, add, update, remove } = useProducts();
  const [form, setForm] = useState<ProductForm | null>(null);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    const payload = { ...form, price: Number(form.price) };
    if (form.id) update(form.id, payload);
    else add(payload);
    setForm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-display font-bold">Produits (marketplace)</h1>
        <button onClick={() => setForm(EMPTY)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-orange press-scale">
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
          <Field label="Nom de l'article" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field label="Boutique / vendeur" value={form.store} onChange={(v) => setForm({ ...form, store: v })} required />
          <Field label="Prix (FCFA)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: Number(v) })} required />
          <Field label="Catégorie (ex: Mode, Artisanat)" value={form.category || ""} onChange={(v) => setForm({ ...form, category: v })} />
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold text-inkSoft">Description</span>
            <textarea
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none resize-none"
            />
          </label>
          <ImageUploadField images={form.images || []} onChange={(images) => setForm({ ...form, images })} />
          <button type="submit" className="md:col-span-2 mt-2 py-2.5 rounded-xl text-white text-sm font-bold bg-green press-scale">Enregistrer</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {items.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-line p-4 flex items-center gap-3">
            <ImageSlider images={p.images} fallbackColor={p.color} className="w-14 h-14 rounded-xl shrink-0" alt={p.name} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold truncate">{p.name}</div>
              <div className="text-xs text-inkSoft truncate">{p.store} • {p.price.toLocaleString("fr-FR")} F</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setForm(p)} className="w-8 h-8 rounded-full bg-mist flex items-center justify-center press-scale"><Pencil size={13} /></button>
              <button onClick={() => remove(p.id)} className="w-8 h-8 rounded-full bg-mist flex items-center justify-center press-scale"><Trash2 size={13} /></button>
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
