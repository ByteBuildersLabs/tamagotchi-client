import type { Screen } from "../types/screens";

export interface PlayScreenProps {
  onNavigation: (screen: Screen) => void;
  playerAddress: string;
}

export interface MiniGame {
  id: string;
  title: string;
  icon: string;
  route: string;
}

export interface GameCarouselProps {
  games: MiniGame[];
  onGameSelect: (gameId: string) => void;
}

export interface BeastPlayDisplayProps {
  beastImage: string;
  altText: string;
}