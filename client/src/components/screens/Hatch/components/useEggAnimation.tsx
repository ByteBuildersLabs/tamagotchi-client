import { useState, useCallback, useRef } from 'react';
import { EGG_ANIMATIONS, EGG_ANIMATION_CONFIG, type EggType } from './eggAnimation';

export type EggState = 'idle' | 'hatching' | 'completed' | 'revealing';

interface UseEggAnimationReturn {
  currentFrame: string;
  frameIndex: number;
  eggState: EggState;
  isAnimating: boolean;
  startHatching: () => void;
  canClick: boolean;
  beastType: string;
  beastAsset: string;
  showBeast: boolean; // Nueva prop para mostrar la bestia
}

export const useEggAnimation = (
  eggType: EggType
): UseEggAnimationReturn => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [eggState, setEggState] = useState<EggState>('idle');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showBeast, setShowBeast] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const eggAnimation = EGG_ANIMATIONS[eggType];
  
  const startHatching = useCallback(() => {
    if (isAnimating || eggState !== 'idle') return;
    
    console.log(`🥚 Starting ${eggType} egg hatching animation (will hatch ${eggAnimation.beastType})...`);
    
    setEggState('hatching');
    setIsAnimating(true);
    setFrameIndex(0);
    setShowBeast(false);
    
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
        
        // Esperar un poco y luego revelar la bestia
        timeoutRef.current = setTimeout(() => {
          console.log(`🐺 Revealing ${eggAnimation.beastType}...`);
          setEggState('revealing');
          setShowBeast(true);
        }, EGG_ANIMATION_CONFIG.BEAST_REVEAL_DELAY);
        
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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
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
    beastType: eggAnimation.beastType,
    beastAsset: eggAnimation.beastAsset,
    showBeast
  };
};