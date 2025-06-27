import { useState, useCallback, useEffect } from 'react';
import { useSpawnPlayer } from './useSpawnPlayer';
import { useLiveBeast } from './useLiveBeast';
import useAppStore from '../../zustand/store';

// Types
interface InitializationState {
  isInitializing: boolean;
  error: string | null;
  completed: boolean;
  step: 'idle' | 'spawning_player' | 'checking_beast' | 'complete';
  playerExists: boolean;
  hasLiveBeast: boolean;
  shouldGoToHatch: boolean;
  shouldGoToHome: boolean;
}

interface InitializationResult {
  success: boolean;
  playerExists: boolean;
  hasLiveBeast: boolean;
  shouldGoToHatch: boolean;
  shouldGoToHome: boolean;
  error?: string;
}

interface UsePlayerInitializationReturn {
  // State
  isInitializing: boolean;
  error: string | null;
  completed: boolean;
  currentStep: string;
  playerExists: boolean;
  hasLiveBeast: boolean;
  shouldGoToHatch: boolean;
  shouldGoToHome: boolean;
  
  // Player spawn state passthrough
  playerSpawnTxHash: string | null;
  playerSpawnTxStatus: 'PENDING' | 'SUCCESS' | 'REJECTED' | null;
  
  // Actions
  initializeComplete: () => Promise<InitializationResult>;
  resetInitialization: () => void;
}

/**
 * Coordinator hook for complete player initialization
 * Uses optimized live beast hook for efficient beast management
 */
export const usePlayerInitialization = (): UsePlayerInitializationReturn => {
  // Hooks dependencies
  const {
    initializePlayer,
    isInitializing: playerSpawning,
    error: playerError,
    txHash: playerTxHash,
    txStatus: playerTxStatus,
    resetInitializer: resetPlayerSpawn
  } = useSpawnPlayer();

  // Use optimized live beast hook
  const {
    hasLiveBeast,
    isLoading: liveBeastLoading,
    error: liveBeastError,
    refetch: refetchLiveBeast
  } = useLiveBeast();

  // Local state for coordination
  const [initState, setInitState] = useState<InitializationState>({
    isInitializing: false,
    error: null,
    completed: false,
    step: 'idle',
    playerExists: false,
    hasLiveBeast: false,
    shouldGoToHatch: false,
    shouldGoToHome: false,
  });

  /**
   * Main initialization coordinator function
   * Simplified logic using optimized live beast management
   */
  const initializeComplete = useCallback(async (): Promise<InitializationResult> => {
    try {
      setInitState(prev => ({
        ...prev,
        isInitializing: true,
        error: null,
        step: 'spawning_player',
        completed: false
      }));

      // Step 1: Initialize/spawn player
      const playerResult = await initializePlayer();

      if (!playerResult.success) {
        throw new Error(playerResult.error || "Player initialization failed");
      }

      setInitState(prev => ({
        ...prev,
        step: 'checking_beast',
        playerExists: playerResult.playerExists
      }));

      // Step 2: Check live beast status using optimized approach
      // Small delay to ensure player data is in store
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Refetch live beast data to get latest information
      await refetchLiveBeast();

      // Another small delay to ensure live beast data is processed
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get fresh hasLiveBeast value directly from store using optimized getter
      const currentHasLiveBeast = useAppStore.getState().hasLiveBeast();

      // Step 3: Determine navigation based on live beast status
      const shouldGoToHome = currentHasLiveBeast;
      const shouldGoToHatch = !currentHasLiveBeast;

      // Step 4: Complete initialization
      setInitState(prev => ({
        ...prev,
        step: 'complete',
        completed: true,
        isInitializing: false,
        hasLiveBeast: currentHasLiveBeast,
        shouldGoToHatch,
        shouldGoToHome
      }));

      return {
        success: true,
        playerExists: playerResult.playerExists,
        hasLiveBeast: currentHasLiveBeast,
        shouldGoToHatch,
        shouldGoToHome
      };

    } catch (error: any) {
      const errorMessage = error?.message || "Complete initialization failed";

      setInitState(prev => ({
        ...prev,
        error: errorMessage,
        isInitializing: false,
        step: 'idle',
        completed: false
      }));

      return {
        success: false,
        playerExists: false,
        hasLiveBeast: false,
        shouldGoToHatch: false,
        shouldGoToHome: false,
        error: errorMessage
      };
    }
  }, [initializePlayer, refetchLiveBeast]);

  /**
   * Reset all initialization state
   */
  const resetInitialization = useCallback(() => {
    // Reset our local state
    setInitState({
      isInitializing: false,
      error: null,
      completed: false,
      step: 'idle',
      playerExists: false,
      hasLiveBeast: false,
      shouldGoToHatch: false,
      shouldGoToHome: false,
    });

    // Reset player spawn state
    resetPlayerSpawn();
  }, [resetPlayerSpawn]);

  // Update state when dependencies change
  useEffect(() => {
    if (playerError || liveBeastError) {
      const combinedError = playerError || (liveBeastError ? liveBeastError.message : null);
      setInitState(prev => ({
        ...prev,
        error: combinedError,
        isInitializing: false
      }));
    }
  }, [playerError, liveBeastError]);

  // Update hasLiveBeast when it changes
  useEffect(() => {
    setInitState(prev => ({
      ...prev,
      hasLiveBeast
    }));
  }, [hasLiveBeast]);

  return {
    // State
    isInitializing: initState.isInitializing || playerSpawning || liveBeastLoading,
    error: initState.error,
    completed: initState.completed,
    currentStep: initState.step,
    playerExists: initState.playerExists,
    hasLiveBeast: initState.hasLiveBeast,
    shouldGoToHatch: initState.shouldGoToHatch,
    shouldGoToHome: initState.shouldGoToHome,
    
    // Player spawn state passthrough
    playerSpawnTxHash: playerTxHash,
    playerSpawnTxStatus: playerTxStatus,
    
    // Actions
    initializeComplete,
    resetInitialization,
  };
};