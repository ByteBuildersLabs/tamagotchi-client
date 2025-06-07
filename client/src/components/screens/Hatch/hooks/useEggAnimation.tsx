import { useState, useCallback, useRef } from 'react';
import { EGG_ANIMATIONS, EGG_ANIMATION_CONFIG, type EggType } from '../components/eggAnimation';

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
  showBeast: boolean;
  // 🌟 New props for progressive effects
  lightIntensity: number; // 0-100
  particleIntensity: number; // 0-100
  shouldBurst: boolean;
  glowLevel: number; // 0-5 for different glow levels
}

// Mapping from frame to effect intensity
const FRAME_EFFECTS_MAP: Record<number, { light: number; particles: number; glow: number }> = {
  0: { light: 0, particles: 0, glow: 0 },    // Idle
  1: { light: 15, particles: 10, glow: 1 },  // First shake
  2: { light: 25, particles: 20, glow: 1 },  // Faint spark
  3: { light: 40, particles: 35, glow: 2 },  // Golden flashes
  4: { light: 60, particles: 50, glow: 3 },  // Soft light rays
  5: { light: 80, particles: 70, glow: 4 },  // Lighting pulse
  6: { light: 95, particles: 85, glow: 5 },  // Pre-explosion
};

export const useEggAnimation = (
  eggType: EggType
): UseEggAnimationReturn => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [eggState, setEggState] = useState<EggState>('idle');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showBeast, setShowBeast] = useState(false);
  const [shouldBurst, setShouldBurst] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const eggAnimation = EGG_ANIMATIONS[eggType];
  
  const startHatching = useCallback(() => {
    if (isAnimating || eggState !== 'idle') return;
    
    console.log(`🥚 Starting ULTIMATE ${eggType} egg hatching animation...`);
    
    setEggState('hatching');
    setIsAnimating(true);
    setFrameIndex(0);
    setShowBeast(false);
    setShouldBurst(false);
    
    let currentFrame = 0;
    
    // Animate frames with progressive effects
    intervalRef.current = setInterval(() => {
      currentFrame++;
      
      console.log(`🎯 Frame ${currentFrame} - Effects: Light ${FRAME_EFFECTS_MAP[currentFrame]?.light || 0}, Particles ${FRAME_EFFECTS_MAP[currentFrame]?.particles || 0}`);
      
      if (currentFrame >= eggAnimation.hatchFrames.length) {
        // Animation completed - BURST!
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        setIsAnimating(false);
        setEggState('completed');
        setShouldBurst(true); // 🎆 TRIGGER FINAL BURST
        
        console.log(`💥 ${eggType} egg BURST! Ultimate effects activated!`);
        
        // Wait and then reveal the beast
        timeoutRef.current = setTimeout(() => {
          console.log(`🐺 Revealing ${eggAnimation.beastType}...`);
          setEggState('revealing');
          setShowBeast(true);
          setShouldBurst(false); // Deactivate burst after reveal
        }, EGG_ANIMATION_CONFIG.BEAST_REVEAL_DELAY + 1000); // +1s for burst to finish
        
        return;
      }
      
      setFrameIndex(currentFrame);
    }, EGG_ANIMATION_CONFIG.FRAME_DURATION);
    
  }, [eggType, eggAnimation.hatchFrames.length, eggAnimation.beastType, isAnimating, eggState]);
  
  // Cleanup on unmount
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
  
  // Current frame to display
  const currentFrame = eggState === 'idle' 
    ? eggAnimation.idleFrame 
    : eggAnimation.hatchFrames[frameIndex] || eggAnimation.idleFrame;
  
  // Can only click if in idle
  const canClick = eggState === 'idle' && !isAnimating;
  
  // 🌟 Calculate effect intensities based on current frame
  const currentEffects = eggState === 'hatching' 
    ? (FRAME_EFFECTS_MAP[frameIndex] || { light: 0, particles: 0, glow: 0 })
    : { light: 0, particles: 0, glow: 0 };
  
  // If completed, max intensity before burst
  const lightIntensity = eggState === 'completed' ? 100 : currentEffects.light;
  const particleIntensity = eggState === 'completed' ? 100 : currentEffects.particles;
  const glowLevel = eggState === 'completed' ? 5 : currentEffects.glow;
  
  return {
    currentFrame,
    frameIndex,
    eggState,
    isAnimating,
    startHatching,
    canClick,
    beastType: eggAnimation.beastType,
    beastAsset: eggAnimation.beastAsset,
    showBeast,
    // 🌟 New values for effects
    lightIntensity,
    particleIntensity,
    shouldBurst,
    glowLevel
  };
};