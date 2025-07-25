import { useState, useCallback } from 'react';

// Hooks imports
import { usePlayer } from './usePlayer';

// Store import
import useAppStore from '../../zustand/store';

// Chipi imports
import { useChipiContractCall } from './useChipiContractCall';
import { useChipiWallet } from './useChipiWallet';

// Types (mantiene exactamente las mismas interfaces)
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
 * Hook coordinator for player spawning and initialization using Chipi SDK
 * 🔄 MIGRACIÓN: Cartridge Controller → Chipi SDK
 * 
 * Mantiene exactamente la misma interfaz que useSpawnPlayer original
 * para evitar breaking changes en los componentes
 */
export const useChipiSpawnPlayer = (): UseSpawnPlayerReturn => {
  
  // ✅ Estado real de conexión desde Chipi/Worldcoin
  const { isConnected, walletAddress } = useChipiWallet();
  const { refetch: refetchPlayer } = usePlayer();

  // Local state for initialization process (misma lógica que original)
  const [initState, setInitState] = useState<InitializationState>({
    isInitializing: false,
    error: null,
    completed: false,
    step: 'checking',
    txHash: null,
    txStatus: null,
  });

  // Tracking if we're currently initializing (mismo que original)
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Check player existence (mismo que original)
  const storePlayer = useAppStore(state => state.player);
  const playerExists = Boolean(storePlayer && storePlayer.address === walletAddress);

  // Chipi contract call hook
  const { executeCall } = useChipiContractCall({
    showToast: false, // Manejamos los toasts manualmente como en el original
    onSuccess: (result) => {
      console.log('✅ Spawn Player transaction successful:', result);
    },
    onError: (error) => {
      console.error('❌ Spawn Player transaction failed:', error);
    }
  });

  /**
   * Enhanced player data polling with retry mechanism
   * (mantiene exactamente la misma lógica que original)
   */
  const waitForPlayerData = useCallback(async (maxAttempts = 8, delayMs = 2000): Promise<boolean> => {
    console.log('🔄 Starting player data polling...', { maxAttempts, delayMs });
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`🔍 Player polling attempt ${attempt}/${maxAttempts}`);
      
      try {
        // Refetch player data
        await refetchPlayer();
        
        // Small delay for store update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if player exists in store
        const storePlayer = useAppStore.getState().player;
        
        console.log(`📊 Attempt ${attempt} store check:`, {
          playerExists: !!storePlayer,
          playerAddress: storePlayer?.address,
          walletAddress
        });
        
        if (storePlayer) {
          // Verify the player belongs to current wallet
          if (storePlayer.address === walletAddress) {
            console.log('✅ Player data found and verified for current wallet');
            return true;
          } else {
            console.log('⚠️ Player found but address mismatch:', {
              storeAddress: storePlayer.address,
              walletAddress
            });
          }
        }
        
        // Wait before next attempt (except for last attempt)
        if (attempt < maxAttempts) {
          console.log(`⏳ Waiting ${delayMs}ms before next attempt...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
        
      } catch (error) {
        console.error(`❌ Error in polling attempt ${attempt}:`, error);
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }
    
    console.log('❌ Player data polling exhausted all attempts');
    return false;
  }, [refetchPlayer, walletAddress]);

  /**
   * Main initialization function
   * Checks if player exists, if not spawns a new one
   * (mantiene exactamente la misma lógica que original)
   */
  const initializePlayer = useCallback(async (): Promise<InitializationResult> => {
    console.log('🚀 Starting player initialization process with Chipi...');
    
    // Prevent multiple executions
    if (isInitializing) {
      console.log('⚠️ Already initializing - skipping');
      return { success: false, playerExists: false, error: "Already initializing" };
    }

    setIsInitializing(true);

    // Validation: Check if wallet is connected
    if (!isConnected || !walletAddress) {
      const error = "Wallet not connected. Please connect your wallet first.";
      console.log('❌ Wallet not connected');
      setInitState(prev => ({ ...prev, error }));
      setIsInitializing(false);
      return { success: false, playerExists: false, error };
    }

    try {
      setInitState(prev => ({
        ...prev,
        isInitializing: true,
        error: null,
        step: 'checking'
      }));

      // Step 1: Check if player already exists
      console.log('🔍 Checking if player exists...');
      console.log('📊 Current player state:', {
        storePlayer: !!storePlayer,
        playerAddress: storePlayer?.address,
        walletAddress,
        addressMatch: storePlayer?.address === walletAddress
      });

      // If player already exists and matches current wallet, we're done
      if (storePlayer && storePlayer.address === walletAddress) {
        console.log('✅ Player already exists for current wallet');
        setInitState(prev => ({
          ...prev,
          completed: true,
          step: 'success',
          isInitializing: false
        }));
        setIsInitializing(false);
        return { 
          success: true, 
          playerExists: true,
          transactionHash: undefined // No transaction needed
        };
      }

      // Step 2: Player doesn't exist, need to spawn
      console.log('🌱 Player not found, spawning new player...');
      setInitState(prev => ({ ...prev, step: 'spawning' }));

      // 🔄 MIGRACIÓN: client.player.spawnPlayer() → executeCall con Chipi
      const result = await executeCall({
        contractName: 'player',
        entrypoint: 'spawn_player',
        calldata: [] // En Dojo: client.player.spawnPlayer(account) - no necesita parámetros adicionales
      });

      if (!result.success) {
        throw new Error(result.error || 'Spawn player transaction failed');
      }

      setInitState(prev => ({
        ...prev,
        txHash: result.transactionHash!,
        txStatus: 'SUCCESS',
        step: 'loading'
      }));

      console.log('✅ Spawn player transaction successful:', result.transactionHash);

      // Step 3: Wait for player data to be available
      console.log('🔄 Waiting for player data synchronization...');
      const playerDataFound = await waitForPlayerData();

      if (playerDataFound) {
        console.log('✅ Player initialization completed successfully');
        setInitState(prev => ({
          ...prev,
          completed: true,
          step: 'success',
          isInitializing: false
        }));
        setIsInitializing(false);
        
        return {
          success: true,
          playerExists: true,
          transactionHash: result.transactionHash
        };
      } else {
        // Data sync incomplete but transaction succeeded
        console.log('⚠️ Transaction succeeded but player data sync incomplete');
        setInitState(prev => ({
          ...prev,
          completed: false,
          isInitializing: false,
          error: 'Player created but data sync incomplete'
        }));
        setIsInitializing(false);
        
        return {
          success: true, // Transaction succeeded
          playerExists: false, // But data not yet visible
          transactionHash: result.transactionHash,
          error: 'Player created but data sync incomplete'
        };
      }

    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || "Unknown error occurred";
      
      console.error('❌ Player initialization failed:', errorMessage);
      
      setInitState(prev => ({
        ...prev,
        error: errorMessage,
        txStatus: 'REJECTED',
        isInitializing: false
      }));
      setIsInitializing(false);

      return {
        success: false,
        playerExists: false,
        error: errorMessage
      };
    }
  }, [isConnected, walletAddress, storePlayer, executeCall, waitForPlayerData]);

  /**
   * Reset the initializer state (mantiene misma lógica)
   */
  const resetInitializer = useCallback(() => {
    setInitState({
      isInitializing: false,
      error: null,
      completed: false,
      step: 'checking',
      txHash: null,
      txStatus: null,
    });
    setIsInitializing(false);
  }, []);

  return {
    // State (misma interfaz)
    isInitializing: initState.isInitializing,
    error: initState.error,
    completed: initState.completed,
    currentStep: initState.step,
    txHash: initState.txHash,
    txStatus: initState.txStatus,
    isConnected,
    playerExists,
    
    // Actions (misma interfaz)
    initializePlayer,
    resetInitializer,
  };
};