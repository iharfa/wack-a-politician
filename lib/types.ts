export type GameMode = "quick" | "classic" | "chaos";
export type CharacterType = "regular" | "fast" | "tank" | "decoy" | "bonus";
export type PowerupType = "freeze" | "double" | "slow" | "shield" | "sweep";
export type GameStatus = "idle" | "playing" | "over";

export interface Entity {
  id: number;
  hole: number;
  kind: "character" | "powerup";
  type: CharacterType | PowerupType;
  hp: number;
  maxHp: number;
  expiresAt: number;
}

export interface ActivePowerup {
  type: PowerupType;
  endsAt: number;
}

export interface GameState {
  status: GameStatus;
  mode: GameMode;
  timeLeft: number;
  score: number;
  streak: number;
  bestStreak: number;
  hits: number;
  misses: number;
  shield: boolean;
  frozen: boolean;
  entities: Entity[];
  powerups: ActivePowerup[];
}

export interface LeaderboardEntry {
  nickname: string;
  score: number;
  mode: GameMode;
  accuracy: number; // 0-100
  bestStreak: number;
  date: string; // ISO string
}

export interface Settings {
  sound: boolean;
  vibration: boolean;
  reducedMotion: boolean;
  keyboardHints: boolean;
}
