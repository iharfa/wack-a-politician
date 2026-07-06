"use client";
import { CHARACTERS, MODES } from "@/lib/config";
import type { GameMode } from "@/lib/types";

interface Props {
  mode: GameMode;
  setMode: (m: GameMode) => void;
  onStart: () => void;
  onLeaderboard: () => void;
  onSettings: () => void;
  canInstall: boolean;
  onInstall: () => void;
}

export default function StartScreen({ mode, setMode, onStart, onLeaderboard, onSettings, canInstall, onInstall }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 overflow-y-auto p-6 text-center">
      <div className="text-6xl">🔨</div>
      <h1 className="text-4xl font-black leading-tight sm:text-5xl">
        WHACK-A-
        <br />
        <span className="text-amber-400">POLITICIAN</span>
      </h1>
      <p className="max-w-sm text-sm text-indigo-200">
        Bonk the spin before it spins you. 100% satire, foam mallets only.
      </p>

      <div className="flex w-full max-w-sm flex-col gap-2">
        {(Object.keys(MODES) as GameMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left ring-2 transition-colors ${
              mode === m ? "bg-indigo-600 ring-amber-400" : "bg-indigo-900/60 ring-indigo-700 hover:bg-indigo-800"
            }`}
          >
            <span className="font-bold">{MODES[m].label}</span>
            <span className="text-xs text-indigo-200">{MODES[m].tagline}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onStart}
        className="w-full max-w-sm rounded-2xl bg-amber-400 py-4 text-xl font-black text-indigo-950 shadow-lg transition-transform active:scale-95"
      >
        START ▶
      </button>

      <div className="flex w-full max-w-sm gap-2">
        <button onClick={onLeaderboard} className="flex-1 rounded-2xl bg-indigo-800 py-3 font-bold">
          🏆 Leaderboard
        </button>
        <button onClick={onSettings} className="flex-1 rounded-2xl bg-indigo-800 py-3 font-bold">
          ⚙️ Settings
        </button>
      </div>

      {canInstall && (
        <button onClick={onInstall} className="w-full max-w-sm rounded-2xl bg-emerald-600 py-3 font-bold">
          📲 Install App
        </button>
      )}

      <div className="max-w-sm text-xs text-indigo-300">
        <p className="mb-1">
          ⌨️ Keys: <b>Q W E</b> / <b>A S D</b> / <b>Z X C</b> — or the numpad. 📱 On mobile, just tap.
        </p>
        <p>
          Watch out: {CHARACTERS.decoy.emoji} {CHARACTERS.decoy.name} is a decoy — hitting them costs points!
        </p>
      </div>
    </div>
  );
}
