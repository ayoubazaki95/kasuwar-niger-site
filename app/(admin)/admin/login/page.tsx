"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import Logo from "@/components/Logo";
import { useAdminAuth } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const ok = await login(email, password);
    setBusy(false);
    if (ok) router.push("/admin");
    else setError("Identifiants incorrects.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mist px-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-3xl p-6 border border-line">
        <div className="flex justify-center mb-1">
          <Logo size={26} />
        </div>
        <p className="text-center text-xs text-inkSoft mb-6">Espace administration</p>

        <label className="text-xs font-semibold text-inkSoft">Email</label>
        <div className="flex items-center gap-2 mt-1 mb-4 px-3 py-2.5 rounded-xl bg-mist">
          <Mail size={15} className="text-inkSoft" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent outline-none text-sm flex-1"
            placeholder="vous@exemple.com"
          />
        </div>

        <label className="text-xs font-semibold text-inkSoft">Mot de passe</label>
        <div className="flex items-center gap-2 mt-1 mb-2 px-3 py-2.5 rounded-xl bg-mist">
          <Lock size={15} className="text-inkSoft" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent outline-none text-sm flex-1"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

        <button disabled={busy} type="submit" className="w-full mt-4 py-3 rounded-2xl text-white text-sm font-bold bg-orange disabled:opacity-60">
          {busy ? "Connexion..." : "Se connecter"}
        </button>

        <p className="text-[10px] text-inkSoft mt-4 text-center leading-relaxed">
          Connexion locale de démonstration — ne protège pas des données réelles.
          Avant mise en production, remplacez ce système par une authentification serveur.
        </p>
      </form>
    </div>
  );
}
