import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ ok: false });

    const password_hash = createHash("sha256").update(password).digest("hex");
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("admin_accounts")
      .select("id")
      .eq("email", String(email).toLowerCase().trim())
      .eq("password_hash", password_hash)
      .maybeSingle();

    return NextResponse.json({ ok: !!data });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
