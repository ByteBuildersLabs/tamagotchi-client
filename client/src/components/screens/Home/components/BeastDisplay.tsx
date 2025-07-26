import React, { useState } from "react";
import { DragonDisplay } from "../../../shared/DragonDisplay";

export const BeastHomeDisplay = () => {
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
    setClickTrigger('jumping');
    
    // Clear the trigger after a short delay to allow re-triggering
    setTimeout(() => {
      setClickTrigger(null);
    }, 100);
  };

  return (
    <div className="flex-grow flex items-center justify-center w-full pointer-events-none select-none z-0 relative">
      <div 
        className="h-96 w-96 sm:h-[420px] sm:w-[420px] md:h-[480px] md:w-[480px] lg:h-[560px] lg:w-[560px] xl:h-[600px] xl:w-[600px] pointer-events-auto cursor-pointer"
        onClick={handleDragonClick}
        style={{ overflow: 'visible' }}
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
            position: 'relative'
          }}
        />
      </div>
    </div>
  );
};