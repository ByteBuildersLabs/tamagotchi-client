import { useState, useEffect } from "react";

export const useCloudAnimation = (frames: string[]) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const hasMultipleFrames = frames.length > 1;

  useEffect(() => {
    if (!hasMultipleFrames || !isAnimating) return;

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 200);

    return () => clearInterval(interval);
  }, [hasMultipleFrames, isAnimating, frames.length]);

  const stopAnimation = () => {
    setIsAnimating(false);
    setFrameIndex(0);
  };

  const startAnimation = () => {
    setIsAnimating(true);
    setFrameIndex(0);
  };

  return {
    frameIndex,
    isAnimating,
    stopAnimation,
    startAnimation
  };
};