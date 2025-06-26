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
    console.log("🔄 [LIVE-BEAST] Making GraphQL request for:", playerAddress);

    const response = await fetch(TORII_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        query: LIVE_BEAST_COMPLETE_QUERY,
        variables: { playerAddress }
      }),
    });

    const result = await response.json();
    
    console.log("📊 [LIVE-BEAST] GraphQL response:", result);

    // Check if we have a live beast status
    const liveBeastStatusEdges = result.data?.liveBeastStatus?.edges;
    const allBeastsEdges = result.data?.allBeasts?.edges || [];
    
    console.log("🔍 [LIVE-BEAST] Live beast status edges:", liveBeastStatusEdges);
    console.log("🔍 [LIVE-BEAST] All beasts edges:", allBeastsEdges);
    
    if (!liveBeastStatusEdges?.length) {
      console.log("❌ [LIVE-BEAST] No live beast found for player");
      return { beast: null, status: null };
    }

    // Extract live beast status
    const rawStatus = liveBeastStatusEdges[0].node;
    const liveBeastId = hexToNumber(rawStatus.beast_id);
    
    console.log("🔍 [LIVE-BEAST] Raw status:", rawStatus);
    console.log("🔍 [LIVE-BEAST] Live beast ID:", liveBeastId);
    
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

    console.log("✅ [LIVE-BEAST] Parsed beast status:", beastStatus);

    // Find the corresponding beast data
    const matchingBeastEdge = allBeastsEdges.find((edge: any) => 
      hexToNumber(edge.node.beast_id) === liveBeastId
    );

    if (!matchingBeastEdge) {
      console.warn(`⚠️ [LIVE-BEAST] Live beast status found but no beast data for beast_id: ${liveBeastId}`);
      return { beast: null, status: beastStatus };
    }

    // Extract beast data
    const rawBeast = matchingBeastEdge.node;
    console.log("🔍 [LIVE-BEAST] Raw beast:", rawBeast);
    
    const beast: Beast = {
      player: rawBeast.player,
      beast_id: hexToNumber(rawBeast.beast_id),
      age: hexToNumber(rawBeast.age),
      birth_date: hexToNumber(rawBeast.birth_date),
      specie: hexToNumber(rawBeast.specie),
      beast_type: hexToNumber(rawBeast.beast_type)
    };

    console.log("✅ [LIVE-BEAST] Parsed beast:", beast);
    console.log(`🎉 [LIVE-BEAST] Live beast found: beast_id=${beast.beast_id}, specie=${beast.specie}, type=${beast.beast_type}, is_alive=${beastStatus.is_alive}`);
    
    return { beast, status: beastStatus };
    
  } catch (error) {
    console.error("❌ [LIVE-BEAST] Error fetching live beast data:", error);
    throw error;
  }
};

/**
 * 🔥 FIXED: Optimized hook that eliminates infinite loops and ensures execution
 */
export const useLiveBeast = (): UseLiveBeastReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { account } = useAccount();
  
  // 🔥 FIX: Single ref to prevent multiple refetches - no execution blocking
  const isRefetchingRef = useRef(false);
  
  // Get live beast data from optimized store
  const liveBeastData = useAppStore(state => state.liveBeast);
  const setLiveBeast = useAppStore(state => state.setLiveBeast);
  const clearLiveBeast = useAppStore(state => state.clearLiveBeast);

  // 🔥 FIX: Stable userAddress that doesn't change unless account actually changes
  const userAddress = useMemo(() => 
    account ? addAddressPadding(account.address).toLowerCase() : '', 
    [account?.address] // Only depend on account.address, not entire account object
  );

  // Extract data from store
  const liveBeast = liveBeastData.beast;
  const liveBeastStatus = liveBeastData.status;
  const hasLiveBeast = liveBeastData.isAlive;
  const beastId = liveBeast?.beast_id || null;

  // 🔥 FIX: Simplified refetch function without dependency issues
  const refetch = useCallback(async () => {
    console.log("🚀 [LIVE-BEAST] Refetch called for userAddress:", userAddress);

    // Simple guard - don't block execution aggressively
    if (!userAddress) {
      console.log("❌ [LIVE-BEAST] No user address, clearing and returning");
      setIsLoading(false);
      clearLiveBeast();
      return;
    }

    // Only block if already refetching same address
    if (isRefetchingRef.current) {
      console.log("⏭️ [LIVE-BEAST] Already refetching, skipping...");
      return;
    }

    try {
      isRefetchingRef.current = true;
      setIsLoading(true);
      setError(null);
      
      console.log("🔄 [LIVE-BEAST] Executing fetchLiveBeastData for:", userAddress);
      
      // 🔥 FIX: Direct execution without dependencies on other hooks
      const { beast, status } = await fetchLiveBeastData(userAddress);
      
      console.log("📊 [LIVE-BEAST] Fetch result:", { beast, status });
      
      if (beast && status && status.is_alive) {
        console.log("✅ [LIVE-BEAST] Setting live beast in store");
        setLiveBeast(beast, status);
      } else {
        console.log("❌ [LIVE-BEAST] No live beast found, clearing store");
        clearLiveBeast();
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("❌ [LIVE-BEAST] Failed to refetch:", errorMessage);
      
      setError(new Error(errorMessage));
      clearLiveBeast();
    } finally {
      setIsLoading(false);
      isRefetchingRef.current = false;
    }
  }, [userAddress, setLiveBeast, clearLiveBeast]);

  // 🔥 FIX: Force refetch that always executes
  const forceRefetch = useCallback(async () => {
    console.log("🚀 [LIVE-BEAST] FORCE REFETCH called");
    
    if (!userAddress) {
      console.log("❌ [LIVE-BEAST] Force refetch: No user address");
      return;
    }

    // Reset blocking ref
    isRefetchingRef.current = false;
    
    // Execute refetch
    await refetch();
  }, [userAddress, refetch]);

  // 🔥 FIX: Simple effect that only triggers on userAddress change
  useEffect(() => {
    console.log("🔄 [LIVE-BEAST] UserAddress effect triggered:", userAddress);

    if (userAddress) {
      console.log("✅ [LIVE-BEAST] Triggering refetch for:", userAddress);
      refetch();
    } else {
      // Clear data when no address
      clearLiveBeast();
      setError(null);
      setIsLoading(false);
    }
  }, [userAddress]); // 🔥 CRITICAL: Only userAddress dependency, no refetch

  // 🔥 FIX: Separate effect for account cleanup
  useEffect(() => {
    if (!account) {
      console.log("❌ [LIVE-BEAST] No account, clearing data");
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