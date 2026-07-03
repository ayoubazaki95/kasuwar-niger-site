"use client";

import { useSettings } from "@/lib/admin-store";

export default function AdminSettingsPage() {
  const { settings, setSettings, hydrated } = useSettings();

  if (!hydrated) return null;

  return (
    <div>
      <h1 className="text-xl font-display font-bold mb-1">Paramètres</h1>
      <p className="text-sm text-inkSoft mb-6">Configuration générale et personnalisation de la plateforme.</p>

      <div className="bg-white rounded-2xl border border-line p-4 grid md:grid-cols-2 gap-4 max-w-3xl mb-6">
        <p className="md:col-span-2 text-xs font-bold uppercase tracking-wide text-inkSoft">Identité</p>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Nom du site</span>
          <input
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Slogan / sous-titre</span>
          <input
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Devise</span>
          <input
            value={settings.currency}
            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Frais de livraison de base (FCFA)</span>
          <input
            type="number"
            value={settings.baseDeliveryFee}
            onChange={(e) => setSettings({ ...settings, baseDeliveryFee: Number(e.target.value) })}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Commission vendeurs (%)</span>
          <input
            type="number"
            value={settings.commissionPercent}
            onChange={(e) => setSettings({ ...settings, commissionPercent: Number(e.target.value) })}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
          />
        </label>

        <p className="md:col-span-2 text-xs font-bold uppercase tracking-wide text-inkSoft mt-2">Bannière d&apos;accueil</p>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Étiquette au-dessus du titre</span>
          <input
            value={settings.heroSubtitle}
            onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Texte du bouton</span>
          <input
            value={settings.promoButtonLabel}
            onChange={(e) => setSettings({ ...settings, promoButtonLabel: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-xs font-semibold text-inkSoft">Titre de la bannière</span>
          <input
            value={settings.heroTitle}
            onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
          />
        </label>

        <p className="md:col-span-2 text-xs font-bold uppercase tracking-wide text-inkSoft mt-2">Couleurs</p>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Couleur principale</span>
          <div className="flex items-center gap-2 mt-1">
            <input type="color" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="w-10 h-9 rounded-lg border border-line" />
            <span className="text-xs font-mono text-inkSoft">{settings.primaryColor}</span>
          </div>
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Couleur secondaire</span>
          <div className="flex items-center gap-2 mt-1">
            <input type="color" value={settings.secondaryColor} onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })} className="w-10 h-9 rounded-lg border border-line" />
            <span className="text-xs font-mono text-inkSoft">{settings.secondaryColor}</span>
          </div>
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Couleur d&apos;accent</span>
          <div className="flex items-center gap-2 mt-1">
            <input type="color" value={settings.accentColor} onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })} className="w-10 h-9 rounded-lg border border-line" />
            <span className="text-xs font-mono text-inkSoft">{settings.accentColor}</span>
          </div>
        </label>

        <p className="md:col-span-2 text-xs font-bold uppercase tracking-wide text-inkSoft mt-2">Contact & commandes</p>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Téléphone de contact</span>
          <input
            value={settings.contactPhone}
            onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Email de contact</span>
          <input
            value={settings.contactEmail}
            onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-xs font-semibold text-inkSoft">Numéro WhatsApp pour recevoir les commandes</span>
          <input
            value={settings.whatsappNumber}
            onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
            placeholder="+227 90 00 00 00"
            className="w-full mt-1 px-3 py-2 rounded-xl bg-mist text-sm outline-none"
          />
          <span className="text-[11px] text-inkSoft mt-1 block">Format international avec le +. C&apos;est sur ce numéro que chaque commande validée par un client sera envoyée via WhatsApp.</span>
        </label>

        <div className="md:col-span-2 flex items-center justify-between p-3 rounded-xl bg-mist mt-2">
          <div>
            <div className="text-sm font-semibold">Mode maintenance</div>
            <div className="text-[11px] text-inkSoft">Affiche une page d&apos;indisponibilité aux visiteurs du site public.</div>
          </div>
          <button
            onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
            className={`w-12 h-7 rounded-full relative transition-colors ${settings.maintenanceMode ? "bg-orange" : "bg-line"}`}
          >
            <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${settings.maintenanceMode ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </div>

      <p className="text-[11px] text-inkSoft max-w-2xl leading-relaxed">
        Les couleurs, le texte de la bannière et le nom du site s&apos;appliquent immédiatement sur le site public, dans ce même
        navigateur. Le mode maintenance fonctionne aussi : activez-le et rechargez le site public pour le tester. Comme pour le
        reste de l&apos;admin, ces réglages restent stockés localement — voir le README pour la limite actuelle.
      </p>
    </div>
  );
}
