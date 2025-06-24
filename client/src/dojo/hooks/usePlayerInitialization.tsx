import { useState, useCallback, useEffect } from 'react';
import { useSpawnPlayer } from './useSpawnPlayer';
import { useBeastStatus } from './useBeastStatus';
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
 * Handles both player spawn and beast verification
 * Decides appropriate navigation (Hatch vs Home)
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

  const {
    hasLiveBeast,
    isLoading: beastStatusLoading,
    error: beastStatusError,
    refetch: refetchBeastStatus
  } = useBeastStatus();

  // Get player from store
  const storePlayer = useAppStore(state => state.player);

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
   * Handles the complete flow: player spawn/check → beast check → navigation decision
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

      // Step 2: Check beast status
      // Small delay to ensure player data is in store
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Refetch beast status to get latest data
      await refetchBeastStatus();

      // Another small delay to ensure beast status is processed
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get fresh hasLiveBeast value directly from store instead of hook variable
      const currentStorePlayer = useAppStore.getState().player;
      const currentBeastStatuses = useAppStore.getState().beastStatuses;

      // Calculate hasLiveBeast directly from fresh store data
      const directHasLiveBeast = currentStorePlayer?.current_beast_id && 
        currentBeastStatuses.some(status => 
          status.beast_id === currentStorePlayer.current_beast_id && status.is_alive
        ) || false;

      // Step 3: Determine navigation
      const shouldGoToHome = directHasLiveBeast;
      const shouldGoToHatch = !directHasLiveBeast;

      // Step 4: Complete initialization
      setInitState(prev => ({
        ...prev,
        step: 'complete',
        completed: true,
        isInitializing: false,
        hasLiveBeast: directHasLiveBeast,
        shouldGoToHatch,
        shouldGoToHome
      }));

      return {
        success: true,
        playerExists: playerResult.playerExists,
        hasLiveBeast: directHasLiveBeast,
        shouldGoToHatch,
        shouldGoToHome
      };

    } catch (error: any) {
      const errorMessage = error?.message || "Complete initialization failed";
      
      console.error("Complete initialization failed:", error);

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
  }, [initializePlayer, hasLiveBeast, refetchBeastStatus, storePlayer?.current_beast_id]);

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
    if (playerError || beastStatusError) {
      const combinedError = playerError || (beastStatusError ? beastStatusError.message : null);
      setInitState(prev => ({
        ...prev,
        error: combinedError,
        isInitializing: false
      }));
    }
  }, [playerError, beastStatusError]);

  // Update hasLiveBeast when it changes
  useEffect(() => {
    setInitState(prev => ({
      ...prev,
      hasLiveBeast
    }));
  }, [hasLiveBeast]);

  return {
    // State
    isInitializing: initState.isInitializing || playerSpawning || beastStatusLoading,
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