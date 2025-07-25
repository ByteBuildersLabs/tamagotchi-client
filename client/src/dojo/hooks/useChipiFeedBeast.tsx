import { useCallback } from 'react';
import toast from 'react-hot-toast';

// Store imports
import useAppStore from '../../zustand/store';

// Types imports
import { FeedTransactionState } from '../../components/types/feed.types';

// Chipi imports
import { useChipiContractCall } from './useChipiContractCall';
import { useChipiWallet } from './useChipiWallet';

// Hook return interface (mantiene exactamente la misma interfaz que useFeedBeast)
interface UseFeedBeastReturn {
  // State
  feedTransaction: FeedTransactionState;
  
  // Actions
  feedBeast: (foodId: number) => Promise<FeedActionResult>;
  resetTransaction: () => void;
  
  // Computed
  canFeed: boolean;
  isFeeding: boolean;
}

// Feed action result interface (mantiene exactamente la misma interfaz)
interface FeedActionResult {
  success: boolean;
  foodId: number;
  transactionHash?: string;
  error?: string;
}

/**
 * Hook for managing feed beast transactions using Chipi SDK
 * 🔄 MIGRACIÓN: Cartridge Controller → Chipi SDK
 * 
 * Mantiene exactamente la misma interfaz que useFeedBeast original
 * para evitar breaking changes en los componentes
 */
export const useChipiFeedBeast = (): UseFeedBeastReturn => {
  
  // Store state and actions (mismas que el hook original)
  const feedTransaction = useAppStore(state => state.feedTransaction);
  const setFeedTransaction = useAppStore(state => state.setFeedTransaction);
  const resetFeedTransaction = useAppStore(state => state.resetFeedTransaction);
  const hasLiveBeast = useAppStore(state => state.hasLiveBeast);
  const player = useAppStore(state => state.player);

  // ✅ Estado real de conexión desde Chipi/Worldcoin
  const { isConnected, walletAddress } = useChipiWallet();
  const hasAccount = Boolean(walletAddress);

  // Chipi contract call hook
  const { executeCall } = useChipiContractCall({
    showToast: false, // Manejamos los toasts manualmente como en el original
    onSuccess: (result) => {
      console.log('✅ Feed transaction successful:', result);
    },
    onError: (error) => {
      console.error('❌ Feed transaction failed:', error);
    }
  });

  // Execute feed beast transaction (mantiene exactamente la misma lógica de validación)
  const feedBeast = useCallback(async (foodId: number): Promise<FeedActionResult> => {
    // Validation: Check if wallet is connected
    if (!isConnected) {
      const error = 'Wallet not connected. Please connect your wallet first.';
      toast.error('Please connect your wallet first');
      return { success: false, foodId, error };
    }

    // Validation: Check if account exists
    if (!hasAccount) {
      const error = 'No account found. Please connect your wallet.';
      toast.error('Please connect your wallet');
      return { success: false, foodId, error };
    }

    // Validation: Check if player exists
    if (!player) {
      const error = 'No player data found';
      toast.error('Player data not found');
      return { success: false, foodId, error };
    }

    // Validation: Check if beast is live
    if (!hasLiveBeast()) {
      const error = 'No live beast found';
      toast.error('You need a live beast to feed');
      return { success: false, foodId, error };
    }

    // Validation: Check if already feeding
    if (feedTransaction.isFeeding) {
      const error = 'Feed transaction already in progress';
      toast.error('Please wait for current feeding to complete');
      return { success: false, foodId, error };
    }

    try {
      // Start transaction - set loading state (misma lógica que original)
      setFeedTransaction({
        isFeeding: true,
        feedingFoodId: foodId,
        transactionHash: null,
        error: null,
      });

      console.log(`🍽️ Iniciando feed con Chipi - foodId: ${foodId}`);

      // 🔄 MIGRACIÓN: client.game.feed() → executeCall con Chipi
      const result = await executeCall({
        contractName: 'game',
        entrypoint: 'feed',
        calldata: [foodId] // En Dojo: client.game.feed(account, foodId)
      });
      
      // Check transaction result (mantiene misma lógica de éxito)
      if (result.success) {
        // Update transaction state with success
        setFeedTransaction({
          isFeeding: false,
          feedingFoodId: null,
          transactionHash: result.transactionHash!,
          error: null,
        });

        // Show success toast (estilo igual al original pero con mensaje Chipi)
        toast.success('Beast fed successfully! 🍽️', {
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
          foodId,
          transactionHash: result.transactionHash,
        };
        
      } else {
        throw new Error(result.error || "Feed transaction failed");
      }

    } catch (error: any) {
      console.error('Feed transaction failed:', error);

      // Update transaction state with error (misma lógica que original)
      const errorMessage = error?.message || error?.toString() || 'Transaction failed';
      setFeedTransaction({
        isFeeding: false,
        feedingFoodId: null,
        transactionHash: null,
        error: errorMessage,
      });

      // Show error toast (mismo estilo que original)
      toast.error(`Failed to feed beast: ${errorMessage}`, {
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
        foodId,
        error: errorMessage,
      };
    }
  }, [
    // Mismas dependencias pero adaptadas a Chipi
    isConnected,
    walletAddress,
    player,
    hasLiveBeast,
    feedTransaction.isFeeding,
    setFeedTransaction,
    executeCall
  ]);

  // Reset transaction state (mantiene misma lógica)
  const resetTransaction = useCallback(() => {
    resetFeedTransaction();
  }, [resetFeedTransaction]);

  // Computed values with proper boolean types (misma lógica pero con Chipi checks)
  const canFeed = Boolean(
    isConnected &&
    hasAccount &&
    player &&
    hasLiveBeast() &&
    !feedTransaction.isFeeding
  );
  
  const isFeeding = Boolean(feedTransaction.isFeeding);

  return {
    // State (misma interfaz)
    feedTransaction,
    
    // Actions (misma interfaz)
    feedBeast,
    resetTransaction,
    
    // Computed (misma interfaz)
    canFeed,
    isFeeding,
  };
};