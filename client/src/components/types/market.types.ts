// components/types/marketTypes.ts

import type { FoodCategory } from "../../constants/foodMarket.constants";

/**
 * Market-specific food item interface
 * Extends the base food with market functionality
 */
export interface MarketFoodItem {
  id: number;
  name: string;
  description: string;
  image: string;
  category: FoodCategory;
  price: number;
  healthiness: number; // 1-5 scale
  hungerRestore: number;
  owned: boolean;
  ownedAmount?: number;
}

/**
 * Purchase response interface
 */
export interface FoodPurchaseResponse {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

/**
 * Market transaction state
 */
export interface MarketTransactionState {
  isProcessing: boolean;
  processingFoodId: number | null;
  transactionHash: string | null;
  status: 'PENDING' | 'SUCCESS' | 'REJECTED' | null;
  error: string | null;
}

/**
 * Market store interface (for future implementation)
 */
export interface UseMarketStoreReturn {
  // Data
  isProcessing: boolean;
  txHash: string | null;
  txStatus: 'PENDING' | 'SUCCESS' | 'REJECTED' | null;
  
  // Methods
  canAfford: (price: number) => boolean;
  purchaseFood: (foodId: number) => Promise<FoodPurchaseResponse>;
  getFoodById: (foodId: number) => MarketFoodItem | undefined;
}

export default MarketFoodItem;