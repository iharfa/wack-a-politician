import { multiplier } from "@/lib/config";
import type { GameState } from "@/lib/types";
import PowerupBadge from "./PowerupBadge";

function Stat({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className="rounded-xl bg-indigo-950/60 px-1 py-1.5">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-indigo-300">{label}</div>
      <div className={`text-lg font-black tabular-nums sm:text-xl ${className}`}>{value}</div>
    </div>
  );
}

export default function ScorePanel({ state }: { state: GameState }) {
  const total = state.hits + state.misses;
  const accuracy = total ? Math.round((state.hits / total) * 100) : 100;
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="grid grid-cols-4 gap-2 text-center">
        <Stat
          label="Time"
          value={`${Math.ceil(state.timeLeft)}s`}
          className={state.frozen ? "animate-pulse text-cyan-300" : ""}
        />
        <Stat label="Score" value={String(state.score)} className="text-amber-300" />
        <Stat label="Streak" value={`${state.streak} ×${multiplier(state.streak)}`} />
        <Stat label="Accuracy" value={`${accuracy}%`} />
      </div>
      <div className="mt-1.5 flex min-h-6 flex-wrap justify-center gap-1.5">
        {state.shield && <PowerupBadge type="shield" />}
        {state.powerups.map((p) => (
          <PowerupBadge key={p.type} type={p.type} endsAt={p.endsAt} />
        ))}
      </div>
    </div>
  );
}
