import { useState, useCallback } from 'react';

// Hooks imports
import { useLiveBeast } from './useLiveBeast';
import { usePlayer } from './usePlayer';
import { usePostSpawnSync } from './usePostSpawnSync'; 

// Helpers imports
import { 
  generateRandomBeastParams, 
  validateBeastParams,
  type BeastSpawnParams 
} from '../../utils/beastHelpers';

// Store import
import useAppStore from '../../zustand/store';

// Chipi imports
import { useChipiContractCall } from './useChipiContractCall';
import { useChipiWallet } from './useChipiWallet';

// Types (mantiene exactamente las mismas interfaces)
interface SpawnState {
  isSpawning: boolean;
  error: string | null;
  completed: boolean;
  step: 'preparing' | 'spawning' | 'confirming' | 'syncing' | 'success';
  txHash: string | null;
  txStatus: 'PENDING' | 'SUCCESS' | 'REJECTED' | null;
  spawnedBeastParams: BeastSpawnParams | null;
  syncSuccess: boolean; 
}

interface SpawnResult {
  success: boolean;
  transactionHash?: string;
  beastParams?: BeastSpawnParams;
  syncSuccess?: boolean; 
  finalBeastId?: number | null; 
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
  syncSuccess: boolean; 
  
  // Actions
  spawnBeast: (params?: BeastSpawnParams) => Promise<SpawnResult>; 
  resetSpawner: () => void;
}

/**
 * Hook for spawning beasts using Chipi SDK with automatic post-spawn sync
 * 🔄 MIGRACIÓN: Cartridge Controller → Chipi SDK
 * 
 * Mantiene exactamente la misma interfaz que useSpawnBeast original
 * para evitar breaking changes en los componentes
 */
