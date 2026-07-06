import { CHARACTERS } from "@/lib/config";
import type { CharacterType, Entity } from "@/lib/types";

export default function Character({ entity }: { entity: Entity }) {
  const def = CHARACTERS[entity.type as CharacterType];
  return (
    <div className="pop pointer-events-none absolute inset-1 flex flex-col items-center justify-end">
      {entity.maxHp > 1 && (
        <div className="mb-1 h-2 w-4/5 overflow-hidden rounded bg-black/50">
          <div
            className="h-full bg-rose-400 transition-[width] duration-75"
            style={{ width: `${(entity.hp / entity.maxHp) * 100}%` }}
          />
        </div>
      )}
      <div
        className={`flex w-full flex-1 items-center justify-center overflow-hidden rounded-t-full ring-4 ${def.ring} ${def.bg} text-4xl sm:text-5xl`}
      >
        {def.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={def.image} alt={def.name} className="h-full w-full object-contain" />
        ) : (
          <span>{def.emoji}</span>
        )}
      </div>
    </div>
  );
}
