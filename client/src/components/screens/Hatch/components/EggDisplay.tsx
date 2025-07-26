import { motion } from "framer-motion";
import type { EggType } from "./eggAnimation";
import type { EggState } from "../hooks/useEggAnimation";
import { EggGlowEffect } from "./EggGlowEffect";

interface EggDisplayProps {
  currentFrame: string;
  eggType: EggType;
  eggState: EggState;
  canClick: boolean;
  glowLevel: number;
  onHatch: () => void;
}

export const EggDisplay = ({
  currentFrame,
  eggType,
  eggState,
  canClick,
  glowLevel,
  onHatch
}: EggDisplayProps) => {
  const getEggTypeName = (type: EggType): string => {
    const names = {
      shadow: 'Shadow',
      dragon: 'Dragon',
      water: 'Water'
    };
    return names[type];
  };

  // Egg animation with progressive glow effects
  const eggAnimation = {
    initial: { scale: 0.3, opacity: 0, rotate: -15 },
    animate: {
      scale: eggState === 'idle' ? [1, 1.08, 1] : 1,
      opacity: 1,
      rotate: eggState === 'hatching' ? [0, -2, 2, 0] : 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
        delay: 0.6,
        scale: eggState === 'idle' ? {
          delay: 0.8,
          repeat: Infinity,
          duration: 2.5,
          ease: "easeInOut" as const
        } : { delay: 0.6, duration: 0.7 },
        opacity: {
          delay: 0.6,
          duration: 0.5
        },
        rotate: eggState === 'hatching' ? {
          repeat: Infinity,
          duration: 0.3,
          ease: "easeInOut" as const
        } : { delay: 0.6, duration: 0.3 }
      },
    },
    whileHover: canClick ? {
      scale: 1.15,
      rotate: [0, -3, 3, 0],
      transition: {
        scale: { duration: 0.3 },
        rotate: { repeat: Infinity, duration: 1.5, ease: "easeInOut" as const }
      }
    } : {},
    whileTap: canClick ? {
      scale: 0.95,
      transition: { duration: 0.1 }
    } : {}
  };

  return (
    <motion.div
      className={`relative ${canClick ? 'cursor-pointer' : 'cursor-default'}`}
      {...eggAnimation}
      onClick={canClick ? onHatch : undefined}
    >
      <img
        src={currentFrame}
        alt={`${getEggTypeName(eggType)} Beast Egg - ${eggState}`}
        className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)] select-none"
      />

      {/* Progressive Glow System */}
      <EggGlowEffect glowLevel={glowLevel} />
    </motion.div>
  );
};
