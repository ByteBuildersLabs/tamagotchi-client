import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { AccountInterface } from 'starknet';

// Dojo hooks
import { useDojoSDK } from '@dojoengine/sdk/react';
import { usePlayer } from '../../../../dojo/hooks/usePlayer';

// Types
import { MarketFoodItem } from '../../../../constants/foodMarket.constants';

// Store
import useAppStore from '../../../../zustand/store';

interface UseMarketPurchaseProps {
  account?: AccountInterface;
  toastPosition?: 'top-center' | 'top-right' | 'bottom-center';
}

interface UseMarketPurchaseReturn {
  purchaseFood: (food: MarketFoodItem) => Promise<boolean>;
  isPurchasing: boolean;
  canPurchase: (food: MarketFoodItem) => boolean;
}

export const useMarketPurchase = ({ 
  account, 
  toastPosition = 'top-right' 
}: UseMarketPurchaseProps): UseMarketPurchaseReturn => {
  const { client } = useDojoSDK();
  const { refetch: refetchPlayer } = usePlayer();
  const storePlayer = useAppStore(state => state.player);
  
  const [isPurchasing, setIsPurchasing] = useState(false);

  /**
   * Check if player can purchase a food item
   */
  const canPurchase = (food: MarketFoodItem): boolean => {
    if (!account || !client) return false;
    
    const playerBalance = storePlayer?.total_coins || 0;
    return playerBalance >= food.price;
  };

  /**
   * Purchase a food item from the market
   */
  const purchaseFood = async (food: MarketFoodItem): Promise<boolean> => {
    // Validation checks
    if (!account || !client) {
      toast.error("Please connect your wallet first", { position: toastPosition });
      return false;
    }

    if (!canPurchase(food)) {
      toast.error("Insufficient coins for this purchase", { position: toastPosition });
      return false;
    }

    if (isPurchasing) {
      toast.error("Please wait for the current purchase to complete", { position: toastPosition });
      return false;
    }

    try {
      setIsPurchasing(true);
      
      // Execute blockchain transaction
      const result = await client.player.addOrUpdateFoodAmount(
        account, 
        food.id,      // food ID
        1,            // amount (buying 1 unit)
        food.price    // price in coins
      );

      console.log("🛒 [MarketPurchase] Transaction result:", result);
      
      // Refresh player data to update coins balance
      await refetchPlayer();
      
      // Success notification
      toast.success(`${food.name} purchased successfully!`, { 
        position: toastPosition,
        duration: 3000
      });
      
      return true;
      
    } catch (error) {
      console.error("🛒 [MarketPurchase] Error:", error);
      toast.error("Purchase failed. Please try again.", { 
        position: toastPosition,
        duration: 4000
      });
      return false;
    } finally {
      setIsPurchasing(false);
    }
  };

  return {
    purchaseFood,
    isPurchasing,
    canPurchase
  };
};