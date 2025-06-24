import { useEffect, useState, useMemo, useCallback } from "react";
import { useAccount } from "@starknet-react/core";
import { addAddressPadding } from "starknet";
import { dojoConfig } from "../dojoConfig";
import { Beast } from '../models.gen';
import useAppStore from '../../zustand/store';

// Hook return interface
interface UseBeastsReturn {
  beasts: Beast[];
  currentBeast: Beast | null;
  hasAnyBeast: boolean;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Torii GraphQL URL
const TORII_URL = dojoConfig.toriiUrl + "/graphql";

// GraphQL Query for beasts
const BEASTS_QUERY = `
  query GetPlayerBeasts($playerAddress: ContractAddress!) {
    tamagotchiBeastModels(where: { player: $playerAddress }) {
      edges {
        node {
          player
          beast_id
          age
          birth_date
          specie
          beast_type
        }
      }
      totalCount
    }
  }
`;

// Helper to convert hex strings to numbers
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

// API function to fetch beasts data
const fetchBeastsData = async (playerAddress: string): Promise<Beast[]> => {
  try {
    const response = await fetch(TORII_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        query: BEASTS_QUERY,
        variables: { playerAddress }
      }),
    });

    const result = await response.json();
    
    if (!result.data?.tamagotchiBeastModels?.edges?.length) {
      return [];
    }

    // Convert raw data to Beast objects
    const beasts: Beast[] = result.data.tamagotchiBeastModels.edges.map((edge: any) => {
      const rawBeast = edge.node;
      
      const beast: Beast = {
        player: rawBeast.player,
        beast_id: hexToNumber(rawBeast.beast_id),
        age: hexToNumber(rawBeast.age),
        birth_date: hexToNumber(rawBeast.birth_date),
        specie: hexToNumber(rawBeast.specie),
        beast_type: hexToNumber(rawBeast.beast_type)
      };
      
      return beast;
    });
    
    return beasts;
  } catch (error) {
    console.error("Error fetching beasts:", error);
    throw error;
  }
};

/**
 * Hook for managing Beast data from Dojo/Torii
 * Handles fetching and caching beast information
 */
export const useBeasts = (): UseBeastsReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { account } = useAccount();
  
  // Get player and beasts from store
  const storePlayer = useAppStore(state => state.player);
  const storeBeasts = useAppStore(state => state.beasts);
  const storeCurrentBeast = useAppStore(state => state.currentBeast);
  const setBeasts = useAppStore(state => state.setBeasts);
  const setCurrentBeast = useAppStore(state => state.setCurrentBeast);

  // Memoize the formatted user address
  const userAddress = useMemo(() => 
    account ? addAddressPadding(account.address).toLowerCase() : '', 
    [account]
  );

  // Memoize current beast based on player's current_beast_id
  const currentBeast = useMemo(() => {
    if (!storePlayer?.current_beast_id || !storeBeasts.length) {
      return null;
    }
    
    return storeBeasts.find(beast => 
      beast.beast_id === storePlayer.current_beast_id
    ) || null;
  }, [storePlayer?.current_beast_id, storeBeasts]);

  // Memoize hasAnyBeast
  const hasAnyBeast = useMemo(() => {
    return storeBeasts.length > 0;
  }, [storeBeasts.length]);

  // Function to fetch and update beasts data
  const refetch = useCallback(async () => {
    if (!userAddress) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const beastsData = await fetchBeastsData(userAddress);
      setBeasts(beastsData);
      
      // Update current beast in store if we have player data
      if (storePlayer?.current_beast_id && beastsData.length > 0) {
        const newCurrentBeast = beastsData.find(beast => 
          beast.beast_id === storePlayer.current_beast_id
        );
        setCurrentBeast(newCurrentBeast || null);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(new Error(errorMessage));
      setBeasts([]);
      setCurrentBeast(null);
    } finally {
      setIsLoading(false);
    }
  }, [userAddress, storePlayer?.current_beast_id, setBeasts, setCurrentBeast]);

  // Effect to fetch beasts data when address or player changes
  useEffect(() => {
    if (userAddress && storePlayer) {
      refetch();
    }
  }, [userAddress, storePlayer, refetch]);

  // Effect to sync with account changes
  useEffect(() => {
    if (!account) {
      setBeasts([]);
      setCurrentBeast(null);
      setError(null);
      setIsLoading(false);
    }
  }, [account, setBeasts, setCurrentBeast]);

  // Update current beast when it changes in store
  useEffect(() => {
    setCurrentBeast(currentBeast);
  }, [currentBeast, setCurrentBeast]);

  return {
    beasts: storeBeasts,
    currentBeast: storeCurrentBeast,
    hasAnyBeast,
    isLoading,
    error,
    refetch
  };
};