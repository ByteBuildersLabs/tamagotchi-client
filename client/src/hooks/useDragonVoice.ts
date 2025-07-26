import { useCallback, useRef } from 'react';

// Define available voice sounds
const VOICE_SOUNDS = {
  // All idle sounds for general animations
  idle: [
    '/vfx/idle1.wav',
    '/vfx/idle2.wav',
    '/vfx/idle3.wav',
    '/vfx/idle4.wav',
    '/vfx/idle5.wav',
    '/vfx/idle6.wav',
    '/vfx/idle7.wav'
  ],
  // Specific sleeping sound
  sleeping: '/vfx/sleeping.wav'
};

export const useDragonVoice = () => {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  
  const playVoiceForAnimation = useCallback((animationName: string) => {
    try {
      // Stop any currently playing audio to prevent overlap
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      }
      
      let soundPath: string;
      
      // Check if it's a sleeping animation
      if (animationName === 'Sleeping' || animationName === 'Laying Down') {
        soundPath = VOICE_SOUNDS.sleeping;
      } else {
        // For all other animations, use random idle sound
        const randomIndex = Math.floor(Math.random() * VOICE_SOUNDS.idle.length);
        soundPath = VOICE_SOUNDS.idle[randomIndex];
      }
      
      // Create and play audio
      const audio = new Audio(soundPath);
      audio.volume = (animationName === 'Sleeping' || animationName === 'Laying Down') ? 0.2 : 0.4; // Quieter for sleeping
      currentAudioRef.current = audio;
      
      audio.play().catch(() => {
        // Silent failure
      });
      
      // Clear reference when audio ends
      audio.addEventListener('ended', () => {
        if (currentAudioRef.current === audio) {
          currentAudioRef.current = null;
        }
      });
      
    } catch (error) {
      // Silent failure
    }
  }, []);

  return {
    playVoiceForAnimation
  };
}; 