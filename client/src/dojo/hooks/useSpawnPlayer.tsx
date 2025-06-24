import { useState, useCallback } from 'react';
import { useAccount } from '@starknet-react/core';
import { Account } from 'starknet';
import { v4 as uuidv4 } from 'uuid';
import { useDojoSDK } from '@dojoengine/sdk/react';

// Hooks imports
import { usePlayer } from './usePlayer';
import { useStarknetConnect } from './useStarknetConnect';

// Store import
import useAppStore from '../../zustand/store';

// Types
interface InitializationState {
  isInitializing: boolean;
  error: string | null;
  completed: boolean;
  step: 'checking' | 'spawning' | 'loading' | 'success';
  txHash: string | null;
  txStatus: 'PENDING' | 'SUCCESS' | 'REJECTED' | null;
}

interface InitializationResult {
  success: boolean;
  playerExists: boolean;
  transactionHash?: string;
  error?: string;
}

interface UseSpawnPlayerReturn {
  // State
  isInitializing: boolean;
  error: string | null;
  completed: boolean;
  currentStep: string;
  txHash: string | null;
  txStatus: 'PENDING' | 'SUCCESS' | 'REJECTED' | null;
  isConnected: boolean;
  playerExists: boolean;
  
  // Actions
  initializePlayer: () => Promise<InitializationResult>;
  resetInitializer: () => void;
}

/**
 * Hook coordinator for player spawning and initialization
 * Handles the complete flow of player verification and creation
 */
export const useSpawnPlayer = (): UseSpawnPlayerReturn => {
  const { useDojoStore, client } = useDojoSDK();
  const state = useDojoStore((state) => state);
  const { account } = useAccount();
  const { status } = useStarknetConnect();
  const { refetch: refetchPlayer } = usePlayer();

  // Local state for initialization process
  const [initState, setInitState] = useState<InitializationState>({
    isInitializing: false,
    error: null,
    completed: false,
    step: 'checking',
    txHash: null,
    txStatus: null,
  });

  // Tracking if we're currently initializing
  const [isInitializing, setIsInitializing] = useState(false);

  /**
   * Main initialization function
   * Checks if player exists, if not spawns a new one
   */
  const initializePlayer = useCallback(async (): Promise<InitializationResult> => {
    // Prevent multiple executions
    if (isInitializing) {
      return { success: false, playerExists: false, error: "Already initializing" };
    }

    setIsInitializing(true);

    // Validation: Check if wallet is connected
    if (status !== "connected") {
      const error = "Wallet not connected. Please connect your wallet first.";
      setInitState(prev => ({ ...prev, error }));
      setIsInitializing(false);
      return { success: false, playerExists: false, error };
    }

    // Validation: Check if account exists
    if (!account) {
      const error = "No account found. Please connect your wallet.";
      setInitState(prev => ({ ...prev, error }));
      setIsInitializing(false);
      return { success: false, playerExists: false, error };
    }

    const transactionId = uuidv4();
    
    try {
      // Start initialization
      setInitState(prev => ({ 
        ...prev, 
        isInitializing: true, 
        error: null,
        step: 'checking'
      }));

      // Step 1: Refetch player data to check if player exists
      await refetchPlayer();
      
      // Wait a bit to ensure data is loaded
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if player exists in the store
      const storePlayer = useAppStore.getState().player;
      const playerExists = storePlayer !== null;

      if (playerExists) {
        // Player exists - load data and continue
        
        setInitState(prev => ({ 
          ...prev, 
          step: 'loading'
        }));
        
        // Small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setInitState(prev => ({ 
          ...prev, 
          completed: true,
          isInitializing: false,
          step: 'success'
        }));

        setIsInitializing(false);
        return { success: true, playerExists: true };
      } else {
        // Player doesn't exist - spawn new player
        
        setInitState(prev => ({ 
          ...prev, 
          step: 'spawning',
          txStatus: 'PENDING'
        }));

        // Execute spawn player transaction using Dojo SDK
        const spawnTx = await client.player.spawnPlayer(account as Account);
        
        if (spawnTx?.transaction_hash) {
          setInitState(prev => ({ 
            ...prev, 
            txHash: spawnTx.transaction_hash
          }));
        }
        
        if (spawnTx && spawnTx.code === "SUCCESS") {
          
          setInitState(prev => ({ 
            ...prev, 
            txStatus: 'SUCCESS'
          }));
          
          // Wait for transaction to be processed
          await new Promise(resolve => setTimeout(resolve, 3500));
          
          // Refetch player data after spawning
          await refetchPlayer();
          
          // Verify player was created
          const newStorePlayer = useAppStore.getState().player;
          
          if (newStorePlayer) {
            
            setInitState(prev => ({ 
              ...prev, 
              completed: true,
              isInitializing: false,
              step: 'success'
            }));

            // Confirm transaction in store
            state.confirmTransaction(transactionId);

            setIsInitializing(false);
            return { 
              success: true, 
              playerExists: false,
              transactionHash: spawnTx.transaction_hash 
            };
          } else {
            throw new Error("Player spawn succeeded but player data not found");
          }
        } else {
          // Update transaction status to rejected
          setInitState(prev => ({ 
            ...prev, 
            txStatus: 'REJECTED'
          }));
          throw new Error("Spawn transaction failed with code: " + spawnTx?.code);
        }
      }
    } catch (error) {
      console.error("❌ Player initialization failed:", error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Revert optimistic update if applicable
      state.revertOptimisticUpdate(transactionId);
      
      // Update transaction status to rejected if there was a transaction
      if (initState.txHash) {
        setInitState(prev => ({ 
          ...prev, 
          txStatus: 'REJECTED'
        }));
      }
      
      if (errorMessage !== "Already initializing") {
        setInitState(prev => ({ 
          ...prev, 
          error: errorMessage,
          isInitializing: false,
          step: 'checking'
        }));
      } else {
        setInitState(prev => ({ 
          ...prev, 
          isInitializing: false,
          step: 'checking'
        }));
      }

      setIsInitializing(false);
      return { success: false, playerExists: false, error: errorMessage };
    }
  }, [status, account, refetchPlayer, isInitializing, client.player, state]);

  /**
   * Reset initialization state
   */
  const resetInitializer = useCallback(() => {
    setIsInitializing(false);
    setInitState({
      isInitializing: false,
      error: null,
      completed: false,
      step: 'checking',
      txHash: null,
      txStatus: null
    });
  }, []);

  return {
    // State
    isInitializing: initState.isInitializing,
    error: initState.error,
    completed: initState.completed,
    currentStep: initState.step,
    txHash: initState.txHash,
    txStatus: initState.txStatus,
    isConnected: status === "connected",
    playerExists: useAppStore.getState().player !== null,
    
    // Actions
    initializePlayer,
    resetInitializer,
  };
};