import type { Screen } from "../types/screens";

export interface CleanScreenProps {
  onNavigation: (screen: Screen) => void;
  playerAddress: string;
  rainDuration?: number;
}

export interface CloudControllerProps {
  isCloudOn: boolean;
  onCloudClick: () => void;
  cloudFrames: string[];
  isAnimating: boolean;
  currentFrameIndex: number;
}

export interface BeastDisplayProps {
  beastImage: string;
  altText: string;
}