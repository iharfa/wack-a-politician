import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
// Stats are private: set STATS_KEY in the environment to rotate the key.
const STATS_KEY = process.env.STATS_KEY ?? "MuizzuIsDaBest";

let ready: Promise<unknown> | null = null;
const ensureTable = () =>
  (ready ??= sql!`create table if not exists events (
    id bigint generated always as identity primary key,
    device text not null,
    kind text not null,
    mode text,
    duration real,
    detail text,
    date timestamptz not null default now()
  )`);

export async function POST(req: Request) {
  if (!sql) return NextResponse.json({ ok: false }, { status: 503 });
  const e = await req.json().catch(() => ({}));
  const kind = ["play", "usage", "error"].includes(e.kind) ? (e.kind as string) : null;
  const device = String(e.device ?? "").slice(0, 64);
  if (!kind || !device) return NextResponse.json({ ok: false }, { status: 400 });
  const duration = Math.min(36000, Math.max(0, Number(e.duration) || 0));
  const mode = typeof e.mode === "string" ? e.mode.slice(0, 16) : null;
  const detail = typeof e.detail === "string" ? e.detail.slice(0, 500) : null;
  await ensureTable();
  await sql`insert into events (device, kind, mode, duration, detail)
    values (${device}, ${kind}, ${mode}, ${duration}, ${detail})`;
  return NextResponse.json({ ok: true });
}

// Private aggregate view: GET /api/track?key=<STATS_KEY>
export async function GET(req: Request) {
  if (!sql) return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 503 });
  const key = new URL(req.url).searchParams.get("key");
  if (key !== STATS_KEY) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await ensureTable();
  const [agg] = await sql`select
    count(*) filter (where kind = 'play') as total_plays,
    coalesce(sum(duration) filter (where kind = 'play'), 0) as total_play_seconds,
    coalesce(sum(duration) filter (where kind = 'usage'), 0) as total_usage_seconds,
    count(distinct device) as unique_players,
    count(*) filter (where kind = 'error') as total_errors
    from events`;
  const playsByMode = await sql`select mode, count(*) as plays from events where kind = 'play' group by mode`;
  const recentErrors = await sql`select detail, date from events where kind = 'error' order by date desc limit 20`;
  return NextResponse.json({ ...agg, playsByMode, recentErrors });
}
