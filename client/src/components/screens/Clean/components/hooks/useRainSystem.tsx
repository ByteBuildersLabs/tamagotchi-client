import { useState, useCallback, useRef, useEffect } from "react";

export const useRainSystem = (duration: number = 3) => {
  const [isRainActive, setIsRainActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rainCountRef = useRef(0);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const startRain = useCallback(() => {
    // Clear any existing timeout before starting new rain
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    rainCountRef.current += 1;
    
    // Set rain active immediately
    setIsRainActive(true);

    // Auto-stop rain after duration
    timeoutRef.current = setTimeout(() => {
      setIsRainActive(false);
      timeoutRef.current = null;
    }, duration * 1000);
  }, [duration]);

  const stopRain = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsRainActive(false);
  }, []);

  const handleRainComplete = useCallback(() => {
    // Ensure rain is stopped
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsRainActive(false);
  }, []);

  return {
    isRainActive,
    startRain,
    stopRain,
    handleRainComplete,
    duration
  };
};