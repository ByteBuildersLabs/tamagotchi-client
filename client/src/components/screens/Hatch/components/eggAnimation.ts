// Egg Wolf frames
import EggShadowFrame0 from "../../../../assets/eggs/egg-wolf/egg-wolf-frame-0.png";
import EggShadowFrame1 from "../../../../assets/eggs/egg-wolf/egg-wolf-frame-1.png";
import EggShadowFrame2 from "../../../../assets/eggs/egg-wolf/egg-wolf-frame-2.png";
import EggShadowFrame3 from "../../../../assets/eggs/egg-wolf/egg-wolf-frame-3.png";
import EggShadowFrame4 from "../../../../assets/eggs/egg-wolf/egg-wolf-frame-4.png";
import EggShadowFrame5 from "../../../../assets/eggs/egg-wolf/egg-wolf-frame-5.png";

// Beast assets
import BabyWolf from "../../../../assets/beasts/baby-wolf.png";
// TODO: Add more beasts when they are ready
// import BabyDragon from "../assets/beasts/baby-dragon.png";
// import BabySnake from "../assets/beasts/baby-snake.png";

// TODO: Add dragon and water frames when they are ready
// import EggDragonFrame0 from "../assets/eggs/egg-dragon/egg-dragon-frame-0.png";
// import EggWaterFrame0 from "../assets/eggs/egg-water/egg-water-frame-0.png";

export type EggType = 'shadow' | 'dragon' | 'water';
export type BeastType = 'wolf' | 'dragon' | 'snake';

// Mapping from egg types to beasts
export const EGG_TO_BEAST_MAP: Record<EggType, BeastType> = {
  shadow: 'wolf',
  dragon: 'dragon',
  water: 'snake'
};

// Beast assets
export const BEAST_ASSETS: Record<BeastType, string> = {
  wolf: BabyWolf,
  dragon: BabyWolf, // Placeholder
  snake: BabyWolf   // Placeholder
};

export interface EggAnimation {
  eggType: EggType;
  beastType: BeastType;
  idleFrame: string;
  hatchFrames: string[];
  beastAsset: string;
}

export const EGG_ANIMATIONS: Record<EggType, EggAnimation> = {
  shadow: {
    eggType: 'shadow',
    beastType: 'wolf',
    idleFrame: EggShadowFrame0,
    hatchFrames: [
      EggShadowFrame0,
      EggShadowFrame1,
      EggShadowFrame2,
      EggShadowFrame3,
      EggShadowFrame4,
      EggShadowFrame5
    ],
    beastAsset: BabyWolf
  },
  // TODO: Implement when we have the assets
  dragon: {
    eggType: 'dragon',
    beastType: 'dragon',
    idleFrame: EggShadowFrame0, // Placeholder
    hatchFrames: [
      EggShadowFrame0, // Placeholder frames
      EggShadowFrame1,
      EggShadowFrame2,
      EggShadowFrame3,
      EggShadowFrame4,
      EggShadowFrame5
    ],
    beastAsset: BabyWolf // Placeholder
  },
  water: {
    eggType: 'water',
    beastType: 'snake',
    idleFrame: EggShadowFrame0, // Placeholder
    hatchFrames: [
      EggShadowFrame0, // Placeholder frames
      EggShadowFrame1,
      EggShadowFrame2,
      EggShadowFrame3,
      EggShadowFrame4,
      EggShadowFrame5
    ],
    beastAsset: BabyWolf // Placeholder
  }
};

// Animation configuration
export const EGG_ANIMATION_CONFIG = {
  FRAME_DURATION: 150, // ms per frame
  TOTAL_DURATION: 900, // 6 frames * 150ms
  BEAST_REVEAL_DELAY: 800, // Delay before showing the beast
} as const;