"use client";
import { useEffect, useState } from "react";
import { MODES } from "@/lib/config";
import { getEntries } from "@/lib/leaderboard";
import type { LeaderboardEntry } from "@/lib/types";

export default function Leaderboard({ onClose }: { onClose: () => void }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    getEntries().then(setEntries);
  }, []);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--color-ink)]/70 p-4">
      <div className="flex max-h-[85vh] w-full max-w-sm flex-col border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-6 shadow-[6px_6px_0_var(--color-ink)]">
        <h2 className="display text-center text-3xl text-[var(--color-accent-2)]">Top 10.</h2>
        <div className="ornament my-2 text-center" aria-hidden>
          ✱ ✱ ✱ ✱
        </div>
        <div className="flex-1 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="halftone flex h-32 items-center justify-center bg-[var(--color-paper-2)]">
              <p className="bg-[var(--color-paper)] px-3 py-1 font-bold text-[var(--color-ink-2)]">
                No scores yet. Go bonk something!
              </p>
            </div>
          ) : (
            <ol className="flex flex-col gap-2">
              {entries.slice(0, 10).map((e, i) => (
                <li key={`${e.date}-${i}`} className="flex items-center gap-2 border-2 border-[var(--color-ink)] bg-[var(--color-paper-2)] px-3 py-2">
                  <span className="display w-7 text-center text-xl text-[var(--color-accent)]">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold">{e.nickname}</span>
                    <span className="block text-[10px] font-bold uppercase text-[var(--color-muted)]">
                      {MODES[e.mode]?.label ?? e.mode} · {e.accuracy}% acc · {e.bestStreak} streak ·{" "}
                      {new Date(e.date).toLocaleDateString()}
                    </span>
                  </span>
                  <span className="display text-xl tabular-nums text-[var(--color-accent-2)]">{e.score}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
        <button onClick={onClose} className="btn mt-4 bg-[var(--color-paper)] py-3">
          Close
        </button>
      </div>
    </div>
  );
}
