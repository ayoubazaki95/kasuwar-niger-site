import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("vendor_accounts").select("id, email, business_name, created_at").order("id");
    if (error) throw error;
    return NextResponse.json({ items: data });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, password, businessName } = await req.json();
    if (!email || !password || password.length < 6 || !businessName) {
      return NextResponse.json({ error: "Email, nom de boutique et mot de passe (6 caractères min.) requis." }, { status: 400 });
    }
    const password_hash = createHash("sha256").update(password).digest("hex");
    const supabase = getSupabaseAdmin();
    const { data, error } = await (supabase.from("vendor_accounts") as any)
      .insert({ email: email.toLowerCase().trim(), password_hash, business_name: businessName.trim() })
      .select("id, email, business_name, created_at")
      .single();
    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
