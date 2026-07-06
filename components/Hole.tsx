"use client";
import { POWERUPS } from "@/lib/config";
import type { Entity, PowerupType } from "@/lib/types";
import type { FxEvent } from "@/lib/useGame";
import Character from "./Character";

const TONE_COLOR = { good: "text-amber-300", bad: "text-rose-400", power: "text-cyan-300" };

interface Props {
  index: number;
  hint: string;
  showHint: boolean;
  entity?: Entity;
  fx: (FxEvent & { id: number })[];
  onWhack: (hole: number) => void;
}

export default function Hole({ index, hint, showHint, entity, fx, onWhack }: Props) {
  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        onWhack(index);
      }}
      className="relative aspect-square touch-none select-none overflow-hidden rounded-2xl bg-indigo-900/70 shadow-inner transition-transform active:scale-95"
      aria-label={`Hole ${index + 1}`}
    >
      <div className="absolute inset-x-2 bottom-1 h-1/3 rounded-[50%] bg-black/60" />
      {entity &&
        (entity.kind === "character" ? (
          <Character entity={entity} />
        ) : (
          <div className="gift pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-3/5 w-3/5 items-center justify-center rounded-full bg-cyan-400/90 text-3xl ring-4 ring-cyan-200 sm:text-4xl">
              {POWERUPS[entity.type as PowerupType].emoji}
            </span>
          </div>
        ))}
      {showHint && (
        <span className="absolute left-1.5 top-1 rounded bg-black/30 px-1 text-[10px] font-bold text-indigo-200/90">
          {hint}
        </span>
      )}
      {fx.map((f) => (
        <span
          key={f.id}
          className={`bonk pointer-events-none absolute inset-x-0 top-1/3 z-10 text-center text-xs font-black drop-shadow sm:text-sm ${TONE_COLOR[f.tone]}`}
        >
          {f.text}
        </span>
      ))}
    </button>
  );
}
