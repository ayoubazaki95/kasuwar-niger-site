"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useSettings, Settings } from "@/lib/admin-store";

export default function AdminSettingsPage() {
  const { settings, setSettings, hydrated } = useSettings();
  const [draft, setDraft] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (hydrated && !draft) setDraft(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated || !draft) return null;

  const set = (patch: Partial<Settings>) => setDraft({ ...draft, ...patch });

  const save = () => {
    setSaving(true);
    setSettings(draft);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleMaintenance = () => {
    const next = { ...draft, maintenanceMode: !draft.maintenanceMode };
    setDraft(next);
    setSettings(next); // le mode maintenance s'applique immédiatement, sans attendre "Enregistrer"
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-display font-bold">Paramètres</h1>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white bg-orange press-scale disabled:opacity-50"
        >
          {saved ? <><CheckCircle2 size={15} /> Enregistré</> : saving ? "..." : "Enregistrer"}
        </button>
      </div>
      <p className="text-sm text-inkSoft mb-6">Configuration générale et personnalisation de la plateforme.</p>

      <div className="bg-white rounded-2xl border border-line p-4 grid md:grid-cols-2 gap-4 max-w-3xl mb-6">
        <p className="md:col-span-2 text-xs font-bold uppercase tracking-wide text-inkSoft">Identité</p>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Nom du site</span>
          <input value={draft.siteName} onChange={(e) => set({ siteName: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none" />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Slogan / sous-titre</span>
          <input value={draft.tagline} onChange={(e) => set({ tagline: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none" />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Devise</span>
          <input value={draft.currency} onChange={(e) => set({ currency: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none" />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Frais de livraison de base (FCFA)</span>
          <input type="number" value={draft.baseDeliveryFee} onChange={(e) => set({ baseDeliveryFee: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none" />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Commission vendeurs (%)</span>
          <input type="number" value={draft.commissionPercent} onChange={(e) => set({ commissionPercent: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none" />
        </label>

        <p className="md:col-span-2 text-xs font-bold uppercase tracking-wide text-inkSoft mt-2">Promotion en cours (bannière d&apos;accueil)</p>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Étiquette au-dessus du titre</span>
          <input value={draft.heroSubtitle} onChange={(e) => set({ heroSubtitle: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none" />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Texte du bouton</span>
          <input value={draft.promoButtonLabel} onChange={(e) => set({ promoButtonLabel: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none" />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Lien du bouton (ex: /marketplace, /restaurants)</span>
          <input value={draft.promoButtonLink} onChange={(e) => set({ promoButtonLink: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none" />
        </label>

        <label className="block md:col-span-2">
          <span className="text-xs font-semibold text-inkSoft">Titre de la bannière</span>
          <input value={draft.heroTitle} onChange={(e) => set({ heroTitle: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none" />
        </label>

        <p className="md:col-span-2 text-xs font-bold uppercase tracking-wide text-inkSoft mt-2">Couleurs</p>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Couleur principale</span>
          <div className="flex items-center gap-2 mt-1">
            <input type="color" value={draft.primaryColor} onChange={(e) => set({ primaryColor: e.target.value })} className="w-10 h-9 rounded-lg border border-line" />
            <span className="text-xs font-mono text-inkSoft">{draft.primaryColor}</span>
          </div>
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Couleur secondaire</span>
          <div className="flex items-center gap-2 mt-1">
            <input type="color" value={draft.secondaryColor} onChange={(e) => set({ secondaryColor: e.target.value })} className="w-10 h-9 rounded-lg border border-line" />
            <span className="text-xs font-mono text-inkSoft">{draft.secondaryColor}</span>
          </div>
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Couleur d&apos;accent</span>
          <div className="flex items-center gap-2 mt-1">
            <input type="color" value={draft.accentColor} onChange={(e) => set({ accentColor: e.target.value })} className="w-10 h-9 rounded-lg border border-line" />
            <span className="text-xs font-mono text-inkSoft">{draft.accentColor}</span>
          </div>
        </label>

        <p className="md:col-span-2 text-xs font-bold uppercase tracking-wide text-inkSoft mt-2">Contact & commandes</p>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Téléphone de contact</span>
          <input value={draft.contactPhone} onChange={(e) => set({ contactPhone: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none" />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Email de contact</span>
          <input value={draft.contactEmail} onChange={(e) => set({ contactEmail: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none" />
        </label>

        <label className="block md:col-span-2">
          <span className="text-xs font-semibold text-inkSoft">Numéro WhatsApp pour recevoir les commandes</span>
          <input
            value={draft.whatsappNumber}
            onChange={(e) => set({ whatsappNumber: e.target.value })}
            placeholder="+227 90 00 00 00"
            className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
          />
          <span className="text-[11px] text-inkSoft mt-1 block">Format international avec le +. C&apos;est sur ce numéro que chaque commande validée par un client sera envoyée via WhatsApp.</span>
        </label>

        <div className="md:col-span-2 flex items-center justify-between p-3 rounded-xl bg-mist mt-2">
          <div>
            <div className="text-sm font-semibold">Mode maintenance</div>
            <div className="text-[11px] text-inkSoft">Affiche une page d&apos;indisponibilité aux visiteurs du site public. S&apos;applique immédiatement (pas besoin d&apos;Enregistrer).</div>
          </div>
          <button
            onClick={toggleMaintenance}
            className={`w-12 h-7 rounded-full relative transition-colors shrink-0 ${draft.maintenanceMode ? "bg-orange" : "bg-line"}`}
          >
            <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${draft.maintenanceMode ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-orange press-scale disabled:opacity-50 mb-4"
      >
        {saved ? <><CheckCircle2 size={15} /> Enregistré</> : saving ? "..." : "Enregistrer les modifications"}
      </button>

      <p className="text-[11px] text-inkSoft max-w-2xl leading-relaxed">
        Les couleurs, le texte de la bannière et le nom du site s&apos;appliquent immédiatement sur le site public après
        enregistrement. Comme pour le reste de l&apos;admin, ces réglages sont stockés dans la base de données partagée
        (Supabase) — visibles par tous vos visiteurs.
      </p>
    </div>
  );
}
