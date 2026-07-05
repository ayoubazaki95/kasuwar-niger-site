"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ShieldCheck } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";

type AdminAccount = { id: number; email: string; created_at: string };

export default function AdminAccountsPage() {
  const { isPrimaryAdmin, adminEmail } = useAdminAuth();
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => {
    fetch("/api/admin-accounts")
      .then((res) => res.json())
      .then((data) => setAccounts(data.items || []))
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  if (!isPrimaryAdmin) {
    return (
      <div>
        <h1 className="text-xl font-display font-bold mb-2">Administrateurs</h1>
        <p className="text-sm text-inkSoft">
          Seul le compte administrateur principal peut gérer les autres administrateurs.
        </p>
      </div>
    );
  }

  const addAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'ajout.");
      } else {
        setEmail("");
        setPassword("");
        load();
      }
    } catch {
      setError("Erreur réseau. Vérifiez la connexion à la base de données.");
    } finally {
      setBusy(false);
    }
  };

  const removeAdmin = async (id: number) => {
    await fetch(`/api/admin-accounts/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <h1 className="text-xl font-display font-bold mb-1">Administrateurs</h1>
      <p className="text-sm text-inkSoft mb-6">
        Ajoutez des personnes qui pourront se connecter à ce tableau de bord avec leur propre email et mot de passe.
      </p>

      <div className="bg-white rounded-2xl border border-line p-4 mb-6 max-w-md flex items-center gap-3">
        <ShieldCheck size={18} className="text-green shrink-0" />
        <p className="text-xs text-inkSoft">
          Compte principal connecté : <span className="font-semibold text-ink">{adminEmail}</span>
        </p>
      </div>

      <form onSubmit={addAdmin} className="bg-white rounded-2xl border border-line p-4 mb-6 max-w-md space-y-3">
        <p className="text-sm font-bold">Ajouter un administrateur</p>
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
        {accounts.length === 0 && <p className="text-xs text-inkSoft">Aucun administrateur supplémentaire pour le moment.</p>}
        {accounts.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl border border-line p-3 flex items-center justify-between">
            <span className="text-sm">{a.email}</span>
            <button onClick={() => removeAdmin(a.id)} className="w-8 h-8 rounded-full bg-mist flex items-center justify-center press-scale">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
