import React from "react";
import { DragonDisplay } from "../../../shared/DragonDisplay";

export const BeastHomeDisplay = () => {
  return (
    <div className="flex-grow flex items-center justify-center w-full pointer-events-none select-none z-0 relative">
      <DragonDisplay 
        className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px]"
        scale={0.5}
        position={[0, 0, 0]}
        animationSpeed={1}
        autoRotateSpeed={0.5}
        lighting="bright"
      />
    </div>
  );
};