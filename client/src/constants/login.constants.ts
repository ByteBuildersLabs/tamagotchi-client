import type { Gradient, Star, Twinkle, Circle } from '../components/types/login.types';

// Animation timing constants
export const ANIMATION_TIMINGS = {
  CIRCLE_ROTATION: 2000,
  VIEW_TRANSITION_DELAY: 2000,
  GAME_VIEW_DURATION: 2000,
} as const;

// SVG Gradients for circles
export const GRADIENTS: Gradient[] = [
  { id: 'raiseGradient', cx: 200, cy: 160, color: '#ff69b4' },
  { id: 'playGradient', cx: 130, cy: 280, color: '#9370db' },
  { id: 'evolveGradient', cx: 270, cy: 280, color: '#87ceeb' }
];

// Background stars configuration
export const STARS: Star[] = [
  { cx: 50, cy: 150, r: 3 }, 
  { cx: 70, cy: 180, r: 2 },
  { cx: 350, cy: 180, r: 3 }, 
  { cx: 325, cy: 140, r: 2 }
];

// Twinkle elements configuration
export const TWINKLES: Twinkle[] = [
  { d: "M60 130 L65 140 L70 130 L65 120 Z", transform: "translate(10)" },
  { d: "M340 130 L345 140 L350 130 L345 120 Z", transform: "translate(-25, 40)" }
];

// Main interactive circles
export const CIRCLES: Circle[] = [
  { cx: 200, cy: 160, text: 'RAISE', gradient: 'raiseGradient' },
  { cx: 130, cy: 280, text: 'PLAY', gradient: 'playGradient' },
  { cx: 270, cy: 280, text: 'EVOLVE', gradient: 'evolveGradient' }
];