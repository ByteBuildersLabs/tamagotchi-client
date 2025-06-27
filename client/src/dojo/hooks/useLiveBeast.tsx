import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useAccount } from "@starknet-react/core";
import { addAddressPadding } from "starknet";
import { dojoConfig } from "../dojoConfig";
import { Beast, BeastStatus } from '../models.gen';
import useAppStore from '../../zustand/store';

// Hook return interface
interface UseLiveBeastReturn {
  liveBeast: Beast | null;
  liveBeastStatus: BeastStatus | null;
  hasLiveBeast: boolean;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  forceRefetch: () => Promise<void>;
  beastId: number | null;
}

// Torii GraphQL URL
const TORII_URL = dojoConfig.toriiUrl + "/graphql";

// Single query that gets ONLY the live beast data for current player
const LIVE_BEAST_COMPLETE_QUERY = `
  query GetPlayerLiveBeastComplete($playerAddress: ContractAddress!) {
    # Get live beast status first
    liveBeastStatus: tamagotchiBeastStatusModels(
      where: { 
        player: $playerAddress, 
        is_alive: true 
      }
      first: 1
    ) {
      edges {
        node {
          player
          beast_id
          is_alive
          is_awake
          hunger
          energy
          happiness
          hygiene
          clean_status
          last_timestamp
        }
      }
    }
    
    # Get beast info for the same beast_id
    allBeasts: tamagotchiBeastModels(
      where: { 
        player: $playerAddress
      }
    ) {
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
    }
  }
`;

// Helper functions
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

const hexToBool = (hexValue: string | boolean): boolean => {
  if (typeof hexValue === 'boolean') return hexValue;
  if (typeof hexValue === 'string') {
    if (hexValue === '0x1' || hexValue === '1') return true;
    if (hexValue === '0x0' || hexValue === '0') return false;
    return hexValue.toLowerCase() === 'true';
  }
  return false;
};

// API function to fetch ONLY live beast data
const fetchLiveBeastData = async (playerAddress: string): Promise<{
  beast: Beast | null;
  status: BeastStatus | null;
}> => {
  try {
    const response = await fetch(TORII_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        query: LIVE_BEAST_COMPLETE_QUERY,
        variables: { playerAddress }
      }),
    });

    const result = await response.json();

    // Check if we have a live beast status
    const liveBeastStatusEdges = result.data?.liveBeastStatus?.edges;
    const allBeastsEdges = result.data?.allBeasts?.edges || [];
    
    if (!liveBeastStatusEdges?.length) return { beast: null, status: null };

    // Extract live beast status
    const rawStatus = liveBeastStatusEdges[0].node;
    const liveBeastId = hexToNumber(rawStatus.beast_id);
    
    const beastStatus: BeastStatus = {
      player: rawStatus.player,
      beast_id: liveBeastId,
      is_alive: hexToBool(rawStatus.is_alive),
      is_awake: hexToBool(rawStatus.is_awake),
      hunger: hexToNumber(rawStatus.hunger),
      energy: hexToNumber(rawStatus.energy),
      happiness: hexToNumber(rawStatus.happiness),
      hygiene: hexToNumber(rawStatus.hygiene),
      clean_status: hexToNumber(rawStatus.clean_status),
      last_timestamp: hexToNumber(rawStatus.last_timestamp)
    };

    // Find the corresponding beast data
    const matchingBeastEdge = allBeastsEdges.find((edge: any) => 
      hexToNumber(edge.node.beast_id) === liveBeastId
    );

    if (!matchingBeastEdge) return { beast: null, status: beastStatus };

    // Extract beast data
    const rawBeast = matchingBeastEdge.node;
    
    const beast: Beast = {
      player: rawBeast.player,
      beast_id: hexToNumber(rawBeast.beast_id),
      age: hexToNumber(rawBeast.age),
      birth_date: hexToNumber(rawBeast.birth_date),
      specie: hexToNumber(rawBeast.specie),
      beast_type: hexToNumber(rawBeast.beast_type)
    };
    
    return { beast, status: beastStatus };
    
  } catch (error) {
    throw error;
  }
};

/**
 * Optimized hook that manages live beast data for the current player
 */
export const useLiveBeast = (): UseLiveBeastReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { account } = useAccount();
  
  // Single ref to prevent multiple refetches
  const isRefetchingRef = useRef(false);
  
  // Get live beast data from optimized store
  const liveBeastData = useAppStore(state => state.liveBeast);
  const setLiveBeast = useAppStore(state => state.setLiveBeast);
  const clearLiveBeast = useAppStore(state => state.clearLiveBeast);

  // Stable userAddress that doesn't change unless account actually changes
  const userAddress = useMemo(() => 
    account ? addAddressPadding(account.address).toLowerCase() : '', 
    [account?.address]
  );

  // Extract data from store
  const liveBeast = liveBeastData.beast;
  const liveBeastStatus = liveBeastData.status;
  const hasLiveBeast = liveBeastData.isAlive;
  const beastId = liveBeast?.beast_id || null;

  // Simplified refetch function
  const refetch = useCallback(async () => {
    if (!userAddress) {
      setIsLoading(false);
      clearLiveBeast();
      return;
    }

    // Only block if already refetching same address
    if (isRefetchingRef.current) return;

    try {
      isRefetchingRef.current = true;
      setIsLoading(true);
      setError(null);
      
      const { beast, status } = await fetchLiveBeastData(userAddress);
      
      if (beast && status && status.is_alive) {
        setLiveBeast(beast, status);
      } else {
        clearLiveBeast();
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(new Error(errorMessage));
      clearLiveBeast();
    } finally {
      setIsLoading(false);
      isRefetchingRef.current = false;
    }
  }, [userAddress, setLiveBeast, clearLiveBeast]);

  // Force refetch that always executes
  const forceRefetch = useCallback(async () => {
    if (!userAddress) return;

    // Reset blocking ref
    isRefetchingRef.current = false;
    
    // Execute refetch
    await refetch();
  }, [userAddress, refetch]);

  // Effect that only triggers on userAddress change
  useEffect(() => {
    if (userAddress) {
      refetch();
    } else {
      // Clear data when no address
      clearLiveBeast();
      setError(null);
      setIsLoading(false);
    }
  }, [userAddress]);

  // Separate effect for account cleanup
  useEffect(() => {
    if (!account) {
      clearLiveBeast();
      setError(null);
      setIsLoading(false);
      isRefetchingRef.current = false;
    }
  }, [account, clearLiveBeast]);

  return {
    liveBeast,
    liveBeastStatus,
    hasLiveBeast,
    isLoading,
    error,
    refetch,
    forceRefetch,
    beastId
  };
};