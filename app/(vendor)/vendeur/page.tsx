"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Plus, ShoppingBag, UtensilsCrossed, Clock, CheckCircle2 } from "lucide-react";
import { useVendorAuth } from "@/lib/vendor-auth";
import { useProducts, useMenuItems, useRestaurants } from "@/lib/admin-store";
import ImageUploadField from "@/components/ImageUploadField";

export default function VendorDashboard() {
  const router = useRouter();
  const { isAuthenticated, loading, vendorId, businessName, logout } = useVendorAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/vendeur/login");
  }, [loading, isAuthenticated, router]);

  const { items: products, add: addProduct } = useProducts(true);
  const { items: dishes, add: addDish } = useMenuItems(true);
  const { items: restaurants } = useRestaurants();

  const [tab, setTab] = useState<"product" | "dish">("product");

  // Formulaire produit
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCategory, setPCategory] = useState("");
  const [pDescription, setPDescription] = useState("");
  const [pImages, setPImages] = useState<string[]>([]);

  // Formulaire plat
  const [dRestaurantId, setDRestaurantId] = useState<number | "">("");
  const [dName, setDName] = useState("");
  const [dDesc, setDDesc] = useState("");
  const [dPrice, setDPrice] = useState("");
  const [dImages, setDImages] = useState<string[]>([]);

  const [confirmation, setConfirmation] = useState("");

  if (loading || !isAuthenticated) return null;

  const submitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProduct({
      name: pName,
      price: Number(pPrice),
      store: businessName,
      color: "from-orange to-gold",
      category: pCategory,
      description: pDescription,
      images: pImages,
      vendorId: vendorId!,
      approved: false,
    });
    setPName(""); setPPrice(""); setPCategory(""); setPDescription(""); setPImages([]);
    setConfirmation("Article envoyé — en attente de validation par l'administrateur.");
    setTimeout(() => setConfirmation(""), 4000);
  };

  const submitDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dRestaurantId) return;
    await addDish({
      restaurantId: Number(dRestaurantId),
      name: dName,
      desc: dDesc,
      price: Number(dPrice),
      images: dImages,
      vendorId: vendorId!,
      approved: false,
    });
    setDName(""); setDDesc(""); setDPrice(""); setDImages([]);
    setConfirmation("Plat envoyé — en attente de validation par l'administrateur.");
    setTimeout(() => setConfirmation(""), 4000);
  };

  const myProducts = products.filter((p) => p.vendorId === vendorId);
  const myDishes = dishes.filter((d) => d.vendorId === vendorId);

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-lg font-display font-bold">{businessName}</p>
          <p className="text-xs text-inkSoft">Espace vendeur</p>
        </div>
        <button onClick={() => { logout(); router.push("/vendeur/login"); }} className="flex items-center gap-1.5 text-xs font-semibold text-inkSoft">
          <LogOut size={14} /> Déconnexion
        </button>
      </div>

      {confirmation && (
        <div className="mb-4 px-4 py-3 rounded-2xl bg-green/10 text-green text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={14} /> {confirmation}
        </div>
      )}

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTab("product")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold press-scale ${tab === "product" ? "bg-orange text-white" : "bg-white border border-line"}`}
        >
          <ShoppingBag size={14} /> Ajouter un article
        </button>
        <button
          onClick={() => setTab("dish")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold press-scale ${tab === "dish" ? "bg-orange text-white" : "bg-white border border-line"}`}
        >
          <UtensilsCrossed size={14} /> Ajouter un plat
        </button>
      </div>

      {tab === "product" ? (
        <form onSubmit={submitProduct} className="bg-white rounded-2xl border border-line p-4 space-y-3 mb-6">
          <label className="block">
            <span className="text-xs font-semibold text-inkSoft">Nom de l&apos;article</span>
            <input required value={pName} onChange={(e) => setPName(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-inkSoft">Prix (FCFA)</span>
            <input required type="number" value={pPrice} onChange={(e) => setPPrice(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-inkSoft">Catégorie (ex: Mode, Artisanat)</span>
            <input value={pCategory} onChange={(e) => setPCategory(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-inkSoft">Description</span>
            <textarea value={pDescription} onChange={(e) => setPDescription(e.target.value)} rows={2} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none resize-none" />
          </label>
          <ImageUploadField images={pImages} onChange={setPImages} />
          <button type="submit" className="w-full py-2.5 rounded-xl text-white text-sm font-bold bg-green press-scale">
            Envoyer pour validation
          </button>
        </form>
      ) : (
        <form onSubmit={submitDish} className="bg-white rounded-2xl border border-line p-4 space-y-3 mb-6">
          <label className="block">
            <span className="text-xs font-semibold text-inkSoft">Restaurant</span>
            <select
              required
              value={dRestaurantId}
              onChange={(e) => setDRestaurantId(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
            >
              <option value="">Choisir un restaurant</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-inkSoft">Nom du plat</span>
            <input required value={dName} onChange={(e) => setDName(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-inkSoft">Description</span>
            <input value={dDesc} onChange={(e) => setDDesc(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-inkSoft">Prix (FCFA)</span>
            <input required type="number" value={dPrice} onChange={(e) => setDPrice(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none" />
          </label>
          <ImageUploadField images={dImages} onChange={setDImages} label="Photos du plat" />
          <button type="submit" className="w-full py-2.5 rounded-xl text-white text-sm font-bold bg-green press-scale">
            Envoyer pour validation
          </button>
        </form>
      )}

      <p className="text-sm font-bold mb-3">Mes articles</p>
      <div className="space-y-2 mb-6">
        {myProducts.length === 0 && <p className="text-xs text-inkSoft">Aucun article envoyé pour le moment.</p>}
        {myProducts.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-line p-3 flex items-center justify-between">
            <span className="text-sm">{p.name}</span>
            <StatusBadge approved={p.approved !== false} />
          </div>
        ))}
      </div>

      <p className="text-sm font-bold mb-3">Mes plats</p>
      <div className="space-y-2">
        {myDishes.length === 0 && <p className="text-xs text-inkSoft">Aucun plat envoyé pour le moment.</p>}
        {myDishes.map((d) => (
          <div key={d.id} className="bg-white rounded-2xl border border-line p-3 flex items-center justify-between">
            <span className="text-sm">{d.name}</span>
            <StatusBadge approved={d.approved !== false} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ approved }: { approved: boolean }) {
  return approved ? (
    <span className="flex items-center gap-1 text-[11px] font-semibold text-green"><CheckCircle2 size={12} /> Publié</span>
  ) : (
    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#8a5a00]"><Clock size={12} /> En attente</span>
  );
}
