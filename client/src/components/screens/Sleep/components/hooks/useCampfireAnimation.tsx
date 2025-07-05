import { useState, useEffect, useCallback } from "react";

interface CampfireAnimationConfig {
  litFrames: string[];
  extinguishedFrames: string[];
  animationInterval?: number;
}

export const useCampfireAnimation = ({ 
  litFrames, 
  extinguishedFrames, 
  animationInterval = 700 
}: CampfireAnimationConfig) => {
  const [litFrameIndex, setLitFrameIndex] = useState(0);
  const [extinguishedFrameIndex, setExtinguishedFrameIndex] = useState(0);
  const [isLitAnimating, setIsLitAnimating] = useState(true);
  const [isExtinguishedAnimating, setIsExtinguishedAnimating] = useState(false);

  const hasMultipleLitFrames = litFrames.length > 1;
  const hasMultipleExtinguishedFrames = extinguishedFrames.length > 1;

  // Animate lit frames
  useEffect(() => {
    if (!hasMultipleLitFrames || !isLitAnimating) return;

    const interval = setInterval(() => {
      setLitFrameIndex((prev) => (prev + 1) % litFrames.length);
    }, animationInterval);

    return () => clearInterval(interval);
  }, [hasMultipleLitFrames, isLitAnimating, litFrames.length, animationInterval]);

  // Animate extinguished frames
  useEffect(() => {
    if (!hasMultipleExtinguishedFrames || !isExtinguishedAnimating) return;

    const interval = setInterval(() => {
      setExtinguishedFrameIndex((prev) => (prev + 1) % extinguishedFrames.length);
    }, animationInterval);

    return () => clearInterval(interval);
  }, [hasMultipleExtinguishedFrames, isExtinguishedAnimating, extinguishedFrames.length, animationInterval]);

  const startLitAnimation = useCallback(() => {
    if (isLitAnimating) return;
    
    setIsExtinguishedAnimating(false);
    setIsLitAnimating(true);
  }, [isLitAnimating]);

  const startExtinguishedAnimation = useCallback(() => {
    if (isExtinguishedAnimating) return; 
    
    setIsLitAnimating(false);
    setIsExtinguishedAnimating(true);
  }, [isExtinguishedAnimating]);

  return {
    litFrameIndex,
    extinguishedFrameIndex,
    isLitAnimating,
    isExtinguishedAnimating,
    startLitAnimation,
    startExtinguishedAnimation
  };
};