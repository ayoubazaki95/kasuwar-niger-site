"use client";

import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase côté navigateur — clé publique "anon" uniquement (protégée par les
 * règles de sécurité (RLS) définies dans Supabase, pas par le secret). Utilisé pour
 * l'inscription/connexion des clients.
 */
let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowser() {
  if (!browserClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    browserClient = createClient(url, key);
  }
  return browserClient;
}