export const useChipiSpawnBeast = (): UseSpawnBeastReturn => {
  
  // ✅ Estado real de conexión desde Chipi/Worldcoin
  const { isConnected, walletAddress } = useChipiWallet();
  
  // Use optimized hooks for data management (mismos que original)
  const { refetch: refetchLiveBeast } = useLiveBeast();
  const { refetch: refetchPlayer } = usePlayer();
  
  // Post-spawn sync hook (mismo que original)
  const { syncAfterSpawn } = usePostSpawnSync();

  // Enhanced local state for spawn process (misma lógica que original)
  const [spawnState, setSpawnState] = useState<SpawnState>({
    isSpawning: false,
    error: null,
    completed: false,
    step: 'preparing',
    txHash: null,
    txStatus: null,
    spawnedBeastParams: null,
    syncSuccess: false, 
  });

  // Get player from store (mismo que original)
  const storePlayer = useAppStore(state => state.player);

  // Chipi contract call hook
  const { executeCall } = useChipiContractCall({
    showToast: false, // Manejamos los toasts manualmente como en el original
    onSuccess: (result) => {
      console.log('✅ Spawn Beast transaction successful:', result);
    },
    onError: (error) => {
      console.error('❌ Spawn Beast transaction failed:', error);
    }
  });

  /**
   * Internal spawn beast function with comprehensive sync
   * (mantiene exactamente la misma lógica de validación y sync)
   */
  const executeSpawnBeast = useCallback(async (params: BeastSpawnParams): Promise<SpawnResult> => {
    // Validation: Check if wallet is connected
    if (!isConnected || !walletAddress) {
      const error = "Wallet not connected. Please connect your wallet first.";
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
        spawnedBeastParams: params,
        syncSuccess: false
      }));

      // Step 1: Prepare and execute transaction
      setSpawnState(prev => ({ ...prev, step: 'spawning' }));

      console.log('🥚 Executing spawn_beast transaction with Chipi...', params);
      
      // 🔄 MIGRACIÓN: client.game.spawnBeast() → executeCall con Chipi
      const result = await executeCall({
        contractName: 'game',
        entrypoint: 'spawn_beast',
        calldata: [params.specie, params.beast_type, params.name]
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Spawn transaction failed');
      }

      setSpawnState(prev => ({
        ...prev,
        txHash: result.transactionHash!,
        txStatus: 'PENDING',
        step: 'confirming'
      }));

      // Step 2: Transaction confirmed successfully
      console.log('✅ Spawn transaction successful:', result.transactionHash);
      
      setSpawnState(prev => ({
        ...prev,
        txStatus: 'SUCCESS',
        step: 'syncing' // 🆕 NEW: Dedicated sync step
      }));

      // 🆕 NEW: Step 3 - Execute comprehensive post-spawn sync
      console.log('🔄 Starting post-spawn synchronization...');
      
      const syncResult = await syncAfterSpawn(result.transactionHash!, params);
      
      if (syncResult.success) {
        const isFullyComplete = syncResult.syncType === 'complete';
        const logMessage = isFullyComplete 
          ? '✅ Post-spawn sync completed successfully (fully synced)'
          : '✅ Post-spawn transaction successful (partial sync - Torii catching up)';
        
        console.log(logMessage);
        
        setSpawnState(prev => ({
          ...prev,
          completed: true,
          step: 'success',
          isSpawning: false,
          syncSuccess: isFullyComplete
        }));

        return {
          success: true,
          transactionHash: result.transactionHash,
          beastParams: params,
          syncSuccess: isFullyComplete,
          finalBeastId: syncResult.finalBeastId
        };
      } else {
        // Sync failed but transaction succeeded
        console.log('⚠️ Transaction succeeded but sync failed:', syncResult.error);
        
        // Fallback: Try basic refetch
        console.log('🔄 Attempting fallback refetch...');
        try {
          await Promise.all([
            refetchPlayer(),
            refetchLiveBeast()
          ]);
          
          // Check if fallback worked
          const hasLiveBeast = useAppStore.getState().hasLiveBeast();
          
          setSpawnState(prev => ({
            ...prev,
            completed: hasLiveBeast,
            step: hasLiveBeast ? 'success' : 'syncing',
            isSpawning: false,
            syncSuccess: hasLiveBeast,
            error: hasLiveBeast ? null : 'Sync incomplete - beast may appear after refresh'
          }));
          
          return {
            success: true, // Transaction succeeded
            transactionHash: result.transactionHash,
            beastParams: params,
            syncSuccess: hasLiveBeast,
            finalBeastId: useAppStore.getState().getCurrentBeastId(),
            error: hasLiveBeast ? undefined : 'Sync incomplete'
          };
          
        } catch (fallbackError) {
          console.error('❌ Fallback refetch also failed:', fallbackError);
          
          setSpawnState(prev => ({
            ...prev,
            completed: false,
            isSpawning: false,
            syncSuccess: false,
            error: 'Transaction succeeded but data sync failed'
          }));
          
          return {
            success: true, // Transaction still succeeded
            transactionHash: result.transactionHash,
            beastParams: params,
            syncSuccess: false,
            error: 'Transaction succeeded but data sync failed'
          };
        }
      }

    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || "Unknown error occurred";
      
      console.error('❌ Spawn beast failed:', errorMessage);
      
      setSpawnState(prev => ({
        ...prev,
        error: errorMessage,
        txStatus: 'REJECTED',
        isSpawning: false,
        syncSuccess: false
      }));

      return {
        success: false,
        error: errorMessage,
        syncSuccess: false
      };
    }
  }, [isConnected, walletAddress, storePlayer, executeCall, refetchLiveBeast, refetchPlayer, syncAfterSpawn]);

  /**
   * Spawn beast with optional parameters (mantiene misma interfaz)
   */
  const spawnBeast = useCallback(async (params?: BeastSpawnParams): Promise<SpawnResult> => {
    const beastParams = params || generateRandomBeastParams();
    return executeSpawnBeast(beastParams);
  }, [executeSpawnBeast]);

  /**
   * Reset the spawner state (mantiene misma lógica)
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
      syncSuccess: false,
    });
  }, []);

  return {
    // State (misma interfaz)
    isSpawning: spawnState.isSpawning,
    error: spawnState.error,
    completed: spawnState.completed,
    currentStep: spawnState.step,
    txHash: spawnState.txHash,
    txStatus: spawnState.txStatus,
    spawnedBeastParams: spawnState.spawnedBeastParams,
    syncSuccess: spawnState.syncSuccess,
    
    // Actions (misma interfaz)
    spawnBeast,
    resetSpawner,
  };
};