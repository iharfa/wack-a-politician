"use client";
import { useState } from "react";
import { CHARACTERS, PROMOTED_IMAGES } from "@/lib/config";
import type { CharacterType, Entity } from "@/lib/types";

export default function Character({ entity, skin }: { entity: Entity; skin: boolean }) {
  const type = entity.type as CharacterType;
  const def = CHARACTERS[type];
  const src = skin ? PROMOTED_IMAGES[type] : def.image;
  const [failed, setFailed] = useState(false);
  return (
    <div className="pop pointer-events-none absolute inset-1 flex flex-col items-center justify-end">
      {entity.maxHp > 1 && (
        <div className="mb-1 h-2 w-4/5 overflow-hidden border-2 border-[var(--color-ink)] bg-[var(--color-paper)]">
          <div
            className="h-full bg-[var(--color-accent)] transition-[width] duration-75"
            style={{ width: `${(entity.hp / entity.maxHp) * 100}%` }}
          />
        </div>
      )}
      <div
        className={`flex w-full flex-1 items-center justify-center overflow-hidden rounded-t-full border-2 border-[var(--color-ink)] ${def.bg} text-4xl sm:text-5xl`}
      >
        {src && !failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={def.name} onError={() => setFailed(true)} className="h-full w-full object-cover" />
        ) : (
          <span>{def.emoji}</span>
        )}
      </div>
    </div>
  );
}
