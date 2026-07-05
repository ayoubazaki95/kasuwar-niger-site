"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { useRestaurants, useMenuItems, Restaurant, MenuItem } from "@/lib/admin-store";
import ImageUploadField from "@/components/ImageUploadField";
import ImageSlider from "@/components/ImageSlider";

const EMPTY_RESTAURANT: Omit<Restaurant, "id"> = {
  name: "", tag: "", quartier: "", rating: 4.5, time: "20-30 min", fee: 500,
  color: "from-orange to-orange-dark", description: "", images: [],
};
const EMPTY_DISH: Omit<MenuItem, "id"> = { name: "", desc: "", price: 0, restaurantId: 0, images: [] };

type RestaurantForm = Omit<Restaurant, "id"> & { id?: number };
type DishForm = Omit<MenuItem, "id"> & { id?: number };

export default function AdminRestaurantsPage() {
  const { items: restaurants, add: addRestaurant, update: updateRestaurant, remove: removeRestaurant } = useRestaurants();
  const { items: menu, add: addDish, update: updateDish, remove: removeDish } = useMenuItems(true);

  const [form, setForm] = useState<RestaurantForm | null>(null);
  const [dishForm, setDishForm] = useState<DishForm | null>(null);

  const saveRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (form.id) updateRestaurant(form.id, form);
    else addRestaurant(form);
    setForm(null);
  };

  const saveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishForm) return;
    addDish({ ...dishForm, price: Number(dishForm.price), restaurantId: Number(dishForm.restaurantId) });
    setDishForm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-display font-bold">Restaurants & plats</h1>
        <button onClick={() => setForm(EMPTY_RESTAURANT)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-orange press-scale">
          <Plus size={14} /> Nouveau restaurant
        </button>
      </div>
      <p className="text-sm text-inkSoft mb-6">Gérez les restaurants et leurs menus.</p>

      {form && (
        <form onSubmit={saveRestaurant} className="bg-white rounded-2xl p-4 border border-line mb-6 grid md:grid-cols-2 gap-3">
          <div className="md:col-span-2 flex items-center justify-between">
            <span className="text-sm font-bold">{form.id ? "Modifier le restaurant" : "Nouveau restaurant"}</span>
            <button type="button" onClick={() => setForm(null)}><X size={16} /></button>
          </div>
          <Field label="Nom" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field label="Quartier" value={form.quartier} onChange={(v) => setForm({ ...form, quartier: v })} required />
          <Field label="Spécialités (ex: Tô, Riz au gras)" value={form.tag} onChange={(v) => setForm({ ...form, tag: v })} className="md:col-span-2" />
          <Field label="Temps de livraison" value={form.time} onChange={(v) => setForm({ ...form, time: v })} />
          <Field label="Frais de livraison (FCFA)" type="number" value={form.fee} onChange={(v) => setForm({ ...form, fee: Number(v) })} />
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

      <div className="space-y-3">
        {restaurants.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <ImageSlider images={r.images} fallbackColor={r.color} className="w-14 h-14 rounded-xl shrink-0" alt={r.name} />
                <div className="min-w-0">
                  <div className="text-sm font-bold truncate">{r.name}</div>
                  <div className="text-xs text-inkSoft truncate">{r.tag} • {r.quartier} • livraison {r.fee} F</div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setForm(r)} className="w-8 h-8 rounded-full bg-mist flex items-center justify-center press-scale"><Pencil size={13} /></button>
                <button onClick={() => removeRestaurant(r.id)} className="w-8 h-8 rounded-full bg-mist flex items-center justify-center press-scale"><Trash2 size={13} /></button>
              </div>
            </div>

            <div className="mt-3 pl-3 border-l-2 border-line space-y-1.5">
              {menu.filter((m) => m.restaurantId === r.id).map((m) => (
                <div key={m.id} className="flex items-center justify-between text-xs gap-2">
                  <span className="truncate">
                    {m.name} <span className="text-inkSoft">— {m.price.toLocaleString("fr-FR")} F</span>
                    {m.approved === false && <span className="ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gold/20 text-[#8a5a00]">EN ATTENTE</span>}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {m.approved === false && (
                      <button onClick={() => updateDish(m.id, { approved: true })} className="text-[10px] font-bold text-green">Valider</button>
                    )}
                    <button onClick={() => removeDish(m.id)} className="text-inkSoft"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setDishForm({ ...EMPTY_DISH, restaurantId: r.id })}
                className="text-[11px] font-semibold text-orange flex items-center gap-1 mt-1"
              >
                <Plus size={12} /> Ajouter un plat
              </button>
            </div>
          </div>
        ))}
      </div>

      {dishForm && (
        <form onSubmit={saveDish} className="fixed inset-0 bg-black/30 flex items-center justify-center px-6 z-40 overflow-y-auto py-10">
          <div className="bg-white rounded-2xl p-4 w-full max-w-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">Nouveau plat</span>
              <button type="button" onClick={() => setDishForm(null)}><X size={16} /></button>
            </div>
            <Field label="Nom du plat" value={dishForm.name} onChange={(v) => setDishForm({ ...dishForm, name: v })} required />
            <Field label="Description" value={dishForm.desc} onChange={(v) => setDishForm({ ...dishForm, desc: v })} />
            <Field label="Prix (FCFA)" type="number" value={dishForm.price} onChange={(v) => setDishForm({ ...dishForm, price: Number(v) })} required />
            <ImageUploadField images={dishForm.images || []} onChange={(images) => setDishForm({ ...dishForm, images })} label="Photos du plat" />
            <button type="submit" className="w-full py-2.5 rounded-xl text-white text-sm font-bold bg-green press-scale">Ajouter</button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  className = "",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
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
