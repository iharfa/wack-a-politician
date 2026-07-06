import { POWERUPS } from "@/lib/config";
import type { PowerupType } from "@/lib/types";

export default function PowerupBadge({ type, endsAt }: { type: PowerupType; endsAt?: number }) {
  // Parent re-renders every game tick, so reading Date.now() here stays fresh.
  const secs = endsAt ? Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)) : null;
  const p = POWERUPS[type];
  return (
    <span className="flex items-center gap-1 border-2 border-[var(--color-ink)] bg-[var(--color-accent-2)] px-2 py-0.5 text-xs font-bold uppercase text-[var(--color-paper)] shadow-[2px_2px_0_var(--color-ink)]">
      <span>{p.emoji}</span>
      <span>{p.name}</span>
      {secs !== null && <span className="tabular-nums">{secs}s</span>}
    </span>
  );
}
