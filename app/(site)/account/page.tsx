"use client";

import { useEffect, useState } from "react";
import { ChevronRight, LogOut, User as UserIcon } from "lucide-react";
import { useCustomerAuth } from "@/lib/customer-auth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Price } from "@/components/UI";

type OrderRow = {
  id: number;
  created_at: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: string;
};

function AuthForm() {
  const { signUp, signIn } = useCustomerAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const result = mode === "signup" ? await signUp(email, password, fullName) : await signIn(email, password);
    setBusy(false);
    if (result) setError(result);
    else if (mode === "signup") setConfirmSent(true);
  };

  if (confirmSent) {
    return (
      <div className="px-5 md:px-0 pt-10 text-center">
        <p className="text-sm font-semibold">Compte créé !</p>
        <p className="text-xs text-inkSoft mt-2 max-w-xs mx-auto">
          Si la confirmation par email est activée sur le projet, vérifiez votre boîte mail. Sinon, vous pouvez vous connecter directement.
        </p>
        <button onClick={() => { setConfirmSent(false); setMode("login"); }} className="mt-4 text-xs font-semibold" style={{ color: "var(--brand-primary)" }}>
          Aller à la connexion
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 md:px-0 pt-6 md:max-w-sm">
      <p className="text-lg font-display font-bold mb-1">{mode === "login" ? "Connexion" : "Créer un compte"}</p>
      <p className="text-xs text-inkSoft mb-5">
        {mode === "login" ? "Accédez à votre historique de commandes." : "Suivez vos commandes et gagnez du temps la prochaine fois."}
      </p>
      <form onSubmit={submit} className="space-y-3">
        {mode === "signup" && (
          <label className="block">
            <span className="text-xs font-semibold text-inkSoft">Nom complet</span>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full mt-1 px-3 py-2.5 rounded-xl bg-mist text-sm outline-none" />
          </label>
        )}
        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full mt-1 px-3 py-2.5 rounded-xl bg-mist text-sm outline-none" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Mot de passe</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full mt-1 px-3 py-2.5 rounded-xl bg-mist text-sm outline-none" />
        </label>
        {error && <p className="text-xs text-orange">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 rounded-2xl text-white text-sm font-bold press-scale disabled:opacity-50"
          style={{ background: "var(--brand-primary)" }}
        >
          {busy ? "..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="text-xs font-semibold mt-4 text-inkSoft"
      >
        {mode === "login" ? "Pas encore de compte ? Inscrivez-vous" : "Déjà un compte ? Connectez-vous"}
      </button>
    </div>
  );
}

function LoggedInView() {
  const { user, profile, signOut, updateProfile } = useCustomerAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    const supabase = getSupabaseBrowser();
    supabase
      .from("orders")
      .select("id, created_at, items, total, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as OrderRow[]) || []));
  }, [user]);

  useEffect(() => {
    setPhone(profile?.phone || "");
    setAddress(profile?.address || "");
  }, [profile]);

  const saveProfile = async () => {
    await updateProfile({ phone, address });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-5 md:px-0 pt-4 pb-6 md:max-w-lg">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold font-display" style={{ background: "var(--brand-primary)" }}>
          <UserIcon size={22} />
        </div>
        <div>
          <div className="text-sm font-bold">{profile?.full_name || user?.email}</div>
          <div className="text-[11px] text-inkSoft">{user?.email}</div>
        </div>
      </div>

      <p className="text-xs font-semibold text-inkSoft mt-6 mb-2">MES INFORMATIONS</p>
      <div className="space-y-2">
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone" className="w-full px-3 py-2.5 rounded-xl bg-mist text-sm outline-none" />
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Adresse habituelle" className="w-full px-3 py-2.5 rounded-xl bg-mist text-sm outline-none" />
        <button onClick={saveProfile} className="text-xs font-semibold" style={{ color: "var(--brand-primary)" }}>
          {saved ? "✓ Enregistré" : "Enregistrer"}
        </button>
      </div>

      <p className="text-xs font-semibold text-inkSoft mt-6 mb-2">MES COMMANDES</p>
      {orders.length === 0 && <p className="text-xs text-inkSoft">Aucune commande pour le moment.</p>}
      <div className="space-y-2">
        {orders.map((o) => (
          <div key={o.id} className="p-3 rounded-2xl border border-line">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold">{new Date(o.created_at).toLocaleDateString("fr-FR")}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-mist">{o.status}</span>
            </div>
            <div className="text-xs text-inkSoft mt-1">
              {(o.items || []).map((it, i) => `${it.qty}x ${it.name}`).join(", ")}
            </div>
            <div className="mt-1"><Price amount={o.total} /></div>
          </div>
        ))}
      </div>

      <button onClick={signOut} className="flex items-center gap-1.5 text-xs font-semibold text-inkSoft mt-6">
        <LogOut size={14} /> Se déconnecter
      </button>
    </div>
  );
}

export default function AccountPage() {
  const { user, loading } = useCustomerAuth();

  if (loading) return null;
  return user ? <LoggedInView /> : <AuthForm />;
}
