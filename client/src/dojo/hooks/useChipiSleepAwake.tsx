import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import useAppStore from '../../zustand/store';

// Chipi imports
import { useChipiContractCall } from './useChipiContractCall';
import { useChipiWallet } from './useChipiWallet';

// Types (mantiene exactamente las mismas interfaces)
interface SleepAwakeTransactionState {
  isInProgress: boolean;
  action: 'sleep' | 'awake' | null;
  transactionHash: string | null;
  error: string | null;
}

interface SleepAwakeResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

interface UseSleepAwakeReturn {
  // State
  isSleepTransactionInProgress: boolean;
  sleepAwakeTransaction: SleepAwakeTransactionState;
  
  // Actions
  putToSleep: () => Promise<SleepAwakeResult>;
  wakeUp: () => Promise<SleepAwakeResult>;
  resetTransaction: () => void;
  
  // Computed
  canToggleSleep: boolean;
  currentBeastAwakeStatus: boolean | null;
}

/**
 * Hook for managing Sleep/Awake transactions using Chipi SDK
 * 🔄 MIGRACIÓN: Cartridge Controller → Chipi SDK
 * 
 * Mantiene exactamente la misma interfaz que useSleepAwake original
 * para evitar breaking changes en los componentes
 */
export const useChipiSleepAwake = (): UseSleepAwakeReturn => {
  
  // ✅ Estado real de conexión desde Chipi/Worldcoin
  const { isConnected, walletAddress } = useChipiWallet();
  
  // Store state (misma que el hook original)
  const hasLiveBeast = useAppStore(state => state.hasLiveBeast());
  const realTimeStatus = useAppStore(state => state.realTimeStatus);
  
  // Local transaction state (misma lógica que original)
  const [sleepAwakeTransaction, setSleepAwakeTransaction] = useState<SleepAwakeTransactionState>({
    isInProgress: false,
    action: null,
    transactionHash: null,
    error: null,
  });
  
  // Current beast awake status (misma lógica que original)
  const currentBeastAwakeStatus = realTimeStatus.length >= 4
    ? Boolean(realTimeStatus[3])
    : null;
    
  // Chipi contract call hook
  const { executeCall } = useChipiContractCall({
    showToast: false, // Manejamos los toasts manualmente como en el original
    onSuccess: (result) => {
      console.log('✅ Sleep/Awake transaction successful:', result);
    },
    onError: (error) => {
      console.error('❌ Sleep/Awake transaction failed:', error);
    }
  });
  
  // Computed values (misma lógica pero con Chipi checks)
  const canToggleSleep = Boolean(
    isConnected &&
    walletAddress &&
    hasLiveBeast &&
    !sleepAwakeTransaction.isInProgress &&
    currentBeastAwakeStatus !== null
  );
  
  // Put beast to sleep (mantiene exactamente la misma lógica de validación)
  const putToSleep = useCallback(async (): Promise<SleepAwakeResult> => {
    // Validation: Check if wallet is connected
    if (!isConnected || !walletAddress) {
      const error = 'Wallet not connected';
      toast.error(error);
      return { success: false, error };
    }
    if (!hasLiveBeast) {
      const error = 'No live beast found';
      toast.error(error);
      return { success: false, error };
    }
    if (sleepAwakeTransaction.isInProgress) {
      const error = 'Sleep/Awake transaction already in progress';
      toast.error(error);
      return { success: false, error };
    }
    if (currentBeastAwakeStatus === false) {
      const error = 'Beast is already sleeping';
      toast.error(error);
      return { success: false, error };
    }
    
    try {
      setSleepAwakeTransaction({
        isInProgress: true,
        action: 'sleep',
        transactionHash: null,
        error: null,
      });
      
      console.log('🌙 Executing sleep transaction with Chipi...');
      
      // 🔄 MIGRACIÓN: client.game.sleep() → executeCall con Chipi
      const result = await executeCall({
        contractName: 'game',
        entrypoint: 'sleep',
        calldata: [] // En Dojo: client.game.sleep(account) - no necesita parámetros adicionales
      });
      
      if (result.success) {
        console.log('✅ Sleep transaction submitted:', result.transactionHash);
        setSleepAwakeTransaction({
          isInProgress: false,
          action: 'sleep',
          transactionHash: result.transactionHash!,
          error: null,
        });
        
        // Success toast (misma lógica que original pero con mensaje Chipi)
        toast.success('Beast is now sleeping peacefully 🌙💤', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#6366F1',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '16px',
          },
        });
        
        return {
          success: true,
          transactionHash: result.transactionHash,
        };
      } else {
        throw new Error(result.error || 'Transaction returned no hash');
      }
      
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to put beast to sleep';
      console.error('❌ Sleep transaction failed:', err);
      setSleepAwakeTransaction({
        isInProgress: false,
        action: 'sleep',
        transactionHash: null,
        error: errorMessage,
      });
      toast.error(`Sleep failed: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [isConnected, walletAddress, hasLiveBeast, sleepAwakeTransaction.isInProgress, currentBeastAwakeStatus, executeCall]);
  
  // Wake up beast (mantiene exactamente la misma lógica de validación)
  const wakeUp = useCallback(async (): Promise<SleepAwakeResult> => {
    // Validation: Check if wallet is connected
    if (!isConnected || !walletAddress) {
      const error = 'Wallet not connected';
      toast.error(error);
      return { success: false, error };
    }
    if (!hasLiveBeast) {
      const error = 'No live beast found';
      toast.error(error);
      return { success: false, error };
    }
    if (sleepAwakeTransaction.isInProgress) {
      const error = 'Sleep/Awake transaction already in progress';
      toast.error(error);
      return { success: false, error };
    }
    if (currentBeastAwakeStatus === true) {
      const error = 'Beast is already awake';
      toast.error(error);
      return { success: false, error };
    }
    
    try {
      setSleepAwakeTransaction({
        isInProgress: true,
        action: 'awake',
        transactionHash: null,
        error: null,
      });
      
      console.log('🔥 Executing awake transaction with Chipi...');
      
      // 🔄 MIGRACIÓN: client.game.awake() → executeCall con Chipi
      const result = await executeCall({
        contractName: 'game',
        entrypoint: 'awake',
        calldata: [] // En Dojo: client.game.awake(account) - no necesita parámetros adicionales
      });
      
      if (result.success) {
        console.log('✅ Awake transaction submitted:', result.transactionHash);
        setSleepAwakeTransaction({
          isInProgress: false,
          action: 'awake',
          transactionHash: result.transactionHash!,
          error: null,
        });
        
        // Success toast (misma lógica que original pero con mensaje Chipi)
        toast.success('Beast is now awake and ready! 🔥⚡', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#F59E0B',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '16px',
          },
        });
        
        return {
          success: true,
          transactionHash: result.transactionHash,
        };
      } else {
        throw new Error(result.error || 'Transaction returned no hash');
      }
      
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to wake up beast';
      console.error('❌ Awake transaction failed:', err);
      setSleepAwakeTransaction({
        isInProgress: false,
        action: 'awake',
        transactionHash: null,
        error: errorMessage,
      });
      toast.error(`Wake up failed: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [isConnected, walletAddress, hasLiveBeast, sleepAwakeTransaction.isInProgress, currentBeastAwakeStatus, executeCall]);
  
  // Reset transaction state (mantiene misma lógica)
  const resetTransaction = useCallback(() => {
    setSleepAwakeTransaction({
      isInProgress: false,
      action: null,
      transactionHash: null,
      error: null,
    });
  }, []);
  
  return {
    // State (misma interfaz)
    isSleepTransactionInProgress: sleepAwakeTransaction.isInProgress,
    sleepAwakeTransaction,
    
    // Actions (misma interfaz)
    putToSleep,
    wakeUp,
    resetTransaction,
    
    // Computed (misma interfaz)
    canToggleSleep,
    currentBeastAwakeStatus,
  };
};