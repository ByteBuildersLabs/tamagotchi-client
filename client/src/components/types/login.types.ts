// Types for Login/Cover components
export type View = 'universe' | 'game' | 'cover';
export type CircleType = 'play' | 'raise' | 'evolve';

export interface Gradient {
  id: string;
  cx: number;
  cy: number;
  color: string;
}

export interface Star {
  cx: number;
  cy: number;
  r: number;
}

export interface Twinkle {
  d: string;
  transform: string;
}

export interface Circle {
  cx: number;
  cy: number;
  text: string;
  gradient: string;
}