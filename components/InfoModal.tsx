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
    <li className="flex items-start gap-3 rounded-xl bg-indigo-900/70 px-3 py-2 text-left">
      <span className="text-2xl">{emoji}</span>
      <span className="min-w-0">
        <span className="block font-bold">{name}</span>
        <span className="block text-xs text-indigo-300">{tip}</span>
      </span>
    </li>
  );
}

export default function InfoModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
      <div className="flex max-h-[85vh] w-full max-w-sm flex-col rounded-3xl bg-indigo-950 p-6 ring-4 ring-indigo-700">
        <h2 className="mb-3 text-center text-2xl font-black text-amber-400">ℹ️ HOW TO PLAY</h2>
        <div className="flex-1 space-y-4 overflow-y-auto">
          <p className="text-sm text-indigo-200">
            Characters pop out of the 9 holes — tap them (or use <b>QWE / ASD / ZXC</b> or the numpad) before they
            duck back down. Hitting an empty hole is a miss and breaks your streak.
          </p>

          <div>
            <h3 className="mb-1.5 font-black text-indigo-200">WHO POPS UP</h3>
            <ul className="space-y-1.5">
              {CHARACTER_GUIDE.map(({ def, tip }) => (
                <Row key={def.name} emoji={def.emoji} name={def.name} tip={tip} />
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-1.5 font-black text-indigo-200">POWERUPS</h3>
            <p className="mb-1.5 text-xs text-indigo-300">
              Glowing blue orbs appear in holes now and then — tap to grab. Active ones show at the top with a countdown.
            </p>
            <ul className="space-y-1.5">
              {POWERUP_GUIDE.map(({ def, tip }) => (
                <Row key={def.name} emoji={def.emoji} name={def.name} tip={tip} />
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-1.5 font-black text-indigo-200">STREAKS</h3>
            <p className="text-xs text-indigo-300">
              Consecutive hits build a streak that multiplies your points: <b>5 hits → 1.5×</b>,{" "}
              <b>10 → 2×</b>, <b>20 → 3×</b>, <b>30 → 4×</b>. A miss or a decoy resets it — and the game gets faster
              the longer the round goes.
            </p>
          </div>
        </div>
        <button onClick={onClose} className="mt-4 rounded-xl bg-indigo-800 py-3 font-bold">
          Got it!
        </button>
      </div>
    </div>
  );
}
