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
}

export const CHARACTERS: Record<CharacterType, CharacterDef> = {
  regular: { name: "Senator Slick", emoji: "🤵", image: "/characters/regular.png", points: 10, bg: "bg-[var(--color-char-regular)]" },
  fast: { name: "Fast Talker", emoji: "🗣️", image: "/characters/fast.png", points: 25, bg: "bg-[var(--color-char-fast)]" },
  tank: { name: "Thick Skin", emoji: "🎩", image: "/characters/tank.png", points: 2, bg: "bg-[var(--color-char-tank)]" },
  decoy: { name: "Honest Citizen", emoji: "👵", image: "/characters/decoy.png", points: -25, bg: "bg-[var(--color-char-decoy)]" },
  bonus: { name: "The Big Cheese", emoji: "🤑", image: "/characters/bonus.png", points: 200, bg: "bg-[var(--color-char-bonus)]" },
};

// "Promoted mode" skin — unlocked by the start-screen hammer easter egg.
// Drop real politician images into /public/skin with these exact names.
export const PROMOTED_IMAGES: Record<CharacterType, string> = {
  regular: "/skin/regular.png",
  fast: "/skin/fast.png",
  tank: "/skin/tank.png",
  decoy: "/skin/decoy.png",
  bonus: "/skin/bonus.png",
};

// Powerup art slots: drop files in /public/powerups (512x512, circle-safe).
// The in-game orb falls back to the emoji whenever the image is missing.
export const POWERUPS: Record<PowerupType, { name: string; emoji: string; duration: number; image: string | null }> = {
  freeze: { name: "Freeze Time", emoji: "🧊", duration: 5000, image: "/powerups/freeze.png" },
  double: { name: "Double Points", emoji: "💰", duration: 8000, image: "/powerups/double.png" },
  slow: { name: "Slow Motion", emoji: "🐢", duration: 8000, image: "/powerups/slow.png" },
  shield: { name: "Streak Shield", emoji: "🛡️", duration: 0, image: "/powerups/shield.png" },
  sweep: { name: "Clean Sweep", emoji: "🧹", duration: 0, image: "/powerups/sweep.png" },
};

export const BONK_WORDS = ["BONK!", "PROMISE BROKEN!", "SPIN ALERT!", "U-TURN!", "MANIFESTO MODE!", "OUT OF OFFICE!"];

export function multiplier(streak: number): number {
  if (streak >= 30) return 4;
  if (streak >= 20) return 3;
  if (streak >= 10) return 2;
  if (streak >= 5) return 1.5;
  return 1;
}
