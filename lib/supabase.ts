import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase côté serveur uniquement (utilisé dans app/api/*).
 * Utilise la clé service_role, qui contourne Row Level Security — c'est
 * pourquoi elle ne doit JAMAIS être préfixée NEXT_PUBLIC_ (elle ne le sera
 * jamais côté client, seulement lue ici, dans du code exécuté sur le serveur).
 */
export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Variables SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquantes.");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
