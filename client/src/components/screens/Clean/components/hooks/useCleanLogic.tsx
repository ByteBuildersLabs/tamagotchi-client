import { useCallback, useState } from "react";
import toast from "react-hot-toast";

// Hooks imports
import { useCleanBeast } from '../../../../../dojo/hooks/useCleanBeast';
import { useRealTimeStatus } from '../../../../../dojo/hooks/useRealTimeStatus';
import { useUpdateBeast } from '../../../../../dojo/hooks/useUpdateBeast';
import { useRainSystem } from './useRainSystem';

// Hook return interface
interface UseCleanLogicReturn {
  // Transaction state from useCleanBeast
  isCleaningInProgress: boolean;
  canClean: boolean;
  
  // Rain system state
  isRainActive: boolean;
  
  // Clean process state
  isProcessingClean: boolean;
  
  // Actions
  handleCloudClick: () => Promise<boolean>; // Returns success state
  
  // Computed
  isInteractionDisabled: boolean;
}

/**
 * Hook for integrating clean beast transaction with rain animation system
 * Coordinates the sequence: Click → TX → Rain → Status Update
 * Follows the same pattern as useFeedLogic for consistency
 */
export const useCleanLogic = (rainDuration: number = 20): UseCleanLogicReturn => {
  
  // Get clean transaction capabilities
  const {
    cleanBeast,
    isCleaningInProgress,
    canClean
  } = useCleanBeast();
  
  // Get real-time status management
  const { fetchLatestStatus } = useRealTimeStatus();
  
  // Get beast update capabilities
  const { updateBeast } = useUpdateBeast();
  
  // Get rain animation system
  const {
    isRainActive,
    startRain
  } = useRainSystem(rainDuration);
  
  // Local state for coordination
  const [isProcessingClean, setIsProcessingClean] = useState(false);
  
  // Computed values - Define early to avoid hoisting issues
  const isInteractionDisabled = Boolean(
    isCleaningInProgress || 
    isProcessingClean || 
    isRainActive || 
    !canClean
  );

  /**
   * Handle successful clean with post-cleaning updates
   * Returns success state for CleanScreen to handle UI feedback
   */
  const handleSuccessfulClean = useCallback(async (): Promise<boolean> => {
    try {
      // Execute blockchain transaction
      const result = await cleanBeast();
      
      if (result.success) {
        // Start rain animation immediately after successful transaction
        console.log('✅ Clean transaction successful, starting rain animation...');
        startRain();
        
        // Post-cleaning sequence: Update beast → Fetch status
        // Delay to ensure transaction is processed
        setTimeout(async () => {
          try {
            console.log('🔄 Starting post-cleaning updates...');
            
            // Step 1: Update beast (this triggers contract status recalculation)
            console.log('🔄 Updating beast status...');
            const updateSuccess = await updateBeast();
            
            if (updateSuccess) {
              console.log('✅ Beast updated successfully');
              
              // Step 2: Fetch latest status SILENTLY (no loading states to avoid re-renders)
              console.log('🔄 Fetching updated status...');
              await fetchLatestStatus();
              console.log('✅ Status fetched and updated in background');
            } else {
              console.warn('⚠️ Beast update failed, fetching status anyway');
              await fetchLatestStatus();
            }
            
          } catch (error) {
            console.error('❌ Error in post-cleaning updates:', error);
            // Still try to fetch status even if beast update fails
            await fetchLatestStatus();
          } finally {
            setIsProcessingClean(false);
          }
        }, 1500); // Reduced delay for faster feedback
        
        return true; // Success
        
      } else {
        // Error handled by useCleanBeast hook (error toast already shown)
        console.error('Clean transaction failed:', result.error);
        setIsProcessingClean(false);
        return false; // Failed
      }
      
    } catch (error) {
      console.error('Unexpected error in handleSuccessfulClean:', error);
      setIsProcessingClean(false);
      return false; // Failed
    }
  }, [cleanBeast, startRain, updateBeast, fetchLatestStatus]);

  /**
   * Handle cloud click - main action for clean screen
   * Returns success state for CleanScreen to handle success feedback
   */
  const handleCloudClick = useCallback(async (): Promise<boolean> => {
    // Early return if interaction is disabled
    if (isInteractionDisabled) {
      console.log('⏸️ Cloud interaction disabled');
      return false;
    }
    
    // Prevent multiple simultaneous clean operations
    if (isCleaningInProgress || isProcessingClean) {
      toast.error('Cleaning already in progress, please wait!', {
        duration: 2000,
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
      return false;
    }
    
    // Check if cleaning is possible
    if (!canClean) {
      toast.error('Cannot clean right now. Check wallet and beast status.', {
        duration: 3000,
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
      return false;
    }
    
    try {
      setIsProcessingClean(true);
      console.log('☁️ Cloud clicked - starting clean sequence...');
      
      // Execute the cleaning sequence and return success state
      const success = await handleSuccessfulClean();
      return success;
      
    } catch (error) {
      console.error('❌ Error in handleCloudClick:', error);
      toast.error('Failed to start cleaning process');
      setIsProcessingClean(false);
      return false;
    }
  }, [
    isInteractionDisabled,
    isCleaningInProgress,
    isProcessingClean,
    canClean,
    handleSuccessfulClean
  ]);

  return {
    // Transaction state
    isCleaningInProgress,
    canClean,
    
    // Animation state
    isRainActive,
    
    // Clean process state
    isProcessingClean,
    
    // Actions
    handleCloudClick,
    
    // Computed
    isInteractionDisabled,
  };
};