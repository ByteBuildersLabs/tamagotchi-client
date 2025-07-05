import { useCallback } from 'react';
import { useSleepAwake } from '../../../../../dojo/hooks/useSleepAwake';
import { useRealTimeStatus } from '../../../../../dojo/hooks/useRealTimeStatus';
import { useUpdateBeast } from '../../../../../dojo/hooks/useUpdateBeast';
import { useCampfireState } from './useCampfireState';

interface UseSleepLogicReturn {
  // Beast state
  isBeastSleeping: boolean;
  isSleepTransactionInProgress: boolean;
  
  // Campfire integration
  handleCampfireClick: () => Promise<void>;
  
  // Navigation control
  shouldBlockNavigation: boolean;
  
  // Campfire state (forwarded from useCampfireState)
  isCampfireOn: boolean;
  
  // Computed
  isInteractionDisabled: boolean;
}

/**
 * Hook that integrates Sleep/Awake transactions with campfire animations and navigation control
 * Coordinates the complete sleep/awake flow including blockchain updates and UI synchronization
 */
export const useSleepLogic = (): UseSleepLogicReturn => {
  // Get sleep/awake transaction capabilities
  const { 
    putToSleep, 
    wakeUp, 
    isSleepTransactionInProgress,
    currentBeastAwakeStatus 
  } = useSleepAwake();
  
  // Get real-time status management
  const { fetchLatestStatus } = useRealTimeStatus();
  
  // Get beast update capabilities
  const { updateBeast } = useUpdateBeast();
  
  // Get campfire state management
  const { isCampfireOn, toggleCampfire } = useCampfireState();
  
  /**
   * Determine if beast is currently sleeping
   * Uses real-time status as source of truth
   */
  const isBeastSleeping = currentBeastAwakeStatus === false;
  
  /**
   * Determine if navigation should be blocked
   * Block navigation when beast is sleeping (except to sleep screen)
   */
  const shouldBlockNavigation = isBeastSleeping;
  
  /**
   * Determine if interactions should be disabled
   * Disable during transactions or when status is unknown
   */
  const isInteractionDisabled = isSleepTransactionInProgress || currentBeastAwakeStatus === null;
  
  /**
   * Main campfire click handler
   * Integrates transaction execution with campfire animations and status updates
   */
  const handleCampfireClick = useCallback(async () => {
    // Don't allow interaction during transactions or when status is unknown
    if (isInteractionDisabled) {
      console.log('⏸️ Campfire interaction disabled during transaction or unknown status');
      return;
    }
    
    try {
      let result;
      
      // Determine action based on current beast state
      if (isBeastSleeping) {
        console.log('🔥 Beast is sleeping, attempting to wake up...');
        
        // Execute wake up transaction
        result = await wakeUp();
        
        // Update campfire visual state on success
        if (result.success) {
          toggleCampfire(); // This will make campfire "lit" (on)
        }
        
      } else {
        console.log('🌙 Beast is awake, attempting to put to sleep...');
        
        // Execute sleep transaction
        result = await putToSleep();
        
        // Update campfire visual state on success
        if (result.success) {
          toggleCampfire(); // This will make campfire "extinguished" (off)
        }
      }
      
      // Post-transaction sequence (same pattern as Feed/Clean)
      if (result.success) {
        console.log('✅ Sleep/Awake transaction successful, starting post-transaction updates...');
        
        // Wait for blockchain confirmation before updating
        setTimeout(async () => {
          try {
            console.log('🔄 Starting post-sleep/awake updates...');
            
            // Step 1: Update beast (recalculates status in contract)
            const updateSuccess = await updateBeast();
            
            if (updateSuccess) {
              console.log('✅ Beast updated successfully after sleep/awake');
              
              // Step 2: Fetch latest status (gets new is_awake value + other stats)
              await fetchLatestStatus();
              console.log('✅ Status fetched and updated after sleep/awake');
              
            } else {
              console.warn('⚠️ Beast update failed after sleep/awake, fetching status anyway');
              await fetchLatestStatus();
            }
            
          } catch (error) {
            console.error('❌ Error in post-sleep/awake updates:', error);
            // Even if updates fail, try to fetch status to keep UI in sync
            try {
              await fetchLatestStatus();
            } catch (fetchError) {
              console.error('❌ Failed to fetch status as fallback:', fetchError);
            }
          }
        }, 1500); // Wait for blockchain confirmation
      } else {
        console.error('❌ Sleep/Awake transaction failed:', result.error);
        // Transaction failed, don't update campfire state or trigger updates
      }
      
    } catch (error) {
      console.error('❌ Unexpected error in handleCampfireClick:', error);
    }
  }, [
    isInteractionDisabled,
    isBeastSleeping,
    wakeUp,
    putToSleep,
    toggleCampfire,
    updateBeast,
    fetchLatestStatus
  ]);
  
  return {
    // Beast state
    isBeastSleeping,
    isSleepTransactionInProgress,
    
    // Campfire integration
    handleCampfireClick,
    isCampfireOn,
    
    // Navigation control
    shouldBlockNavigation,
    
    // Computed
    isInteractionDisabled,
  };
};