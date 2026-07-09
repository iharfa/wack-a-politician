import type { GameMode, LeaderboardEntry } from "./types";

export type Period = "day" | "all";

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

const KEY = "wap-leaderboard";

// Shared leaderboard backed by Neon Postgres via /api/scores when DATABASE_URL
// is configured (see README). Falls back to this device's localStorage when the
// API is unconfigured or unreachable (e.g. offline), so the game always works.

function localGet(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    const all: LeaderboardEntry[] = raw ? JSON.parse(raw) : [];
    return all.sort((a, b) => b.score - a.score);
  } catch {
    return [];
  }
}

function localAdd(entry: LeaderboardEntry) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...localGet(), entry].sort((a, b) => b.score - a.score).slice(0, 200)));
  } catch {}
}

export async function getEntries(mode?: GameMode, period: Period = "all"): Promise<LeaderboardEntry[]> {
  const since = period === "day" ? startOfToday() : null;
  const qs = new URLSearchParams();
  if (mode) qs.set("mode", mode);
  if (since) qs.set("since", since);
  try {
    const res = await fetch(`/api/scores${qs.size ? `?${qs}` : ""}`);
    if (res.ok) return await res.json();
  } catch {}
  return localGet().filter((e) => (!mode || e.mode === mode) && (!since || e.date >= since));
}

export async function addEntry(entry: LeaderboardEntry): Promise<void> {
  localAdd(entry); // keep a device-local copy too — works offline
  try {
    await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
  } catch {}
}

// Clears only this device's scores; the shared board is append-only from clients.
export async function clearEntries(): Promise<void> {
  localStorage.removeItem(KEY);
}
