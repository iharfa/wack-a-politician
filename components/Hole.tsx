"use client";
import { POWERUPS } from "@/lib/config";
import type { Entity, PowerupType } from "@/lib/types";
import type { FxEvent } from "@/lib/useGame";
import Character from "./Character";

const TONE_COLOR = {
  good: "text-[var(--color-paper)]",
  bad: "text-[var(--color-accent)]",
  power: "text-[var(--color-char-bonus)]",
};

interface Props {
  index: number;
  hint: string;
  showHint: boolean;
  entity?: Entity;
  fx: (FxEvent & { id: number })[];
  skin: boolean;
  onWhack: (hole: number) => void;
}

export default function Hole({ index, hint, showHint, entity, fx, skin, onWhack }: Props) {
  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        onWhack(index);
      }}
      className="relative aspect-square touch-none select-none overflow-hidden border-2 border-[var(--color-ink)] bg-[var(--color-paper-2)] shadow-[3px_3px_0_var(--color-ink)] transition-transform active:scale-95"
      aria-label={`Hole ${index + 1}`}
    >
      <div className="absolute inset-x-2 bottom-1 h-1/3 rounded-[50%] bg-[var(--color-ink)]/80" />
      {entity &&
        (entity.kind === "character" ? (
          <Character key={entity.id} entity={entity} skin={skin} />
        ) : (
          <div className="gift pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-3/5 w-3/5 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent-2)] text-3xl shadow-[2px_2px_0_var(--color-ink)] sm:text-4xl">
              {POWERUPS[entity.type as PowerupType].emoji}
            </span>
          </div>
        ))}
      {showHint && (
        <span className="absolute left-1 top-1 bg-[var(--color-ink)] px-1 text-[10px] font-bold text-[var(--color-paper)]">
          {hint}
        </span>
      )}
      {fx.map((f) => (
        <span
          key={f.id}
          className={`bonk display pointer-events-none absolute inset-x-0 top-1/3 z-10 text-center text-sm sm:text-base ${TONE_COLOR[f.tone]}`}
          style={{ textShadow: "1.5px 1.5px 0 var(--color-ink)" }}
        >
          {f.text}
        </span>
      ))}
    </button>
  );
}
