"use client";
import { useState } from "react";
import { addEntry } from "@/lib/leaderboard";
import type { GameState } from "@/lib/types";

interface Props {
  state: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
}

export default function GameOverModal({ state, onPlayAgain, onHome }: Props) {
  const [nick, setNick] = useState("");
  const [saved, setSaved] = useState(false);
  const total = state.hits + state.misses;
  const accuracy = total ? Math.round((state.hits / total) * 100) : 0;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const nickname = nick.trim();
    if (!nickname) return;
    await addEntry({
      nickname: nickname.slice(0, 20),
      score: state.score,
      mode: state.mode,
      accuracy,
      bestStreak: state.bestStreak,
      date: new Date().toISOString(),
    });
    setSaved(true);
  };

  const stats: [string, string | number][] = [
    ["Final score", state.score],
    ["Accuracy", `${accuracy}%`],
    ["Best streak", state.bestStreak],
    ["Hits", state.hits],
    ["Misses", state.misses],
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-indigo-950 p-6 ring-4 ring-indigo-700">
        <h2 className="text-center text-2xl font-black text-amber-400">TIME&apos;S UP! 🔔</h2>
        <div className="my-4 grid grid-cols-2 gap-2 text-center">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-indigo-900/70 p-2 first:col-span-2">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-indigo-300">{label}</div>
              <div className="text-xl font-black tabular-nums">{value}</div>
            </div>
          ))}
        </div>

        {saved ? (
          <p className="mb-3 text-center font-bold text-emerald-400">✓ Saved to leaderboard!</p>
        ) : (
          <form onSubmit={save} className="mb-3 flex gap-2">
            <input
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              placeholder="Your nickname"
              maxLength={20}
              required
              className="min-w-0 flex-1 rounded-xl bg-indigo-900 px-3 py-2 text-white placeholder-indigo-400 ring-2 ring-indigo-700 outline-none focus:ring-amber-400"
            />
            <button
              type="submit"
              disabled={!nick.trim()}
              className="rounded-xl bg-amber-400 px-4 font-bold text-indigo-950 disabled:opacity-40"
            >
              Save
            </button>
          </form>
        )}

        <div className="flex gap-2">
          <button onClick={onPlayAgain} className="flex-1 rounded-xl bg-emerald-600 py-3 font-bold">
            🔁 Play again
          </button>
          <button onClick={onHome} className="flex-1 rounded-xl bg-indigo-800 py-3 font-bold">
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
}
