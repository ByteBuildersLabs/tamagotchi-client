import { useState, useCallback } from 'react';
import { useAccount } from '@starknet-react/core';
import { Account } from 'starknet';
import { useDojoSDK } from '@dojoengine/sdk/react';

// Hooks imports
import { useBeasts } from './useBeasts';
import { useBeastStatus } from './useBeastStatus';
import { usePlayer } from './usePlayer';
import { useStarknetConnect } from './useStarknetConnect';

// Helpers imports
import { 
  generateRandomBeastParams, 
  validateBeastParams,
  type BeastSpawnParams 
} from '../../utils/beastHelpers';

// Store import
import useAppStore from '../../zustand/store';

// Types
interface SpawnState {
  isSpawning: boolean;
  error: string | null;
  completed: boolean;
  step: 'preparing' | 'spawning' | 'confirming' | 'fetching' | 'success';
  txHash: string | null;
  txStatus: 'PENDING' | 'SUCCESS' | 'REJECTED' | null;
  spawnedBeastParams: BeastSpawnParams | null;
}

interface SpawnResult {
  success: boolean;
  transactionHash?: string;
  beastParams?: BeastSpawnParams;
  error?: string;
}

interface UseSpawnBeastReturn {
  // State
  isSpawning: boolean;
  error: string | null;
  completed: boolean;
  currentStep: string;
  txHash: string | null;
  txStatus: 'PENDING' | 'SUCCESS' | 'REJECTED' | null;
  spawnedBeastParams: BeastSpawnParams | null;
  
  // Actions
  spawnBeast: () => Promise<SpawnResult>;
  resetSpawner: () => void;
}

/**
 * Hook for spawning beasts in the Dojo contracts
 * Handles the complete flow of beast creation including transaction and data refresh
 */
export const useSpawnBeast = (): UseSpawnBeastReturn => {
  const { useDojoStore, client } = useDojoSDK();
  const state = useDojoStore((state) => state);
  const { account } = useAccount();
  const { status } = useStarknetConnect();
  const { refetch: refetchBeasts } = useBeasts();
  const { refetch: refetchBeastStatus } = useBeastStatus();
  const { refetch: refetchPlayer } = usePlayer();

  // Local state for spawn process
  const [spawnState, setSpawnState] = useState<SpawnState>({
    isSpawning: false,
    error: null,
    completed: false,
    step: 'preparing',
    txHash: null,
    txStatus: null,
    spawnedBeastParams: null,
  });

  // Get player from store
  const storePlayer = useAppStore(state => state.player);

  /**
   * Internal spawn beast function
   * Handles the actual contract interaction
   */
  const executeSpawnBeast = useCallback(async (params: BeastSpawnParams): Promise<SpawnResult> => {
    // Validation: Check if wallet is connected
    if (status !== "connected") {
      const error = "Wallet not connected. Please connect your wallet first.";
      setSpawnState(prev => ({ ...prev, error }));
      return { success: false, error };
    }

    // Validation: Check if account exists
    if (!account) {
      const error = "No account found. Please connect your wallet.";
      setSpawnState(prev => ({ ...prev, error }));
      return { success: false, error };
    }

    // Validation: Check if player exists
    if (!storePlayer) {
      const error = "Player not found. Please spawn player first.";
      setSpawnState(prev => ({ ...prev, error }));
      return { success: false, error };
    }

    // Validation: Check beast parameters
    if (!validateBeastParams(params)) {
      const error = "Invalid beast parameters. Specie and beast_type must be 1-3.";
      setSpawnState(prev => ({ ...prev, error }));
      return { success: false, error };
    }

    try {
      setSpawnState(prev => ({
        ...prev,
        isSpawning: true,
        error: null,
        step: 'preparing',
        spawnedBeastParams: params
      }));

      // Step 1: Prepare transaction
      setSpawnState(prev => ({ ...prev, step: 'spawning' }));

      // Execute spawn_beast transaction
      const tx = await client.game.spawnBeast(
        account as Account,
        params.specie,
        params.beast_type
      );
      
      setSpawnState(prev => ({
        ...prev,
        txHash: tx.transaction_hash,
        txStatus: 'PENDING',
        step: 'confirming'
      }));

      // Step 2: Wait for transaction confirmation
      if (tx && tx.code === "SUCCESS") {
        setSpawnState(prev => ({
          ...prev,
          txStatus: 'SUCCESS',
          step: 'fetching'
        }));

        // Step 3: Wait for transaction to be processed
        await new Promise(resolve => setTimeout(resolve, 3500));
        
        // Step 4: Refresh beast data with retry logic
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
          await Promise.all([
            refetchPlayer(),    // Refetch player data to get updated current_beast_id
            refetchBeasts(),
            refetchBeastStatus()
          ]);
          
          // Small delay to check if data was loaded
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if beast is now live by reading directly from store
          const freshStorePlayer = useAppStore.getState().player;
          const freshBeastStatuses = useAppStore.getState().beastStatuses;
          
          const isNowLive = freshStorePlayer?.current_beast_id && 
            freshBeastStatuses.some(status => 
              status.beast_id === freshStorePlayer.current_beast_id && status.is_alive
            );
          
          // If beast is live, we can exit early
          if (isNowLive) {
            break;
          }
          
          attempts++;
          
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }

        // Step 5: Final check - verify beast is live using fresh store data
        const finalStorePlayer = useAppStore.getState().player;
        const finalBeastStatuses = useAppStore.getState().beastStatuses;
        
        const isBeastLive = finalStorePlayer?.current_beast_id && 
          finalBeastStatuses.some(status => 
            status.beast_id === finalStorePlayer.current_beast_id && status.is_alive
          );

        // Step 6: Complete
        setSpawnState(prev => ({
          ...prev,
          completed: !!isBeastLive, // Ensure completed is always a boolean
          step: 'success',
          isSpawning: false
        }));

        return {
          success: true,
          transactionHash: tx.transaction_hash,
          beastParams: params
        };
      } else {
        // Update transaction status to rejected
        setSpawnState(prev => ({
          ...prev,
          txStatus: 'REJECTED'
        }));
        throw new Error("Spawn transaction failed with code: " + tx?.code);
      }

    } catch (error: any) {
      console.error("Error spawning beast:", error);
      
      const errorMessage = error?.message || error?.toString() || "Unknown error occurred";
      
      setSpawnState(prev => ({
        ...prev,
        error: errorMessage,
        txStatus: 'REJECTED',
        isSpawning: false
      }));

      return {
        success: false,
        error: errorMessage
      };
    }
  }, [account, status, storePlayer, client, state, refetchBeasts, refetchBeastStatus, refetchPlayer]);

  /**
   * Spawn beast with random parameters
   */
  const spawnBeast = useCallback(async (): Promise<SpawnResult> => {
    const params = generateRandomBeastParams();
    return executeSpawnBeast(params);
  }, [executeSpawnBeast]);

  /**
   * Reset the spawner state
   */
  const resetSpawner = useCallback(() => {
    setSpawnState({
      isSpawning: false,
      error: null,
      completed: false,
      step: 'preparing',
      txHash: null,
      txStatus: null,
      spawnedBeastParams: null,
    });
  }, []);

  return {
    // State
    isSpawning: spawnState.isSpawning,
    error: spawnState.error,
    completed: spawnState.completed,
    currentStep: spawnState.step,
    txHash: spawnState.txHash,
    txStatus: spawnState.txStatus,
    spawnedBeastParams: spawnState.spawnedBeastParams,
    
    // Actions
    spawnBeast,
    resetSpawner,
  };
};