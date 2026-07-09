"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { sfx } from "./audio";
import { BONK_WORDS, CHARACTERS, MODES, multiplier, POWERUPS } from "./config";
import type { CharacterType, GameMode, GameState, PowerupType, Settings } from "./types";

export interface FxEvent {
  hole: number;
  text: string;
  tone: "good" | "bad" | "power";
}

const idleState = (): GameState => ({
  status: "idle",
  mode: "classic",
  timeLeft: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  hits: 0,
  misses: 0,
  shield: false,
  frozen: false,
  entities: [],
  powerups: [],
});

interface Engine extends GameState {
  lastSpawn: number;
  lastTick: number;
  freezeUntil: number;
  nextId: number;
}

const freshEngine = (): Engine => ({ ...idleState(), lastSpawn: 0, lastTick: 0, freezeUntil: 0, nextId: 1 });

export function useGame(settings: Settings, onFx: (fx: FxEvent) => void) {
  const [state, setState] = useState<GameState>(idleState);
  const g = useRef<Engine>(freshEngine());
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const fxRef = useRef(onFx);
  fxRef.current = onFx;

  const sync = () => {
    const s = g.current;
    setState({
      status: s.status,
      mode: s.mode,
      timeLeft: s.timeLeft,
      score: s.score,
      streak: s.streak,
      bestStreak: s.bestStreak,
      hits: s.hits,
      misses: s.misses,
      shield: s.shield,
      frozen: Date.now() < s.freezeUntil,
      entities: [...s.entities],
      powerups: [...s.powerups],
    });
  };

  const stopTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };
  useEffect(() => stopTimer, []);

  const vibrate = (ms: number) => {
    if (settingsRef.current.vibration && typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(ms);
  };

  const hasPowerup = (t: PowerupType) => g.current.powerups.some((p) => p.type === t && p.endsAt > Date.now());

  const spawn = (now: number) => {
    const s = g.current;
    const cfg = MODES[s.mode];
    const free = [...Array(9).keys()].filter((h) => !s.entities.some((e) => e.hole === h));
    if (!free.length) return;
    const hole = free[Math.floor(Math.random() * free.length)];
    const elapsed = cfg.duration - s.timeLeft;
    const decay = Math.pow(0.92, Math.floor(elapsed / 10));
    const slowMo = hasPowerup("slow") ? 1.8 : 1;

    if (Math.random() < cfg.powerupChance) {
      const types = Object.keys(POWERUPS) as PowerupType[];
      const type = types[Math.floor(Math.random() * types.length)];
      s.entities.push({ id: s.nextId++, hole, kind: "powerup", type, hp: 1, maxHp: 1, expiresAt: now + 1800 * slowMo });
    } else {
      let r = Math.random();
      let type: CharacterType = "regular";
      for (const [t, w] of Object.entries(cfg.weights)) {
        r -= w;
        if (r <= 0) {
          type = t as CharacterType;
          break;
        }
      }
      const life = Math.max(cfg.minLife, cfg.baseLife * decay) * slowMo;
      const lifetime = type === "tank" ? 7000 * slowMo : type === "fast" || type === "bonus" ? life * 0.55 : life;
      const hp = type === "tank" ? 15 + Math.floor(Math.random() * 11) : 1; // 15-25 taps
      s.entities.push({ id: s.nextId++, hole, kind: "character", type, hp, maxHp: hp, expiresAt: now + lifetime });
    }
    s.lastSpawn = now;
  };

  const tick = () => {
    const s = g.current;
    const now = Date.now();
    // subtract real elapsed time (browsers throttle intervals in background tabs);
    // cap at 1s per tick so a suspended tab doesn't drain the round on return
    const dt = Math.min(1, (now - (s.lastTick || now)) / 1000);
    s.lastTick = now;
    if (now >= s.freezeUntil) s.timeLeft = Math.max(0, s.timeLeft - dt);
    s.entities = s.entities.filter((e) => e.expiresAt > now);
    s.powerups = s.powerups.filter((p) => p.endsAt > now);

    const cfg = MODES[s.mode];
    const elapsed = cfg.duration - s.timeLeft;
    const spawnEvery = Math.max(cfg.minSpawn, cfg.baseSpawn * Math.pow(0.85, Math.floor(elapsed / 10)));
    if (now - s.lastSpawn >= spawnEvery && s.entities.length < cfg.maxOnScreen) spawn(now);

    if (s.timeLeft <= 0) {
      s.status = "over";
      s.entities = [];
      s.powerups = [];
      stopTimer();
      if (settingsRef.current.sound) sfx.end();
    }
    sync();
  };

  const activate = (type: PowerupType, now: number, hole: number) => {
    const s = g.current;
    fxRef.current({ hole, text: `${POWERUPS[type].emoji} ${POWERUPS[type].name.toUpperCase()}!`, tone: "power" });
    if (type === "shield") {
      s.shield = true;
      return;
    }
    if (type === "sweep") {
      const mult = multiplier(s.streak);
      let gained = 0;
      for (const c of s.entities.filter((x) => x.kind === "character")) {
        if (c.type !== "decoy") {
          gained += Math.round(Math.max(10, CHARACTERS[c.type as CharacterType].points) * mult);
          s.hits++;
        }
      }
      s.score += gained;
      s.entities = s.entities.filter((x) => x.kind === "powerup");
      return;
    }
    const dur = POWERUPS[type].duration;
    if (type === "freeze") s.freezeUntil = now + dur;
    s.powerups = [...s.powerups.filter((p) => p.type !== type), { type, endsAt: now + dur }];
  };

  const start = useCallback((mode: GameMode) => {
    stopTimer();
    g.current = {
      ...freshEngine(),
      status: "playing",
      mode,
      timeLeft: MODES[mode].duration,
      lastSpawn: Date.now(),
      lastTick: Date.now(),
    };
    timer.current = setInterval(tick, 100);
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quit = useCallback(() => {
    stopTimer();
    g.current = freshEngine();
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pausedAt = useRef(0);

  const pause = useCallback(() => {
    if (g.current.status !== "playing" || !timer.current) return;
    stopTimer();
    pausedAt.current = Date.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resume = useCallback(() => {
    const s = g.current;
    if (s.status !== "playing" || timer.current) return;
    // shift every deadline forward by the paused duration so nothing expires mid-pause
    const delta = Date.now() - pausedAt.current;
    s.entities = s.entities.map((e) => ({ ...e, expiresAt: e.expiresAt + delta }));
    s.powerups = s.powerups.map((p) => ({ ...p, endsAt: p.endsAt + delta }));
    if (s.freezeUntil > pausedAt.current) s.freezeUntil += delta;
    s.lastSpawn += delta;
    s.lastTick = Date.now();
    timer.current = setInterval(tick, 100);
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const whack = useCallback((hole: number) => {
    const s = g.current;
    if (s.status !== "playing" || !timer.current) return; // ignore input while paused
    const now = Date.now();
    const e = s.entities.find((en) => en.hole === hole && en.expiresAt > now);
    const snd = settingsRef.current.sound;

    if (!e) {
      s.misses++;
      if (s.shield) {
        s.shield = false;
        fxRef.current({ hole, text: "SHIELD SAVED IT!", tone: "power" });
      } else {
        s.streak = 0;
      }
      if (snd) sfx.miss();
      sync();
      return;
    }

    const remove = () => {
      s.entities = s.entities.filter((x) => x.id !== e.id);
    };

    if (e.kind === "powerup") {
      activate(e.type as PowerupType, now, hole);
      remove();
      if (snd) sfx.powerup();
      vibrate(20);
      sync();
      return;
    }

    const mult = multiplier(s.streak);
    const dbl = hasPowerup("double") ? 2 : 1;
    const type = e.type as CharacterType;

    if (type === "decoy") {
      s.misses++;
      s.score = Math.max(0, s.score - 25);
      if (s.shield) {
        s.shield = false;
        fxRef.current({ hole, text: "SHIELDED! -25", tone: "power" });
      } else {
        s.streak = 0;
        fxRef.current({ hole, text: "DECOY! -25", tone: "bad" });
      }
      remove();
      if (snd) sfx.miss();
    } else if (type === "tank") {
      e.hp--;
      s.hits++;
      s.streak++;
      s.score += Math.round(2 * mult) * dbl;
      vibrate(15);
      if (e.hp <= 0) {
        const bonus = (100 + (e.maxHp - 15) * 15) * dbl; // 15 taps -> 100, 25 taps -> 250
        s.score += bonus;
        remove();
        fxRef.current({ hole, text: `TERM LIMITED! +${bonus}`, tone: "good" });
        if (snd) sfx.ko();
      } else if (snd) {
        sfx.hit();
      }
    } else {
      const pts = Math.round(CHARACTERS[type].points * mult) * dbl;
      s.score += pts;
      s.hits++;
      s.streak++;
      remove();
      vibrate(25);
      const word = type === "bonus" ? "JACKPOT!" : BONK_WORDS[Math.floor(Math.random() * BONK_WORDS.length)];
      fxRef.current({ hole, text: `${word} +${pts}`, tone: "good" });
      if (snd) (type === "bonus" ? sfx.ko : sfx.hit)();
    }

    s.bestStreak = Math.max(s.bestStreak, s.streak);
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { state, start, whack, quit, pause, resume };
}
