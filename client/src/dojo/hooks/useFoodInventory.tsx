import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useAccount } from '@starknet-react/core';
import { addAddressPadding } from 'starknet';

// Store and config imports
import useAppStore from '../../zustand/store';
import { dojoConfig } from '../dojoConfig';

// Types imports
import { Food } from '../models.gen';
import { FoodItem } from '../../components/types/feed.types';

// Constants import
import { FOOD_ASSETS, FOOD_UI_CONFIG } from '../../constants/feed.constants';

// Hook return interface
interface UseFoodInventoryReturn {
  foods: FoodItem[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  availableFoods: FoodItem[];
  totalFoodCount: number;
  hasFoodAvailable: boolean;
}

// Torii GraphQL configuration
const TORII_URL = dojoConfig.toriiUrl + "/graphql";

// GraphQL query to get all food for a player
const FOOD_INVENTORY_QUERY = `
  query GetPlayerFoodInventory($playerAddress: ContractAddress!) {
    tamagotchiFoodModels(where: { player: $playerAddress }) {
      edges {
        node {
          player
          id
          amount
        }
      }
      totalCount
    }
  }
`;

// Helper function to convert hex values
const hexToNumber = (hexValue: string | number): number => {
  if (typeof hexValue === 'number') return hexValue;
  if (typeof hexValue === 'string' && hexValue.startsWith('0x')) {
    return parseInt(hexValue, 16);
  }
  if (typeof hexValue === 'string') {
    return parseInt(hexValue, 10);
  }
  return 0;
};



// API function to fetch food data
const fetchFoodInventory = async (playerAddress: string): Promise<Food[]> => {
  try {
    const response = await fetch(TORII_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: FOOD_INVENTORY_QUERY,
        variables: { playerAddress }
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL Error: ${result.errors[0]?.message || 'Unknown error'}`);
    }

    if (!result.data?.tamagotchiFoodModels?.edges) {
      return []; // No food found
    }

    // Extract and return food data
    return result.data.tamagotchiFoodModels.edges.map((edge: any) => edge.node as Food);
    
  } catch (error) {
    console.error("Error fetching food inventory:", error);
    throw error;
  }
};

/**
 * Hook for managing player's food inventory
 * Fetches food data from blockchain and maps it to UI-friendly format
 * Integrates with Zustand store for caching and state management
 */
export const useFoodInventory = (): UseFoodInventoryReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { account } = useAccount();
  
  // Store state and actions
  const storeFoods = useAppStore(state => state.foods);
  const setStoreFoods = useAppStore(state => state.setFoods);
  
  // Track if we've done initial fetch to avoid unnecessary re-fetches
  const hasFetchedRef = useRef(false);
  
  // Memoize the formatted user address
  const userAddress = useMemo(() => 
    account ? addAddressPadding(account.address) : null,
    [account]
  );

  // Fetch food inventory from blockchain
  const fetchAndMapFoodInventory = useCallback(async () => {
    if (!userAddress) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch raw food data from contract
      const contractFoods = await fetchFoodInventory(userAddress);
      
      // Create Food[] array for store - ONLY foods that exist in contract
      const storeFoods: Food[] = contractFoods.map(contractFood => ({
        player: contractFood.player,
        id: contractFood.id,
        amount: contractFood.amount,
      }));
      
      // Update store with Food[] data (only existing foods)
      setStoreFoods(storeFoods);
      
    } catch (err) {
      console.error("Error in fetchAndMapFoodInventory:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch food inventory'));
    } finally {
      setIsLoading(false);
    }
  }, [userAddress, setStoreFoods]);

  // Auto-fetch on mount and when user address changes
  useEffect(() => {
    if (userAddress && !hasFetchedRef.current) {
      fetchAndMapFoodInventory();
      hasFetchedRef.current = true;
    }
  }, [userAddress, fetchAndMapFoodInventory]);

  // Public refetch function (for manual refresh)
  const refetch = useCallback(async () => {
    hasFetchedRef.current = false; // Reset flag to allow refetch
    await fetchAndMapFoodInventory();
    hasFetchedRef.current = true;
  }, [fetchAndMapFoodInventory]);

  // Convert store Food[] to FoodItem[] for UI compatibility
  // Now only includes foods that actually exist (no count: 0 items)
  const foods = useMemo((): FoodItem[] => {
    return storeFoods.map(food => ({
      id: hexToNumber(food.id),
      name: FOOD_ASSETS[hexToNumber(food.id) as keyof typeof FOOD_ASSETS]?.name || `Food ${food.id}`,
      icon: FOOD_ASSETS[hexToNumber(food.id) as keyof typeof FOOD_ASSETS]?.img || '',
      count: hexToNumber(food.amount),
      hungerRestore: 20, // Default for UI
      color: FOOD_UI_CONFIG.FOOD_COLORS[hexToNumber(food.id)] || '#6B7280',
    }));
  }, [storeFoods]);

  // Available foods (only those with count > 0) - filtered from existing foods
  const availableFoods = useMemo(() => 
    foods.filter(food => food.count > 0),
    [foods]
  );

  const totalFoodCount = useMemo(() => 
    foods.reduce((total, food) => total + food.count, 0),
    [foods]
  );

  const hasFoodAvailable = useMemo(() => 
    availableFoods.length > 0,
    [availableFoods]
  );

  return {
    foods: availableFoods,       
    isLoading,
    error,
    refetch,
    availableFoods,               
    totalFoodCount,
    hasFoodAvailable,
  };
};