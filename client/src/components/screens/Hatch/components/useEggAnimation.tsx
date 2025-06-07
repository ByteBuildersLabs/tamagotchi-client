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
  showBeast: boolean;
  // 🌟 Nuevas props para efectos progresivos
  lightIntensity: number; // 0-100
  particleIntensity: number; // 0-100
  shouldBurst: boolean;
  glowLevel: number; // 0-5 para diferentes niveles de glow
}

// Mapeo de frame a intensidad de efectos
const FRAME_EFFECTS_MAP: Record<number, { light: number; particles: number; glow: number }> = {
  0: { light: 0, particles: 0, glow: 0 },    // Idle
  1: { light: 15, particles: 10, glow: 1 },  // Primer temblor
  2: { light: 25, particles: 20, glow: 1 },  // Chispeo tenue
  3: { light: 40, particles: 35, glow: 2 },  // Destellos dorados
  4: { light: 60, particles: 50, glow: 3 },  // Rayos de luz suaves
  5: { light: 80, particles: 70, glow: 4 },  // Pulso de iluminación
  6: { light: 95, particles: 85, glow: 5 },  // Pre-explosión
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
    
    // Animar los frames con efectos progresivos
    intervalRef.current = setInterval(() => {
      currentFrame++;
      
      console.log(`🎯 Frame ${currentFrame} - Effects: Light ${FRAME_EFFECTS_MAP[currentFrame]?.light || 0}, Particles ${FRAME_EFFECTS_MAP[currentFrame]?.particles || 0}`);
      
      if (currentFrame >= eggAnimation.hatchFrames.length) {
        // Animación completada - BURST!
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        setIsAnimating(false);
        setEggState('completed');
        setShouldBurst(true); // 🎆 TRIGGER DEL BURST FINAL
        
        console.log(`💥 ${eggType} egg BURST! Ultimate effects activated!`);
        
        // Esperar y luego revelar la bestia
        timeoutRef.current = setTimeout(() => {
          console.log(`🐺 Revealing ${eggAnimation.beastType}...`);
          setEggState('revealing');
          setShowBeast(true);
          setShouldBurst(false); // Desactivar burst tras revelar
        }, EGG_ANIMATION_CONFIG.BEAST_REVEAL_DELAY + 1000); // +1s para que termine el burst
        
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
  
  // 🌟 Calcular intensidades de efectos basado en el frame actual
  const currentEffects = eggState === 'hatching' 
    ? (FRAME_EFFECTS_MAP[frameIndex] || { light: 0, particles: 0, glow: 0 })
    : { light: 0, particles: 0, glow: 0 };
  
  // Si está en completed, máxima intensidad antes del burst
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
    // 🌟 Nuevos valores para efectos
    lightIntensity,
    particleIntensity,
    shouldBurst,
    glowLevel
  };
};