import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const includeAll = new URL(req.url).searchParams.get("all") === "1";
    let query = supabase.from("menu_items").select("*").order("id");
    if (!includeAll) query = query.eq("approved", true);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ items: data });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = getSupabaseAdmin();
    const { data, error } = await (supabase.from("menu_items") as any).insert(body).select().single();
    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
