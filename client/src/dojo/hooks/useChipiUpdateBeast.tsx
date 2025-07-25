import { useState, useCallback, useRef } from 'react';
import useAppStore from '../../zustand/store';
import { useRealTimeStatus } from './useRealTimeStatus';

// Chipi imports
import { useChipiContractCall } from './useChipiContractCall';
import { useChipiWallet } from './useChipiWallet';

// Types (mantiene exactamente las mismas interfaces)
interface UpdateBeastState {
  isUpdating: boolean;
  lastUpdate: number | null;
  error: string | null;
  retryCount: number;
}

interface UseUpdateBeastReturn {
  // State
  isUpdating: boolean;
  lastUpdate: number | null;
  error: string | null;
  
  // Actions
  updateBeast: () => Promise<boolean>;
  triggerUpdate: () => void; // Fire-and-forget for navigation
  resetError: () => void;
}

/**
 * Hook for managing background beast updates using Chipi SDK
 * 🔄 MIGRACIÓN: Cartridge Controller → Chipi SDK
 * 
 * Mantiene exactamente la misma interfaz que useUpdateBeast original
 * para evitar breaking changes en los componentes
 */
export const useChipiUpdateBeast = (): UseUpdateBeastReturn => {
  
  // ✅ Estado real de conexión desde Chipi/Worldcoin
  const { isConnected, walletAddress } = useChipiWallet();
  const hasLiveBeast = useAppStore(state => state.hasLiveBeast());
  const { fetchLatestStatus } = useRealTimeStatus();
  
  // Local state (misma lógica que original)
  const [state, setState] = useState<UpdateBeastState>({
    isUpdating: false,
    lastUpdate: null,
    error: null,
    retryCount: 0,
  });
  
  // Prevent multiple simultaneous updates (mismo que original)
  const isUpdatingRef = useRef(false);
  
  // Chipi contract call hook
  const { executeCall } = useChipiContractCall({
    showToast: false, // Manejamos los toasts manualmente como en el original
    onSuccess: (result) => {
      console.log('✅ Update Beast transaction successful:', result);
    },
    onError: (error) => {
      console.error('❌ Update Beast transaction failed:', error);
    }
  });
  
  /**
   * Execute update_beast transaction
   * Returns true if successful, false if failed
   * (mantiene exactamente la misma lógica que original)
   */
  const updateBeast = useCallback(async (): Promise<boolean> => {
    // Early returns for invalid states
    if (!isConnected || !walletAddress || !hasLiveBeast) {
      console.log('⏸️ Skipping update_beast - no connection, wallet, or live beast');
      return false;
    }
    
    if (isUpdatingRef.current) {
      console.log('⏸️ Update already in progress, skipping');
      return false;
    }
    
    try {
      isUpdatingRef.current = true;
      setState(prev => ({ 
        ...prev, 
        isUpdating: true, 
        error: null 
      }));
      
      console.log('🔄 Executing update_beast with Chipi...');
      
      // 🔄 MIGRACIÓN: client.game.updateBeast() → executeCall con Chipi
      const result = await executeCall({
        contractName: 'game',
        entrypoint: 'update_beast',
        calldata: [] // En Dojo: client.game.updateBeast(account) - no necesita parámetros adicionales
      });
      
      if (result.success) {
        console.log('✅ update_beast transaction submitted:', result.transactionHash);
        
        setState(prev => ({
          ...prev,
          isUpdating: false,
          lastUpdate: Date.now(),
          retryCount: 0,
        }));
        
        // Fetch updated status after successful transaction (misma lógica que original)
        // Small delay to ensure transaction is processed
        setTimeout(() => {
          fetchLatestStatus();
        }, 2000);
        
        return true;
      } else {
        throw new Error(result.error || 'Transaction returned null');
      }
      
    } catch (error: any) {
      const errorMessage = error?.message || 'Update beast failed';
      console.error('❌ update_beast failed:', error);
      
      setState(prev => ({
        ...prev,
        isUpdating: false,
        error: errorMessage,
        retryCount: prev.retryCount + 1,
      }));
      
      return false;
      
    } finally {
      isUpdatingRef.current = false;
    }
  }, [isConnected, walletAddress, hasLiveBeast, executeCall, fetchLatestStatus]);
  
  /**
   * Fire-and-forget trigger for navigation scenarios
   * (mantiene misma lógica que original)
   */
  const triggerUpdate = useCallback(() => {
    // Don't await, just fire and forget
    updateBeast().catch(error => {
      console.log('🔥 Fire-and-forget update failed (this is okay):', error);
    });
  }, [updateBeast]);
  
  /**
   * Reset error state (mantiene misma lógica)
   */
  const resetError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);
  
  return {
    // State (misma interfaz)
    isUpdating: state.isUpdating,
    lastUpdate: state.lastUpdate,
    error: state.error,
    
    // Actions (misma interfaz)
    updateBeast,
    triggerUpdate,
    resetError,
  };
};