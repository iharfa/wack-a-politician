"use client";
import type { Entity } from "@/lib/types";
import type { FxEvent } from "@/lib/useGame";
import Hole from "./Hole";

const HINTS = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];

interface Props {
  entities: Entity[];
  fx: (FxEvent & { id: number })[];
  showHints: boolean;
  onWhack: (hole: number) => void;
}

export default function GameBoard({ entities, fx, showHints, onWhack }: Props) {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-1 flex justify-center gap-4 text-lg opacity-70" aria-hidden>
        <span>🎤</span>
        <span>🗳️</span>
        <span>📜</span>
        <span>🗳️</span>
        <span>🎤</span>
      </div>
      <div className="grid grid-cols-3 gap-2 rounded-3xl bg-indigo-950/60 p-2 ring-4 ring-indigo-700/50 sm:gap-3 sm:p-3">
        {HINTS.map((h, i) => (
          <Hole
            key={i}
            index={i}
            hint={h}
            showHint={showHints}
            entity={entities.find((e) => e.hole === i)}
            fx={fx.filter((f) => f.hole === i)}
            onWhack={onWhack}
          />
        ))}
      </div>
    </div>
  );
}
