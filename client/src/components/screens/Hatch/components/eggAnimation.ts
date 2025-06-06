// Egg Wolf frames
import EggShadowFrame0 from "../../../../assets/eggs/egg-wolf/egg-wolf-frame-0.png";
import EggShadowFrame1 from "../../../../assets/eggs/egg-wolf/egg-wolf-frame-1.png";
import EggShadowFrame2 from "../../../../assets/eggs/egg-wolf/egg-wolf-frame-2.png";
import EggShadowFrame3 from "../../../../assets/eggs/egg-wolf/egg-wolf-frame-3.png";
import EggShadowFrame4 from "../../../../assets/eggs/egg-wolf/egg-wolf-frame-4.png";
import EggShadowFrame5 from "../../../../assets/eggs/egg-wolf/egg-wolf-frame-5.png";

// TODO: Agregar frames de dragon y water cuando estén listos
// import EggDragonFrame0 from "../assets/eggs/egg-dragon/egg-dragon-frame-0.png";
// import EggWaterFrame0 from "../assets/eggs/egg-water/egg-water-frame-0.png";

export type EggType = 'shadow' | 'dragon' | 'water';
export type BeastType = 'wolf' | 'dragon' | 'snake';

// Mapeo de tipos de huevo a bestias
export const EGG_TO_BEAST_MAP: Record<EggType, BeastType> = {
  shadow: 'wolf',
  dragon: 'dragon', 
  water: 'snake'
};

export interface EggAnimation {
  eggType: EggType;
  beastType: BeastType;
  idleFrame: string;
  hatchFrames: string[];
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
    ]
  },
  // TODO: Implementar cuando tengamos los assets
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
    ]
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
    ]
  }
};

// Configuración de la animación
export const EGG_ANIMATION_CONFIG = {
  FRAME_DURATION: 150, // ms por frame
  TOTAL_DURATION: 900, // 6 frames * 150ms
  DELAY_BEFORE_TRANSITION: 500, // Delay después de la animación antes de ir al cover
} as const;