import { useState, useEffect } from "react";
import type { EggState } from "./useEggAnimation";

export const useMegaBurstEffect = (eggState: EggState) => {
  const [showMegaBurst, setShowMegaBurst] = useState(false);
  const [showFullScreenFlash, setShowFullScreenFlash] = useState(false);

  // MEGA-BURST EFFECT when the egg completes
  useEffect(() => {
    if (eggState === 'completed') {

      // Activate fullscreen flash immediately
      setShowFullScreenFlash(true);

      // Activate mega-burst simultaneously
      setShowMegaBurst(true);

      // Deactivate flash after 2.5s
      const flashTimeout = setTimeout(() => {
        setShowFullScreenFlash(false);
      }, 2500);

      // Deactivate mega-burst after 4s
      const burstTimeout = setTimeout(() => {
        setShowMegaBurst(false);
      }, 4000);

      return () => {
        clearTimeout(flashTimeout);
        clearTimeout(burstTimeout);
      };
    }
  }, [eggState]);

  return { showMegaBurst, showFullScreenFlash };
};