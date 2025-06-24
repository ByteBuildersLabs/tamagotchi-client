import { useEffect, useState, useMemo, useCallback } from "react";
import { useAccount } from "@starknet-react/core";
import { addAddressPadding } from "starknet";
import { dojoConfig } from "../dojoConfig";
import { BeastStatus } from '../models.gen';
import useAppStore from '../../zustand/store';

// Hook return interface
interface UseBeastStatusReturn {
  beastStatuses: BeastStatus[];
  currentBeastStatus: BeastStatus | null;
  hasLiveBeast: boolean;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  getBeastStatusById: (beastId: number) => BeastStatus | null;
}

// Torii GraphQL URL
const TORII_URL = dojoConfig.toriiUrl + "/graphql";

// GraphQL Query for beast status
const BEAST_STATUS_QUERY = `
  query GetPlayerBeastStatus($playerAddress: ContractAddress!) {
    tamagotchiBeastStatusModels(where: { player: $playerAddress }) {
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

// Helper to convert hex strings to booleans
const hexToBool = (hexValue: string | boolean): boolean => {
  if (typeof hexValue === 'boolean') return hexValue;
  
  if (typeof hexValue === 'string') {
    // Handle hex boolean representation
    if (hexValue === '0x1' || hexValue === '1') return true;
    if (hexValue === '0x0' || hexValue === '0') return false;
    
    // Handle string boolean
    return hexValue.toLowerCase() === 'true';
  }
  
  return false;
};

// API function to fetch beast status data
const fetchBeastStatusData = async (playerAddress: string): Promise<BeastStatus[]> => {
  try {
    console.log("Fetching beast status for player:", playerAddress);
    
    const response = await fetch(TORII_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        query: BEAST_STATUS_QUERY,
        variables: { playerAddress }
      }),
    });

    const result = await response.json();
    console.log("GraphQL beast status response:", result);
    
    if (!result.data?.tamagotchiBeastStatusModels?.edges?.length) {
      console.log("No beast status found for player");
      return [];
    }

    // Convert raw data to BeastStatus objects
    const beastStatuses: BeastStatus[] = result.data.tamagotchiBeastStatusModels.edges.map((edge: any) => {
      const rawStatus = edge.node;
      console.log("[useBeastStatus] Raw beast status data:", rawStatus);
      
      const beastStatus: BeastStatus = {
        player: rawStatus.player,
        beast_id: hexToNumber(rawStatus.beast_id),
        is_alive: hexToBool(rawStatus.is_alive),
        is_awake: hexToBool(rawStatus.is_awake),
        hunger: hexToNumber(rawStatus.hunger),
        energy: hexToNumber(rawStatus.energy),
        happiness: hexToNumber(rawStatus.happiness),
        hygiene: hexToNumber(rawStatus.hygiene),
        clean_status: hexToNumber(rawStatus.clean_status),
        last_timestamp: hexToNumber(rawStatus.last_timestamp)
      };
      
      console.log("[useBeastStatus] Converted beast status:", beastStatus);
      return beastStatus;
    });
    
    return beastStatuses;
  } catch (error) {
    console.error("Error fetching beast status:", error);
    throw error;
  }
};

/**
 * Hook for managing BeastStatus data from Dojo/Torii
 * Handles fetching and caching beast status information (health, stats, etc.)
 */
export const useBeastStatus = (): UseBeastStatusReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { account } = useAccount();
  
  // Get player and beast statuses from store
  const storePlayer = useAppStore(state => state.player);
  const storeBeastStatuses = useAppStore(state => state.beastStatuses);
  const storeCurrentBeastStatus = useAppStore(state => state.currentBeastStatus);
  const setBeastStatuses = useAppStore(state => state.setBeastStatuses);
  const setCurrentBeastStatus = useAppStore(state => state.setCurrentBeastStatus);

  // Memoize the formatted user address
  const userAddress = useMemo(() => 
    account ? addAddressPadding(account.address).toLowerCase() : '', 
    [account]
  );

  // Memoize current beast status based on player's current_beast_id
  const currentBeastStatus = useMemo(() => {
    if (!storePlayer?.current_beast_id || !storeBeastStatuses.length) {
      return null;
    }
    
    return storeBeastStatuses.find(status => 
      status.beast_id === storePlayer.current_beast_id
    ) || null;
  }, [storePlayer?.current_beast_id, storeBeastStatuses]);

  // Memoize hasLiveBeast - checks if current beast exists and is alive
  const hasLiveBeast = useMemo(() => {
    console.log("🔍 [useBeastStatus] Checking hasLiveBeast:", {
      playerCurrentBeastId: storePlayer?.current_beast_id,
      availableBeastStatuses: storeBeastStatuses.map(s => ({ beast_id: s.beast_id, is_alive: s.is_alive }))
    });
    
    if (!storePlayer?.current_beast_id || storePlayer.current_beast_id === 0) {
      console.log("❌ [useBeastStatus] No current_beast_id in player");
      return false;
    }
    
    const currentStatus = storeBeastStatuses.find(status => 
      status.beast_id === storePlayer.current_beast_id
    );
    
    console.log("🔍 [useBeastStatus] Found current status:", currentStatus);
    
    const result = currentStatus ? currentStatus.is_alive : false;
    console.log("🎯 [useBeastStatus] hasLiveBeast result:", result);
    
    return result;
  }, [storePlayer?.current_beast_id, storeBeastStatuses]);

  // Function to get beast status by ID
  const getBeastStatusById = useCallback((beastId: number): BeastStatus | null => {
    return storeBeastStatuses.find(status => status.beast_id === beastId) || null;
  }, [storeBeastStatuses]);

  // Function to fetch and update beast status data
  const refetch = useCallback(async () => {
    if (!userAddress) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const beastStatusData = await fetchBeastStatusData(userAddress);
      setBeastStatuses(beastStatusData);
      
      // Update current beast status in store if we have player data
      if (storePlayer?.current_beast_id && beastStatusData.length > 0) {
        const newCurrentBeastStatus = beastStatusData.find(status => 
          status.beast_id === storePlayer.current_beast_id
        );
        setCurrentBeastStatus(newCurrentBeastStatus || null);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(new Error(errorMessage));
      setBeastStatuses([]);
      setCurrentBeastStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, [userAddress, storePlayer?.current_beast_id, setBeastStatuses, setCurrentBeastStatus]);

  // Effect to fetch beast status data when address or player changes
  useEffect(() => {
    if (userAddress && storePlayer) {
      refetch();
    }
  }, [userAddress, storePlayer, refetch]);

  // Effect to sync with account changes
  useEffect(() => {
    if (!account) {
      setBeastStatuses([]);
      setCurrentBeastStatus(null);
      setError(null);
      setIsLoading(false);
    }
  }, [account, setBeastStatuses, setCurrentBeastStatus]);

  // Update current beast status when it changes in store
  useEffect(() => {
    setCurrentBeastStatus(currentBeastStatus);
  }, [currentBeastStatus, setCurrentBeastStatus]);

  return {
    beastStatuses: storeBeastStatuses,
    currentBeastStatus: storeCurrentBeastStatus,
    hasLiveBeast,
    isLoading,
    error,
    refetch,
    getBeastStatusById
  };
};