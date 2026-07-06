"use client";
import { useState } from "react";
import { CHARACTERS, MODES } from "@/lib/config";
import type { GameMode } from "@/lib/types";
import InfoModal from "./InfoModal";

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

const BANNER = "100% satire ◆ foam mallets only ◆ bonk the spin ◆ no politicians were harmed ◆ ";

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
  const [showInfo, setShowInfo] = useState(false);

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
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="marquee shrink-0" aria-hidden>
        <div className="marquee-track">
          <span>{BANNER}</span>
          <span>{BANNER}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <button
          onClick={tapHammer}
          aria-label="Hammer"
          className={`text-6xl transition-transform active:scale-90 ${phase === "swing" ? "hammer-swing" : ""}`}
        >
          🔨
        </button>
        {promoted && (
          <span className="border-2 border-[var(--color-ink)] bg-[var(--color-accent-2)] px-3 py-1 text-xs font-bold uppercase text-[var(--color-paper)] shadow-[2px_2px_0_var(--color-ink)]">
            ◆ Promoted mode — tap the hammer to step down
          </span>
        )}
        <h1 className="wordmark">
          Whack-a-
          <br />
          <span className="text-[var(--color-accent)]">Politician</span>
        </h1>
        <p className="max-w-sm text-sm font-bold text-[var(--color-ink-2)]">Bonk the spin before it spins you.</p>
        <div className="ornament" aria-hidden>
          ✱ ✱ ✱ ✱
        </div>

        <div className="flex w-full max-w-sm flex-col gap-2.5">
          {(Object.keys(MODES) as GameMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`btn flex items-center justify-between px-4 py-3 text-left ${
                mode === m
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                  : "bg-[var(--color-paper)] text-[var(--color-ink)]"
              }`}
            >
              <span className="text-lg">{MODES[m].label}</span>
              <span className={`font-[var(--font-body)] text-xs normal-case tracking-normal ${mode === m ? "" : "text-[var(--color-muted)]"}`}>
                {MODES[m].tagline}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onStart}
          className="btn w-full max-w-sm bg-[var(--color-accent-2)] py-4 text-2xl text-[var(--color-paper)]"
        >
          Start ▶
        </button>

        <div className="flex w-full max-w-sm gap-2.5">
          <button onClick={onLeaderboard} className="btn flex-1 bg-[var(--color-paper)] py-3 text-xs">
            ◆ Scores
          </button>
          <button onClick={() => setShowInfo(true)} className="btn flex-1 bg-[var(--color-paper)] py-3 text-xs">
            ◆ How to play
          </button>
          <button onClick={onSettings} className="btn flex-1 bg-[var(--color-paper)] py-3 text-xs">
            ◆ Settings
          </button>
        </div>

        {canInstall && (
          <button onClick={onInstall} className="btn w-full max-w-sm bg-[var(--color-paper)] py-3 text-sm">
            ◆ Install the app
          </button>
        )}

        <div className="max-w-sm text-xs text-[var(--color-muted)]">
          <p className="mb-1">
            Keys: <b>Q W E</b> / <b>A S D</b> / <b>Z X C</b> — or the numpad. On mobile, just tap.
          </p>
          <p>
            ❋ Watch out: {CHARACTERS.decoy.emoji} {CHARACTERS.decoy.name} is a decoy — hitting them costs points!
          </p>
        </div>
      </div>

      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}

      {phase === "crack" && (
        <div className="pointer-events-none fixed inset-0 z-50">
          <div className="flash absolute inset-0 bg-white" />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="crack-in h-full w-full">
            {CRACKS.map((pts, i) => (
              <polyline
                key={i}
                points={pts}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={i < 8 ? 0.8 : 0.4}
                strokeLinecap="round"
                opacity={0.85}
              />
            ))}
          </svg>
        </div>
      )}

      {phase === "gif" && (
        <button
          onClick={finish}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-[var(--color-ink)]/95 p-6"
        >
          {gifFailed ? (
            <span className="text-8xl">😱</span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/skin/promoted.gif"
              alt="You have been promoted"
              onError={() => setGifFailed(true)}
              className="w-64 max-w-full border-2 border-[var(--color-paper)] shadow-[6px_6px_0_var(--color-accent)]"
            />
          )}
          <span className="display text-3xl text-[var(--color-paper)]">
            You have been <span className="text-[var(--color-accent)]">promoted</span>
          </span>
          <span className="text-sm font-bold text-[var(--color-paper-3)]">Real-politician skin unlocked — tap to continue</span>
        </button>
      )}
    </div>
  );
}
