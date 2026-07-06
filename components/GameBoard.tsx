"use client";
import type { Entity } from "@/lib/types";
import type { FxEvent } from "@/lib/useGame";
import Hole from "./Hole";

const HINTS = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];

interface Props {
  entities: Entity[];
  fx: (FxEvent & { id: number })[];
  showHints: boolean;
  skin: boolean;
  onWhack: (hole: number) => void;
}

export default function GameBoard({ entities, fx, showHints, skin, onWhack }: Props) {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="border-2 border-b-0 border-[var(--color-ink)] bg-[var(--color-accent)] py-1 text-center">
        <span className="display text-xs text-[var(--color-accent-ink)]">◆ Step right up ◆</span>
      </div>
      <div className="grid grid-cols-3 gap-2 border-2 border-[var(--color-ink)] bg-[var(--color-accent-2)] p-2 shadow-[6px_6px_0_var(--color-ink)] sm:gap-3 sm:p-3">
        {HINTS.map((h, i) => (
          <Hole
            key={i}
            index={i}
            hint={h}
            showHint={showHints}
            entity={entities.find((e) => e.hole === i)}
            fx={fx.filter((f) => f.hole === i)}
            skin={skin}
            onWhack={onWhack}
          />
        ))}
      </div>
    </div>
  );
}
