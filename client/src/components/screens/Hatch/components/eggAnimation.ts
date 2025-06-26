// 🔥 SHADOW/WOLF frames (specie 1)
import EggShadowFrame0 from "../../../../assets/eggs/egg-wolf/egg-wolf-frame-0.png";
import EggShadowFrame1 from "../../../../assets/eggs/egg-wolf/egg-wolf-frame-1.png";
import EggShadowFrame2 from "../../../../assets/eggs/egg-wolf/egg-wolf-frame-2.png";
import EggShadowFrame3 from "../../../../assets/eggs/egg-wolf/egg-wolf-frame-3.png";
import EggShadowFrame4 from "../../../../assets/eggs/egg-wolf/egg-wolf-frame-4.png";
import EggShadowFrame5 from "../../../../assets/eggs/egg-wolf/egg-wolf-frame-5.png";

// 🔥 DRAGON frames (specie 2) - Usar frames reales cuando estén listos
// Por ahora usamos placeholders de shadow
import EggDragonFrame0 from "../../../../assets/eggs/egg-dragon/egg-dragon-frame-0.png";
import EggDragonFrame1 from "../../../../assets/eggs/egg-dragon/egg-dragon-frame-1.png";
import EggDragonFrame2 from "../../../../assets/eggs/egg-dragon/egg-dragon-frame-2.png";
import EggDragonFrame3 from "../../../../assets/eggs/egg-dragon/egg-dragon-frame-3.png";
import EggDragonFrame4 from "../../../../assets/eggs/egg-dragon/egg-dragon-frame-4.png";
import EggDragonFrame5 from "../../../../assets/eggs/egg-dragon/egg-dragon-frame-5.png";

// 🔥 WATER frames (specie 3) - Usar frames reales cuando estén listos
// Por ahora usamos placeholders de shadow
import EggWaterFrame0 from "../../../../assets/eggs/egg-snake/egg-snake-frame-0.png";
import EggWaterFrame1 from "../../../../assets/eggs/egg-snake/egg-snake-frame-1.png";
import EggWaterFrame2 from "../../../../assets/eggs/egg-snake/egg-snake-frame-2.png";
import EggWaterFrame3 from "../../../../assets/eggs/egg-snake/egg-snake-frame-3.png";
import EggWaterFrame4 from "../../../../assets/eggs/egg-snake/egg-snake-frame-4.png";
import EggWaterFrame5 from "../../../../assets/eggs/egg-snake/egg-snake-frame-5.png";

// Beast assets - importar solo baby wolf por ahora
import BabyWolf from "../../../../assets/beasts/baby-wolf.png";
import BabyDragon from "../../../../assets/beasts/baby-dragon.png";
import BabySnake from "../../../../assets/beasts/baby-snake.png";

export type EggType = 'shadow' | 'dragon' | 'water';
export type BeastType = 'wolf' | 'dragon' | 'snake';

// 🔥 NUEVO: Mapeo directo de specie (del contrato) a egg type
export const SPECIE_TO_EGG_TYPE: Record<number, EggType> = {
  1: 'shadow',  // Shadow Beast (specie 1) → Shadow Egg
  2: 'dragon',  // Fire Beast (specie 2) → Dragon Egg  
  3: 'water'    // Water Beast (specie 3) → Water Egg
};

// 🔥 NUEVO: Mapeo inverso de egg type a specie
export const EGG_TYPE_TO_SPECIE: Record<EggType, number> = {
  shadow: 1,
  dragon: 2,
  water: 3
};

// Mapeo de egg types a beast types (para UI)
export const EGG_TO_BEAST_MAP: Record<EggType, BeastType> = {
  shadow: 'wolf',    // Shadow egg → Wolf
  dragon: 'dragon',  // Dragon egg → Dragon
  water: 'snake'     // Water egg → Snake
};

// 🔥 ACTUALIZADO: Beast assets con placeholders claramente marcados
export const BEAST_ASSETS: Record<BeastType, string> = {
  wolf: BabyWolf,
  dragon: BabyDragon, 
  snake: BabySnake  
};

// 🔥 ACTUALIZADO: Interface extendida con specie info
export interface EggAnimation {
  eggType: EggType;
  beastType: BeastType;
  specie: number;           // Specie correspondiente (1-3)
  idleFrame: string;
  hatchFrames: string[];
  beastAsset: string;
}

// 🔥 ACTUALIZADO: Configuraciones completas con specie mapping
export const EGG_ANIMATIONS: Record<EggType, EggAnimation> = {
  shadow: {
    eggType: 'shadow',
    beastType: 'wolf',
    specie: 1,                // Shadow Beast = specie 1
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
  
  dragon: {
    eggType: 'dragon',
    beastType: 'dragon',
    specie: 2,                // Fire Beast = specie 2
    idleFrame: EggDragonFrame0,
    hatchFrames: [
      EggDragonFrame0,        // TODO: Cambiar a frames reales de dragón
      EggDragonFrame1,
      EggDragonFrame2,
      EggDragonFrame3,
      EggDragonFrame4,
      EggDragonFrame5
    ],
    beastAsset: BabyWolf      // TODO: Cambiar a BabyDragon
  },
  
  water: {
    eggType: 'water',
    beastType: 'snake',
    specie: 3,                // Water Beast = specie 3
    idleFrame: EggWaterFrame0,
    hatchFrames: [
      EggWaterFrame0,         // TODO: Cambiar a frames reales de agua
      EggWaterFrame1,
      EggWaterFrame2,
      EggWaterFrame3,
      EggWaterFrame4,
      EggWaterFrame5
    ],
    beastAsset: BabyWolf      // TODO: Cambiar a BabySnake
  }
};

// Animation configuration
export const EGG_ANIMATION_CONFIG = {
  FRAME_DURATION: 150,       // ms per frame
  TOTAL_DURATION: 900,       // 6 frames * 150ms
  BEAST_REVEAL_DELAY: 800,   // Delay before showing the beast
} as const;

// 🔥 NUEVO: Helper functions para facilitar el uso

/**
 * Obtiene la configuración de animación basada en specie del contrato
 */
export const getEggAnimationBySpecie = (specie: number): EggAnimation => {
  const eggType = SPECIE_TO_EGG_TYPE[specie] || 'shadow';
  return EGG_ANIMATIONS[eggType];
};

/**
 * Obtiene el egg type basado en specie del contrato
 */
export const getEggTypeBySpecie = (specie: number): EggType => {
  return SPECIE_TO_EGG_TYPE[specie] || 'shadow';
};

/**
 * Obtiene la specie basada en egg type
 */
export const getSpecieByEggType = (eggType: EggType): number => {
  return EGG_TYPE_TO_SPECIE[eggType] || 1;
};

/**
 * Valida que un egg type sea válido
 */
export const isValidEggType = (eggType: string): eggType is EggType => {
  return ['shadow', 'dragon', 'water'].includes(eggType);
};

/**
 * Obtiene información completa de beast basada en egg type
 */
export const getBeastInfoByEggType = (eggType: EggType) => {
  const animation = EGG_ANIMATIONS[eggType];
  return {
    eggType: animation.eggType,
    beastType: animation.beastType,
    specie: animation.specie,
    beastAsset: animation.beastAsset
  };
};