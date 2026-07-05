import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/**
 * Génère les handlers GET (liste) et POST (création) pour une table donnée.
 * `columns` mappe les noms de champs JS (camelCase) vers les colonnes SQL (snake_case).
 * `jsonFields` liste les champs à stocker en JSON (ex: images).
 */
export function makeListCreateHandlers(table: string, columns: Record<string, string>, jsonFields: string[] = []) {
  async function GET() {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.from(table).select("*").order("id", { ascending: true });
      if (error) throw error;
      const items = (data || []).map((row) => toCamel(row, columns));
      return NextResponse.json({ items });
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
  }

  async function POST(req: Request) {
    try {
      const body = await req.json();
      const supabase = getSupabase();
      const row = toSnake(body, columns, jsonFields);
      const { data, error } = await supabase.from(table).insert(row).select("id").single();
      if (error) throw error;
      return NextResponse.json({ id: data.id });
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
  }

  return { GET, POST };
}

export function makeItemHandlers(table: string, columns: Record<string, string>, jsonFields: string[] = []) {
  async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const body = await req.json();
      const supabase = getSupabase();
      const row = toSnake(body, columns, jsonFields);
      const { error } = await supabase.from(table).update(row).eq("id", params.id);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
  }

  async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from(table).delete().eq("id", params.id);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
  }

  return { PUT, DELETE };
}

function toSnake(body: Record<string, unknown>, columns: Record<string, string>, jsonFields: string[]) {
  const row: Record<string, unknown> = {};
  for (const [camel, snake] of Object.entries(columns)) {
    if (camel in body) {
      row[snake] = jsonFields.includes(camel) ? (body[camel] ?? []) : body[camel];
    }
  }
  return row;
}

function toCamel(row: Record<string, unknown>, columns: Record<string, string>) {
  const out: Record<string, unknown> = { id: row.id };
  for (const [camel, snake] of Object.entries(columns)) {
    out[camel] = row[snake];
  }
  return out;
}
