import { useState, useCallback, useRef } from 'react';
import { EGG_ANIMATIONS, EGG_ANIMATION_CONFIG, type EggType } from './eggAnimation';

export type EggState = 'idle' | 'hatching' | 'completed';

interface UseEggAnimationReturn {
  currentFrame: string;
  frameIndex: number;
  eggState: EggState;
  isAnimating: boolean;
  startHatching: () => void;
  canClick: boolean;
  beastType: string;
}

export const useEggAnimation = (
  eggType: EggType
): UseEggAnimationReturn => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [eggState, setEggState] = useState<EggState>('idle');
  const [isAnimating, setIsAnimating] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const eggAnimation = EGG_ANIMATIONS[eggType];
  
  const startHatching = useCallback(() => {
    if (isAnimating || eggState !== 'idle') return;
    
    console.log(`🥚 Starting ${eggType} egg hatching animation (will hatch ${eggAnimation.beastType})...`);
    
    setEggState('hatching');
    setIsAnimating(true);
    setFrameIndex(0);
    
    let currentFrame = 0;
    
    // Animar los frames
    intervalRef.current = setInterval(() => {
      currentFrame++;
      
      if (currentFrame >= eggAnimation.hatchFrames.length) {
        // Animación completada
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        setIsAnimating(false);
        setEggState('completed');
        
        console.log(`✨ ${eggType} egg hatching completed! ${eggAnimation.beastType} born!`);
        
        // Ya no llamamos onHatchComplete automáticamente
        return;
      }
      
      setFrameIndex(currentFrame);
    }, EGG_ANIMATION_CONFIG.FRAME_DURATION);
    
  }, [eggType, eggAnimation.hatchFrames.length, eggAnimation.beastType, isAnimating, eggState]);
  
  // Cleanup en unmount
  useState(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  });
  
  // Frame actual a mostrar
  const currentFrame = eggState === 'idle' 
    ? eggAnimation.idleFrame 
    : eggAnimation.hatchFrames[frameIndex] || eggAnimation.idleFrame;
  
  // Solo se puede hacer click si está en idle
  const canClick = eggState === 'idle' && !isAnimating;
  
  return {
    currentFrame,
    frameIndex,
    eggState,
    isAnimating,
    startHatching,
    canClick,
    beastType: eggAnimation.beastType
  };
};