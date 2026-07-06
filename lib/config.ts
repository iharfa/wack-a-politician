import type { CharacterType, GameMode, PowerupType } from "./types";

export interface ModeConfig {
  label: string;
  tagline: string;
  duration: number; // seconds
  baseSpawn: number; // ms between spawns at start
  minSpawn: number;
  baseLife: number; // ms a character stays visible at start
  minLife: number;
  maxOnScreen: number;
  powerupChance: number;
  weights: Record<CharacterType, number>;
}

export const MODES: Record<GameMode, ModeConfig> = {
  quick: {
    label: "Quick Round",
    tagline: "30 second sprint",
    duration: 30,
    baseSpawn: 850,
    minSpawn: 380,
    baseLife: 1500,
    minLife: 700,
    maxOnScreen: 4,
    powerupChance: 0.06,
    weights: { regular: 0.62, fast: 0.15, decoy: 0.11, tank: 0.08, bonus: 0.04 },
  },
  classic: {
    label: "Classic",
    tagline: "60 second standard",
    duration: 60,
    baseSpawn: 850,
    minSpawn: 340,
    baseLife: 1500,
    minLife: 650,
    maxOnScreen: 4,
    powerupChance: 0.07,
    weights: { regular: 0.6, fast: 0.16, decoy: 0.11, tank: 0.09, bonus: 0.04 },
  },
  chaos: {
    label: "Chaos",
    tagline: "90 seconds of mayhem",
    duration: 90,
    baseSpawn: 560,
    minSpawn: 240,
    baseLife: 1300,
    minLife: 550,
    maxOnScreen: 6,
    powerupChance: 0.11,
    weights: { regular: 0.5, fast: 0.17, decoy: 0.12, tank: 0.16, bonus: 0.05 },
  },
};

export interface CharacterDef {
  name: string;
  emoji: string;
  // Asset slot: drop a file in /public/characters and set e.g. "/characters/regular.png"
  // to replace the emoji placeholder with real artwork.
  image: string | null;
  points: number;
  bg: string;
  ring: string;
}

export const CHARACTERS: Record<CharacterType, CharacterDef> = {
  regular: { name: "Senator Slick", emoji: "🤵", image: null, points: 10, bg: "bg-sky-300", ring: "ring-sky-500" },
  fast: { name: "Fast Talker", emoji: "🗣️", image: null, points: 25, bg: "bg-orange-300", ring: "ring-orange-500" },
  tank: { name: "Thick Skin", emoji: "🎩", image: null, points: 2, bg: "bg-rose-300", ring: "ring-rose-500" },
  decoy: { name: "Honest Citizen", emoji: "👵", image: null, points: -25, bg: "bg-emerald-300", ring: "ring-emerald-400" },
  bonus: { name: "The Big Cheese", emoji: "🤑", image: null, points: 200, bg: "bg-yellow-300", ring: "ring-yellow-400" },
};

export const POWERUPS: Record<PowerupType, { name: string; emoji: string; duration: number }> = {
  freeze: { name: "Freeze Time", emoji: "🧊", duration: 5000 },
  double: { name: "Double Points", emoji: "💰", duration: 8000 },
  slow: { name: "Slow Motion", emoji: "🐢", duration: 8000 },
  shield: { name: "Streak Shield", emoji: "🛡️", duration: 0 },
  sweep: { name: "Clean Sweep", emoji: "🧹", duration: 0 },
};

export const BONK_WORDS = ["BONK!", "PROMISE BROKEN!", "SPIN ALERT!", "U-TURN!", "MANIFESTO MODE!", "OUT OF OFFICE!"];

export function multiplier(streak: number): number {
  if (streak >= 30) return 4;
  if (streak >= 20) return 3;
  if (streak >= 10) return 2;
  if (streak >= 5) return 1.5;
  return 1;
}
