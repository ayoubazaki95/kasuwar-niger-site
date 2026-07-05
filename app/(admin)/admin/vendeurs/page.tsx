"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Store } from "lucide-react";

type VendorAccount = { id: number; email: string; business_name: string; created_at: string };

export default function AdminVendorsPage() {
  const [accounts, setAccounts] = useState<VendorAccount[]>([]);
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => {
    fetch("/api/vendor-accounts")
      .then((res) => res.json())
      .then((data) => setAccounts(data.items || []))
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const addVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/vendor-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, businessName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'ajout.");
      } else {
        setEmail("");
        setBusinessName("");
        setPassword("");
        load();
      }
    } catch {
      setError("Erreur réseau. Vérifiez la connexion à la base de données.");
    } finally {
      setBusy(false);
    }
  };

  const removeVendor = async (id: number) => {
    await fetch(`/api/vendor-accounts/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <h1 className="text-xl font-display font-bold mb-1">Vendeurs</h1>
      <p className="text-sm text-inkSoft mb-6">
        Les vendeurs peuvent se connecter sur <code className="bg-mist px-1.5 py-0.5 rounded">/vendeur</code> pour ajouter des
        produits et des plats — chaque ajout reste <strong>en attente de validation</strong> et n&apos;apparaît sur le site
        qu&apos;après votre accord (Produits / Restaurants → bouton &quot;Valider&quot;).
      </p>

      <form onSubmit={addVendor} className="bg-white rounded-2xl border border-line p-4 mb-6 max-w-md space-y-3">
        <p className="text-sm font-bold">Ajouter un vendeur</p>
        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Nom de la boutique</span>
          <input
            required
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Mot de passe (6 caractères min.)</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
          />
        </label>
        {error && <p className="text-xs text-orange">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-orange press-scale disabled:opacity-50"
        >
          <Plus size={14} /> {busy ? "..." : "Ajouter"}
        </button>
      </form>

      <div className="space-y-2 max-w-md">
        {accounts.length === 0 && <p className="text-xs text-inkSoft">Aucun vendeur pour le moment.</p>}
        {accounts.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl border border-line p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store size={14} className="text-inkSoft" />
              <div>
                <div className="text-sm font-semibold">{a.business_name}</div>
                <div className="text-[11px] text-inkSoft">{a.email}</div>
              </div>
            </div>
            <button onClick={() => removeVendor(a.id)} className="w-8 h-8 rounded-full bg-mist flex items-center justify-center press-scale">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
