import { useConnect, useAccount, useDisconnect } from "@starknet-react/core";
import { useState, useCallback, useEffect } from "react";
import { Connector } from "@starknet-react/core";
import cartridgeConnector from "../../config/cartridgeConnector";

interface UseStarknetConnectReturn {
  status: 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
  handleConnect: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
  hasTriedConnect: boolean;
  setHasTriedConnect: (value: boolean) => void;
  address?: string;
  isConnecting: boolean;
  error?: string;
}

/**
 * Custom hook to manage Starknet wallet connection using Cartridge Controller
 * Specifically designed for Tamagotchi-Client
 * 
 * Features:
 * - Cartridge Controller integration for seamless UX
 * - Connection state management with proper error handling
 * - Support for reconnection and disconnect flows
 * - Optimized for ByteBeasts Tamagotchi gameplay
 */
export function useStarknetConnect(): UseStarknetConnectReturn {
  const { connect, connectors, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { status, address, isConnecting } = useAccount();
  
  // Local state for connection tracking
  const [hasTriedConnect, setHasTriedConnect] = useState(false);
  const [connectionError, setConnectionError] = useState<string>();

  /**
   * Handle wallet connection using Cartridge Controller
   * This will open the Cartridge Controller interface for ByteBeasts
   */
  const handleConnect = useCallback(async () => {
    try {
      setConnectionError(undefined);
      setHasTriedConnect(true);
      
      console.log("🎮 Connecting to ByteBeasts via Cartridge Controller...");
      
      // Prioritize Cartridge connector for ByteBeasts experience
      let connector: Connector = cartridgeConnector;
      
      // Fallback to first available connector if Cartridge not in list
      if (!connectors.includes(cartridgeConnector)) {
        connector = connectors[0];
        console.warn("⚠️ Cartridge connector not found, using fallback:", connector);
      }
      
      if (!connector) {
        throw new Error("No wallet connectors available. Please install a Starknet wallet.");
      }

      console.log("🔗 Using connector:", {
        name: connector.name || 'Unknown',
        available: connector.available || false
      });
      
      await connect({ connector });
      console.log("✅ Connection initiated successfully");
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown connection error";
      setConnectionError(errorMessage);
      console.error("❌ Connection failed:", error);
    }
  }, [connect, connectors]);

  /**
   * Handle wallet disconnection
   * Cleans up connection state for ByteBeasts
   */
  const handleDisconnect = useCallback(async () => {
    try {
      setConnectionError(undefined);
      console.log("🔌 Disconnecting wallet...");
      
      await disconnect();
      setHasTriedConnect(false);
      
      console.log("✅ Wallet disconnected successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown disconnection error";
      setConnectionError(errorMessage);
      console.error("❌ Disconnection failed:", error);
    }
  }, [disconnect]);

  /**
   * Monitor connection errors from useConnect hook
   */
  useEffect(() => {
    if (connectError) {
      const errorMsg = connectError.message || "Connection failed";
      setConnectionError(errorMsg);
      console.error("🚨 Connect hook error:", connectError);
    }
  }, [connectError]);

  /**
   * Auto-clear errors when connection succeeds
   */
  useEffect(() => {
    if (status === 'connected') {
      setConnectionError(undefined);
      console.log("🎊 Wallet connected to ByteBeasts!");
    }
  }, [status]);

  /**
   * Log status changes for debugging
   */
  useEffect(() => {
    console.log("📊 Connection status changed:", {
      status,
      address: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : undefined,
      hasTriedConnect,
      isConnecting
    });
  }, [status, address, hasTriedConnect, isConnecting]);

  return {
    status,
    handleConnect,
    handleDisconnect,
    hasTriedConnect,
    setHasTriedConnect,
    address,
    isConnecting: isConnecting || false,
    error: connectionError
  };
}