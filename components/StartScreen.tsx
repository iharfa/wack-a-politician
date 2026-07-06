"use client";
import { useState } from "react";
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
  promoted: boolean;
  onSetPromoted: (v: boolean) => void;
}

// Jagged cracks radiating from the hammer impact point.
const CRACKS = [
  "50,50 30,35 12,28 2,10",
  "50,50 68,38 82,30 97,18",
  "50,50 35,62 20,75 8,92",
  "50,50 62,65 70,82 78,97",
  "50,50 45,30 47,12 42,2",
  "50,50 70,52 88,58 98,55",
  "50,50 28,52 10,48 2,55",
  "50,50 55,72 50,88 54,98",
  "30,35 24,45 14,48",
  "62,65 72,68 80,64",
];

export default function StartScreen({
  mode,
  setMode,
  onStart,
  onLeaderboard,
  onSettings,
  canInstall,
  onInstall,
  promoted,
  onSetPromoted,
}: Props) {
  const [phase, setPhase] = useState<"idle" | "swing" | "crack" | "gif">("idle");
  const [gifFailed, setGifFailed] = useState(false);

  const tapHammer = () => {
    if (phase !== "idle") return;
    if (promoted) {
      onSetPromoted(false);
      return;
    }
    setPhase("swing");
    setTimeout(() => setPhase("crack"), 700);
    setTimeout(() => setPhase("gif"), 1700);
  };

  const finish = () => {
    onSetPromoted(true);
    setPhase("idle");
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 overflow-y-auto p-6 text-center">
      <button
        onClick={tapHammer}
        aria-label="Hammer"
        className={`text-6xl transition-transform active:scale-90 ${phase === "swing" ? "hammer-swing" : ""}`}
      >
        🔨
      </button>
      {promoted && (
        <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300 ring-1 ring-amber-400/50">
          ⭐ PROMOTED MODE — tap the hammer to step down
        </span>
      )}
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

      {phase === "crack" && (
        <div className="pointer-events-none fixed inset-0 z-50">
          <div className="flash absolute inset-0 bg-white" />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="crack-in h-full w-full">
            {CRACKS.map((pts, i) => (
              <polyline
                key={i}
                points={pts}
                fill="none"
                stroke="white"
                strokeWidth={i < 8 ? 0.8 : 0.4}
                strokeLinecap="round"
                opacity={0.85}
              />
            ))}
          </svg>
        </div>
      )}

      {phase === "gif" && (
        <button onClick={finish} className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-black/90 p-6">
          {gifFailed ? (
            <span className="text-8xl">😱</span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/skin/promoted.gif"
              alt="You have been promoted"
              onError={() => setGifFailed(true)}
              className="w-64 max-w-full rounded-2xl"
            />
          )}
          <span className="text-3xl font-black text-amber-400">YOU HAVE BEEN PROMOTED</span>
          <span className="text-sm text-indigo-300">Real-politician skin unlocked — tap to continue</span>
        </button>
      )}
    </div>
  );
}
