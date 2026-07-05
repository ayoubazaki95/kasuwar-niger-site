"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store } from "lucide-react";
import { useVendorAuth } from "@/lib/vendor-auth";

export default function VendorLoginPage() {
  const router = useRouter();
  const { login } = useVendorAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const ok = await login(email, password);
    setBusy(false);
    if (ok) router.push("/vendeur");
    else setError("Email ou mot de passe incorrect.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-line p-6">
        <div className="flex flex-col items-center mb-5">
          <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center mb-2">
            <Store size={22} className="text-orange" />
          </div>
          <p className="text-lg font-display font-bold">Espace vendeur</p>
          <p className="text-xs text-inkSoft mt-1">Kasuwar Niger</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <span className="text-xs font-semibold text-inkSoft">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-mist text-sm outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-inkSoft">Mot de passe</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-xl bg-mist text-sm outline-none"
            />
          </label>
          {error && <p className="text-xs text-orange">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-2xl text-white text-sm font-bold bg-orange press-scale disabled:opacity-50"
          >
            {busy ? "..." : "Se connecter"}
          </button>
        </form>
        <p className="text-[11px] text-inkSoft text-center mt-4">
          Pas encore de compte ? Contactez l&apos;administrateur du site.
        </p>
      </div>
    </div>
  );
}
