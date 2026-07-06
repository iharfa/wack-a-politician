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
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
      <div className="flex max-h-[85vh] w-full max-w-sm flex-col rounded-3xl bg-indigo-950 p-6 ring-4 ring-indigo-700">
        <h2 className="mb-4 text-center text-2xl font-black text-amber-400">🏆 TOP 10</h2>
        <div className="flex-1 overflow-y-auto">
          {entries.length === 0 ? (
            <p className="py-8 text-center text-indigo-300">No scores yet. Go bonk something!</p>
          ) : (
            <ol className="flex flex-col gap-2">
              {entries.slice(0, 10).map((e, i) => (
                <li key={`${e.date}-${i}`} className="flex items-center gap-2 rounded-xl bg-indigo-900/70 px-3 py-2">
                  <span className="w-6 text-center font-black text-indigo-300">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold">{e.nickname}</span>
                    <span className="block text-[10px] text-indigo-300">
                      {MODES[e.mode]?.label ?? e.mode} · {e.accuracy}% acc · {e.bestStreak} streak ·{" "}
                      {new Date(e.date).toLocaleDateString()}
                    </span>
                  </span>
                  <span className="font-black tabular-nums text-amber-300">{e.score}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
        <button onClick={onClose} className="mt-4 rounded-xl bg-indigo-800 py-3 font-bold">
          Close
        </button>
      </div>
    </div>
  );
}
