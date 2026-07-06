import { POWERUPS } from "@/lib/config";
import type { PowerupType } from "@/lib/types";

export default function PowerupBadge({ type, endsAt }: { type: PowerupType; endsAt?: number }) {
  // Parent re-renders every game tick, so reading Date.now() here stays fresh.
  const secs = endsAt ? Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)) : null;
  const p = POWERUPS[type];
  return (
    <span className="flex items-center gap-1 rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-bold text-cyan-200 ring-1 ring-cyan-400/50">
      <span>{p.emoji}</span>
      <span>{p.name}</span>
      {secs !== null && <span className="tabular-nums">{secs}s</span>}
    </span>
  );
}
