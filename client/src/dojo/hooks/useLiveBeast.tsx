import { useEffect, useState, useMemo, useCallback } from "react";
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
  beastId: number | null;
}

// Torii GraphQL URL
const TORII_URL = dojoConfig.toriiUrl + "/graphql";

// 🔥 OPTIMIZED: Single query that gets ONLY the live beast data for current player
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
    
    # Get beast info for the same beast_id (we'll handle this in the logic)
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

// 🔥 NEW: API function to fetch ONLY live beast data
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
    if (!liveBeastStatusEdges?.length) {
      console.log("🔍 No live beast found for player");
      return { beast: null, status: null };
    }

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
    const allBeastsEdges = result.data?.allBeasts?.edges || [];
    const matchingBeastEdge = allBeastsEdges.find((edge: any) => 
      hexToNumber(edge.node.beast_id) === liveBeastId
    );

    if (!matchingBeastEdge) {
      console.warn(`⚠️ Live beast status found but no beast data for beast_id: ${liveBeastId}`);
      return { beast: null, status: beastStatus };
    }

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

    console.log(`✅ Live beast found: beast_id=${beast.beast_id}, specie=${beast.specie}, type=${beast.beast_type}`);
    
    return { beast, status: beastStatus };
    
  } catch (error) {
    console.error("❌ Error fetching live beast data:", error);
    throw error;
  }
};

/**
 * 🔥 NEW: Hook for managing ONLY the live beast data
 * Replaces useBeasts + useBeastStatus with a single optimized approach
 * Only fetches and stores the beast that is currently alive
 */
export const useLiveBeast = (): UseLiveBeastReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { account } = useAccount();
  
  // Get live beast data from optimized store
  const liveBeastData = useAppStore(state => state.liveBeast);
  const setLiveBeast = useAppStore(state => state.setLiveBeast);
  const clearLiveBeast = useAppStore(state => state.clearLiveBeast);

  // Memoize the formatted user address
  const userAddress = useMemo(() => 
    account ? addAddressPadding(account.address).toLowerCase() : '', 
    [account]
  );

  // Extract data from store
  const liveBeast = liveBeastData.beast;
  const liveBeastStatus = liveBeastData.status;
  const hasLiveBeast = liveBeastData.isAlive;
  const beastId = liveBeast?.beast_id || null;

  // Function to fetch and update live beast data
  const refetch = useCallback(async () => {
    if (!userAddress) {
      setIsLoading(false);
      clearLiveBeast();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log("🔄 Fetching live beast data for:", userAddress);
      
      const { beast, status } = await fetchLiveBeastData(userAddress);
      
      if (beast && status && status.is_alive) {
        // Set live beast in store
        setLiveBeast(beast, status);
        console.log(`✅ Live beast data updated in store: ${beast.beast_id}`);
      } else {
        // Clear store if no live beast found
        clearLiveBeast();
        console.log("🔄 No live beast - store cleared");
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("❌ Failed to fetch live beast data:", errorMessage);
      
      setError(new Error(errorMessage));
      clearLiveBeast();
    } finally {
      setIsLoading(false);
    }
  }, [userAddress, setLiveBeast, clearLiveBeast]);

  // Effect to fetch live beast data when address changes
  useEffect(() => {
    if (userAddress) {
      refetch();
    }
  }, [userAddress, refetch]);

  // Effect to sync with account changes
  useEffect(() => {
    if (!account) {
      clearLiveBeast();
      setError(null);
      setIsLoading(false);
    }
  }, [account, clearLiveBeast]);

  return {
    liveBeast,
    liveBeastStatus,
    hasLiveBeast,
    isLoading,
    error,
    refetch,
    beastId
  };
};