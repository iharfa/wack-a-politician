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
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--color-ink)]/70 p-4">
      <div className="w-full max-w-sm border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-6 shadow-[6px_6px_0_var(--color-ink)]">
        <h2 className="display text-center text-3xl text-[var(--color-accent)]">Time&apos;s up.</h2>
        <div className="ornament my-2 text-center" aria-hidden>
          ✱ ✱ ✱ ✱
        </div>
        <div className="mb-4 grid grid-cols-2 gap-2 text-center">
          {stats.map(([label, value]) => (
            <div key={label} className="border-2 border-[var(--color-ink)] bg-[var(--color-paper-2)] p-2 first:col-span-2">
              <div className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-muted)]">{label}</div>
              <div className="display text-2xl tabular-nums">{value}</div>
            </div>
          ))}
        </div>

        {saved ? (
          <p className="mb-3 text-center font-bold text-[var(--color-accent-2)]">◆ Saved to the leaderboard.</p>
        ) : (
          <form onSubmit={save} className="mb-3 flex gap-2">
            <input
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              placeholder="Your nickname"
              maxLength={20}
              required
              className="min-w-0 flex-1 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] px-3 py-2 font-bold text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]"
            />
            <button
              type="submit"
              disabled={!nick.trim()}
              className="btn bg-[var(--color-accent)] px-4 text-[var(--color-accent-ink)] disabled:opacity-40"
            >
              Save
            </button>
          </form>
        )}

        <div className="flex gap-2.5">
          <button onClick={onPlayAgain} className="btn flex-1 bg-[var(--color-accent-2)] py-3 text-[var(--color-paper)]">
            Play again
          </button>
          <button onClick={onHome} className="btn flex-1 bg-[var(--color-paper)] py-3">
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
