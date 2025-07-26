import { motion } from "framer-motion";
import React, { useState } from "react";
import { DragonDisplay } from "../../../shared/DragonDisplay";

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

export const BeastPlayDisplay = () => {
  const [clickTrigger, setClickTrigger] = useState<'jumping' | null>(null);

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

  const handleDragonClick = () => {
    console.info("🦘 Dragon clicked! Triggering jumping animation");
    setClickTrigger('jumping');
    
    // Clear the trigger after a short delay to allow re-triggering
    setTimeout(() => {
      setClickTrigger(null);
    }, 100);
  };

  return (
    <div className="flex-1 flex items-center justify-center w-full pointer-events-none select-none z-0 relative">
      <motion.div
        className="h-64 w-64 sm:h-72 sm:w-72 md:h-80 md:w-80 lg:h-[360px] lg:w-[360px] pointer-events-auto relative cursor-pointer"
        initial={beastAnimation.initial}
        animate={beastAnimation.animate}
        whileHover={beastAnimation.whileHover}
        style={{ overflow: 'visible' }}
        onClick={handleDragonClick}
      >
        <DragonDisplay 
          className="w-full h-full dragon-display"
          scale={0.35}
          position={[0, 0, 0]}
          animationSpeed={1}
          autoRotateSpeed={0.5}
          lighting="bright"
          triggerAction={clickTrigger}
          style={{
            filter: 'brightness(1.2) saturate(1.05)',
            overflow: 'visible',
            position: 'relative',
            top: '100px'
          }}
        />
      </motion.div>
    </div>
  );
};