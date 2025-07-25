import { useCallback } from 'react';
import toast from 'react-hot-toast';

// Store imports
import useAppStore from '../../zustand/store';

// Types imports
import { CleanTransactionState } from '../../components/types/clean.types';

// Chipi imports
import { useChipiContractCall } from './useChipiContractCall';
import { useChipiWallet } from './useChipiWallet';

// Hook return interface (mantiene exactamente la misma interfaz que useCleanBeast)
interface UseCleanBeastReturn {
  // State
  cleanTransaction: CleanTransactionState;
  
  // Actions
  cleanBeast: () => Promise<CleanActionResult>;
  resetTransaction: () => void;
  
  // Computed
  canClean: boolean;
  isCleaningInProgress: boolean;
}

// Clean action result interface (mantiene exactamente la misma interfaz)
interface CleanActionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

/**
 * Hook for managing clean beast transactions using Chipi SDK
 * 🔄 MIGRACIÓN: Cartridge Controller → Chipi SDK
 * 
 * Mantiene exactamente la misma interfaz que useCleanBeast original
 * para evitar breaking changes en los componentes
 */
export const useChipiCleanBeast = (): UseCleanBeastReturn => {
  
  // Store state and actions (mismas que el hook original)
  const cleanTransaction = useAppStore(state => state.cleanTransaction);
  const setCleanTransaction = useAppStore(state => state.setCleanTransaction);
  const resetCleanTransaction = useAppStore(state => state.resetCleanTransaction);
  const hasLiveBeast = useAppStore(state => state.hasLiveBeast);
  const player = useAppStore(state => state.player);

  // ✅ Estado real de conexión desde Chipi/Worldcoin
  const { isConnected, walletAddress } = useChipiWallet();
  const hasAccount = Boolean(walletAddress);

  // Chipi contract call hook
  const { executeCall } = useChipiContractCall({
    showToast: false, // Manejamos los toasts manualmente como en el original
    onSuccess: (result) => {
      console.log('✅ Clean transaction successful:', result);
    },
    onError: (error) => {
      console.error('❌ Clean transaction failed:', error);
    }
  });

  // Execute clean beast transaction (mantiene exactamente la misma lógica de validación)
  const cleanBeast = useCallback(async (): Promise<CleanActionResult> => {
    // Validation: Check if wallet is connected
    if (!isConnected) {
      const error = 'Wallet not connected. Please connect your wallet first.';
      toast.error('Please connect your wallet first');
      return { success: false, error };
    }

    // Validation: Check if account exists
    if (!hasAccount) {
      const error = 'No account found. Please connect your wallet.';
      toast.error('Please connect your wallet');
      return { success: false, error };
    }

    // Validation: Check if player exists
    if (!player) {
      const error = 'No player data found';
      toast.error('Player data not found');
      return { success: false, error };
    }

    // Validation: Check if beast is live
    if (!hasLiveBeast()) {
      const error = 'No live beast found';
      toast.error('You need a live beast to clean');
      return { success: false, error };
    }

    // Validation: Check if already cleaning
    if (cleanTransaction.isCleaningInProgress) {
      const error = 'Clean transaction already in progress';
      toast.error('Please wait for current cleaning to complete');
      return { success: false, error };
    }

    try {
      // Start transaction - set loading state (misma lógica que original)
      setCleanTransaction({
        isCleaningInProgress: true,
        transactionHash: null,
        error: null,
      });

      console.log('🧽 Iniciando clean con Chipi...');

      // 🔄 MIGRACIÓN: client.game.clean() → executeCall con Chipi
      const result = await executeCall({
        contractName: 'game',
        entrypoint: 'clean',
        calldata: [] // En Dojo: client.game.clean(account) - no necesita parámetros adicionales
      });
      
      // Check transaction result (mantiene misma lógica de éxito)
      if (result.success) {
        // Update transaction state with success
        setCleanTransaction({
          isCleaningInProgress: false,
          transactionHash: result.transactionHash!,
          error: null,
        });

        // Show success toast (estilo igual al original pero con mensaje Chipi)
        toast.success('Beast cleaned successfully! 🧽✨', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#10B981',
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
        throw new Error(result.error || "Clean transaction failed");
      }

    } catch (error: any) {
      console.error('Clean transaction failed:', error);

      // Update transaction state with error (misma lógica que original)
      const errorMessage = error?.message || error?.toString() || 'Transaction failed';
      setCleanTransaction({
        isCleaningInProgress: false,
        transactionHash: null,
        error: errorMessage,
      });

      // Show error toast (mismo estilo que original)
      toast.error(`Failed to clean beast: ${errorMessage}`, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '16px',
        },
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [
    // Mismas dependencias pero adaptadas a Chipi
    isConnected,
    walletAddress,
    player,
    hasLiveBeast,
    cleanTransaction.isCleaningInProgress,
    setCleanTransaction,
    executeCall
  ]);

  // Reset transaction state (mantiene misma lógica)
  const resetTransaction = useCallback(() => {
    resetCleanTransaction();
  }, [resetCleanTransaction]);

  // Computed values with proper boolean types (misma lógica pero con Chipi checks)
  const canClean = Boolean(
    isConnected &&
    hasAccount &&
    player &&
    hasLiveBeast() &&
    !cleanTransaction.isCleaningInProgress
  );
  
  const isCleaningInProgress = Boolean(cleanTransaction.isCleaningInProgress);

  return {
    // State (misma interfaz)
    cleanTransaction,
    
    // Actions (misma interfaz)
    cleanBeast,
    resetTransaction,
    
    // Computed (misma interfaz)
    canClean,
    isCleaningInProgress,
  };
};