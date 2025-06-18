import { useState } from "react";

export const useRainSystem = (duration: number = 20) => {
  const [isRainActive, setIsRainActive] = useState(false);

  const startRain = () => {
    setIsRainActive(true);
  };

  const stopRain = () => {
    setIsRainActive(false);
  };

  const handleRainComplete = () => {
    setIsRainActive(false);
    console.log(`Rain animation completed after ${duration} seconds!`);
  };

  return {
    isRainActive,
    startRain,
    stopRain,
    handleRainComplete,
    duration
  };
};