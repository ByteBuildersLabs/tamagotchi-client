import { motion } from "framer-motion";
import React from "react";
import { DragonDisplay } from "../../../shared/DragonDisplay";

interface BeastDisplayProps {
  triggerAction?: 'cleaning' | 'feeding' | 'sleeping' | null;
}

const beastAnimation = {
  initial: { scale: 0.3, opacity: 0, rotate: -15 },
  animate: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      delay: 0.6,
      scale: { delay: 0.6, duration: 0.5 },
      opacity: { delay: 0.6, duration: 0.4 },
    },
  },
  whileHover: { scale: 1.03, rotate: 2 },
};

export const BeastDisplay = ({ triggerAction }: BeastDisplayProps) => {
  React.useEffect(() => {
    // Force canvas to be 100% width and height
    const style = document.createElement('style');
    style.textContent = `
      .dragon-display canvas {
        width: 100% !important;
        height: 100% !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="flex items-center justify-center w-full relative">
      <motion.div
        className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px] pointer-events-auto relative"
        initial={beastAnimation.initial}
        animate={beastAnimation.animate}
        whileHover={beastAnimation.whileHover}
        style={{ overflow: 'visible' }}
      >
        <DragonDisplay 
          className="w-full h-full dragon-display"
          scale={0.5}
          position={[0, 0, 0]}
          animationSpeed={1}
          autoRotateSpeed={0.5}
          lighting="bright"
          triggerAction={triggerAction}
          style={{
            filter: 'brightness(1.2) saturate(1.05)',
            overflow: 'visible'
          }}
        />
      </motion.div>
    </div>
  );
};