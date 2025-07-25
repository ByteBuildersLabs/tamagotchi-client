import React from "react";
import { DragonDisplay } from "../../../shared/DragonDisplay";

export const BeastHomeDisplay = () => {
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
    <div className="flex-grow flex items-center justify-center w-full pointer-events-none select-none z-0 relative">
      <DragonDisplay 
        className="w-full h-full dragon-display"
        scale={0.5}
        position={[0, 0, 0]}
        animationSpeed={1}
        autoRotateSpeed={0.5}
        lighting="bright"
        style={{
          filter: 'brightness(1.2) saturate(1.05)',
          overflow: 'visible'
        }}
      />
    </div>
  );
};