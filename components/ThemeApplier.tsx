"use client";

import { useEffect } from "react";
import { useSettings } from "@/lib/admin-store";

/**
 * Applique les couleurs choisies dans l'admin (Paramètres) directement au site,
 * via des variables CSS sur <html>. Les boutons et accents clés utilisent
 * `bg-[var(--brand-primary)]` etc. plutôt que des classes Tailwind figées,
 * donc ce composant suffit à les recolorer en direct, sans rebuild.
 */
export default function ThemeApplier() {
  const { settings, hydrated } = useSettings();

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.style.setProperty("--brand-primary", settings.primaryColor);
    root.style.setProperty("--brand-secondary", settings.secondaryColor);
    root.style.setProperty("--brand-accent", settings.accentColor);
    if (settings.siteName) {
      document.title = `${settings.siteName} — ${settings.tagline || "E-commerce Marketplace"}`;
    }
  }, [settings, hydrated]);

  return null;
}
