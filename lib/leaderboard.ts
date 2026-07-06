import type { LeaderboardEntry } from "./types";

const KEY = "wap-leaderboard";

// localStorage-backed leaderboard service. Signatures are async so a remote
// backend can drop in without touching the UI.
//
// To swap in Supabase later:
//   1. `npm i @supabase/supabase-js` and create a client from
//      NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.
//   2. Create table `scores` (nickname text, score int4, mode text,
//      accuracy float4, best_streak int4, date timestamptz).
//   3. getEntries -> supabase.from('scores').select('*').order('score', { ascending: false }).limit(50)
//   4. addEntry   -> supabase.from('scores').insert(entry)
//   5. clearEntries stays local-only (or becomes an admin action).

export async function getEntries(): Promise<LeaderboardEntry[]> {
  try {
    const raw = localStorage.getItem(KEY);
    const all: LeaderboardEntry[] = raw ? JSON.parse(raw) : [];
    return all.sort((a, b) => b.score - a.score);
  } catch {
    return [];
  }
}

export async function addEntry(entry: LeaderboardEntry): Promise<void> {
  const all = [...(await getEntries()), entry].sort((a, b) => b.score - a.score).slice(0, 50);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export async function clearEntries(): Promise<void> {
  localStorage.removeItem(KEY);
}
