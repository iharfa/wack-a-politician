import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import type { GameMode } from "@/lib/types";

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

// Lazily create the table on first use so no manual SQL setup is needed.
let ready: Promise<unknown> | null = null;
const ensureTable = () =>
  (ready ??= sql!`create table if not exists scores (
    id bigint generated always as identity primary key,
    nickname text not null,
    score int not null,
    mode text not null,
    accuracy real not null,
    best_streak int not null,
    date timestamptz not null default now()
  )`);

export async function GET() {
  if (!sql) return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 503 });
  await ensureTable();
  const rows = await sql`
    select nickname, score, mode, accuracy, best_streak, date
    from scores order by score desc limit 50`;
  return NextResponse.json(
    rows.map((r) => ({
      nickname: r.nickname,
      score: r.score,
      mode: r.mode,
      accuracy: r.accuracy,
      bestStreak: r.best_streak,
      date: r.date,
    }))
  );
}

export async function POST(req: Request) {
  if (!sql) return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 503 });
  const e = await req.json().catch(() => ({}));
  const nickname = String(e.nickname ?? "").trim().slice(0, 20);
  const score = Math.round(Number(e.score));
  const mode: GameMode = ["quick", "classic", "chaos"].includes(e.mode) ? e.mode : "classic";
  const accuracy = Math.min(100, Math.max(0, Number(e.accuracy) || 0));
  const bestStreak = Math.max(0, Math.round(Number(e.bestStreak) || 0));
  if (!nickname || !Number.isFinite(score) || score < 0) {
    return NextResponse.json({ error: "invalid entry" }, { status: 400 });
  }
  await ensureTable();
  await sql`
    insert into scores (nickname, score, mode, accuracy, best_streak, date)
    values (${nickname}, ${score}, ${mode}, ${accuracy}, ${bestStreak}, ${e.date ?? new Date().toISOString()})`;
  return NextResponse.json({ ok: true });
}
