import type { Screen } from "../types/screens";

export interface SleepScreenProps {
  onNavigation: (screen: Screen) => void;
  playerAddress: string;
}

export interface CampfireControllerProps {
  isCampfireOn: boolean;
  onCampfireClick: () => void;
  litFrames: string[];
  extinguishedFrames: string[];
  litFrameIndex: number;
  extinguishedFrameIndex: number;
  trunkImage: string;
}

export interface BeastSleepDisplayProps {
  beastImage: string;
  altText: string;
}
