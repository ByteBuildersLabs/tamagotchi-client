// Game system types - separate from play.types for better organization

// Game constants matching your Dojo backend
export const GAME_IDS = {
  FLAPPY_BEASTS: 2,
  PLATFORM_JUMP: 1
} as const;

export type GameIdValue = typeof GAME_IDS[keyof typeof GAME_IDS];

// High Score related types (from your useHighScore hook)
export interface HighScore {
  minigame_id: number;
  player: string;
  score: number;
}

export interface HighScoreEdge {
  node: HighScore;
}

// Energy system constants
export const ENERGY_SYSTEM = {
  MINIMUM_ENERGY: 30,
  ENERGY_COST_PER_GAME: 10,
  WARNING_THRESHOLD: 40,
  TOAST_DURATION: 3000
} as const;

// Reward system with coins and gems
export interface CoinReward {
  coins: number;
  gems: number;
  range: ScoreRange;
  percentage: number;
}

export interface ScoreRange {
  min: number;
  max: number;
  coins: number;
  gems: number;
  label: string;
}

// Game state management
export interface GameState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  isPaused: boolean;
  startTime: number;
  endTime?: number;
}

// Game performance tracking
export interface GamePerformance {
  frameRate: number;
  lagCount: number;
  totalFrames: number;
  gameStartTime: number;
}

// Game configuration for each mini-game
export interface GameConfiguration {
  gameId: GameIdValue;
  name: string;
  description: string;
  energyRequirement: number;
  maxScore?: number;
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Toast notification system for games
export interface GameToast {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  duration: number;
  icon?: string;
}

// Game error handling
export interface GameError {
  code: string;
  message: string;
  recoverable: boolean;
  timestamp: number;
}