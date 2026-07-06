"use client";
import { CHARACTERS, POWERUPS } from "@/lib/config";

const CHARACTER_GUIDE = [
  { def: CHARACTERS.regular, tip: "Your bread-and-butter target. Whack for 10 points." },
  { def: CHARACTERS.fast, tip: "Pops up and vanishes fast. Worth 25 points if you catch them." },
  { def: CHARACTERS.tank, tip: "Needs 15–25 rapid taps (watch the health bar). 2 points per tap plus a 100–250 point KO bonus." },
  { def: CHARACTERS.decoy, tip: "DON'T hit them! Costs 25 points and breaks your streak (unless a shield saves you)." },
  { def: CHARACTERS.bonus, tip: "Rare jackpot — 200 points. Never let them get away." },
];

const POWERUP_GUIDE = [
  { def: POWERUPS.freeze, tip: "Stops the round clock for 5 seconds — characters keep coming." },
  { def: POWERUPS.double, tip: "Everything is worth 2× points for 8 seconds." },
  { def: POWERUPS.slow, tip: "Characters stay up longer for 8 seconds." },
  { def: POWERUPS.shield, tip: "Your next miss won't break your streak." },
  { def: POWERUPS.sweep, tip: "Instantly clears every character on the board and scores each one." },
];

function Row({ emoji, name, tip }: { emoji: string; name: string; tip: string }) {
  return (
    <li className="flex items-start gap-3 border-2 border-[var(--color-ink)] bg-[var(--color-paper-2)] px-3 py-2 text-left">
      <span className="text-2xl">{emoji}</span>
      <span className="min-w-0">
        <span className="block font-bold">{name}</span>
        <span className="block text-xs text-[var(--color-ink-2)]">{tip}</span>
      </span>
    </li>
  );
}

export default function InfoModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--color-ink)]/70 p-4">
      <div className="flex max-h-[85vh] w-full max-w-sm flex-col border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-6 shadow-[6px_6px_0_var(--color-ink)]">
        <h2 className="display text-center text-3xl text-[var(--color-accent)]">How to play.</h2>
        <div className="ornament my-2 text-center" aria-hidden>
          ✱ ✱ ✱ ✱
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto">
          <p className="text-sm font-medium text-[var(--color-ink-2)]">
            Characters pop out of the 9 holes — tap them (or use <b>QWE / ASD / ZXC</b> or the numpad) before they
            duck back down. Hitting an empty hole is a miss and breaks your streak.
          </p>

          <div>
            <h3 className="display mb-1.5 text-base text-[var(--color-accent-2)]">◆ Who pops up</h3>
            <ul className="space-y-1.5">
              {CHARACTER_GUIDE.map(({ def, tip }) => (
                <Row key={def.name} emoji={def.emoji} name={def.name} tip={tip} />
              ))}
            </ul>
          </div>

          <div>
            <h3 className="display mb-1.5 text-base text-[var(--color-accent-2)]">◆ Powerups</h3>
            <p className="mb-1.5 text-xs text-[var(--color-ink-2)]">
              Navy orbs appear in holes now and then — tap to grab. Active ones show at the top with a countdown.
            </p>
            <ul className="space-y-1.5">
              {POWERUP_GUIDE.map(({ def, tip }) => (
                <Row key={def.name} emoji={def.emoji} name={def.name} tip={tip} />
              ))}
            </ul>
          </div>

          <div>
            <h3 className="display mb-1.5 text-base text-[var(--color-accent-2)]">◆ Streaks</h3>
            <p className="text-xs text-[var(--color-ink-2)]">
              Consecutive hits build a streak that multiplies your points: <b>5 hits → 1.5×</b>,{" "}
              <b>10 → 2×</b>, <b>20 → 3×</b>, <b>30 → 4×</b>. A miss or a decoy resets it — and the game gets faster
              the longer the round goes.
            </p>
          </div>
        </div>
        <button onClick={onClose} className="btn mt-4 bg-[var(--color-accent-2)] py-3 text-[var(--color-paper)]">
          Got it
        </button>
      </div>
    </div>
  );
}
