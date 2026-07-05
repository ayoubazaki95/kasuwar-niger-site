import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase côté serveur (routes API uniquement) — utilise la clé service_role,
 * qui a tous les droits. Ne JAMAIS importer ce fichier dans un composant "use client".
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Variables Supabase manquantes (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
