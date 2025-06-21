import { useStarknetConnect } from '../../../dojo/hooks/useStarknetConnect';
import { useSpawnPlayer } from '../../../dojo/hooks/useSpawnPlayer'; 
import { useAccount } from '@starknet-react/core';
import { useLoginAnimations } from './components/useLoginAnimations';
import { UniverseView, GameView } from './components/CoverViews';
import { VennDiagram } from './components/VennDiagram';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import useAppStore from '../../../zustand/store'; 

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

/**
 * Main Login/Cover component that handles the intro sequence
 * and redirects to cover screen when wallet connects successfully
 */
export const LoginScreen = ({ onLoginSuccess }: LoginScreenProps) => {
  const { view, currentCircle } = useLoginAnimations();
  
  // Integrate wallet connection hook
  const { 
    status, 
    handleConnect: connectWallet, 
    isConnecting, 
    error: connectionError,
    address,
    hasTriedConnect
  } = useStarknetConnect();

  // Integrate player spawn hook
  const { 
    initializePlayer, 
    playerExists,
    completed,
    isInitializing,
    error: spawnError,
    currentStep,
    txHash,
    txStatus
  } = useSpawnPlayer();

  const { account } = useAccount();

  // Get player from store
  const storePlayer = useAppStore(state => state.player);

  /**
   * Handle connect button click - trigger Cartridge Controller
   */
  const handleConnect = async () => {
    console.log('🎮 Connecting Controller...');
    try {
      await connectWallet();
    } catch (error) {
      console.error('❌ Connection failed:', error);
    }
  };

  /**
   * Trigger player initialization on wallet connect
   */
  useEffect(() => {
  if (status === 'connected' && hasTriedConnect && account) {
    console.log("Wallet connected, initializing player...");
    initializePlayer().then(result => {
      console.log("Player initialization result:", result);
    });
  }
}, [status, hasTriedConnect, account, initializePlayer]);

  /**
   * Monitor connection status and player initialization - redirect when both complete
   */
  useEffect(() => {
    // Only redirect when both wallet is connected AND player is initialized
    if (status === 'connected' && address && (playerExists || completed) && storePlayer) {
      console.log('✅ Controller connected and player initialized:', address);
      
      // Navigate to main game after successful connection and initialization
      setTimeout(() => {
        onLoginSuccess();
      }, 1500);
    }
  }, [status, address, playerExists, completed, storePlayer, onLoginSuccess]);

  /**
   * Handle connection errors
   */
  useEffect(() => {
    if (connectionError) {
      console.error('🚨 Connection error:', connectionError);
      toast.error(`Connection failed: ${connectionError}`, {
        duration: 4000,
        position: 'top-center'
      });
    }
  }, [connectionError]);

  /**
   * Handle spawn errors
   */
  useEffect(() => {
  if (spawnError && spawnError !== "Already initializing") {
    console.error('🚨 Player spawn error:', spawnError);
    toast.error(`Player initialization failed: ${spawnError}`, {
      duration: 4000,
      position: 'top-center'
    });
  }
}, [spawnError]);

  /**
   * Show connecting/initializing state with more detail
   */
  useEffect(() => {
    if (isConnecting) {
      console.log('Opening Cartridge Controller...');
    } else if (isInitializing) {
      console.log(`Initializing player - Step: ${currentStep}`);
      if (txHash) {
        console.log(`Transaction: ${txHash} - Status: ${txStatus}`);
      }
    } else {
      console.log('Stopped connecting / connection dismissed');
    }
  }, [isConnecting, isInitializing, currentStep, txHash, txStatus]);

  /**
   * Show transaction progress toasts
   */
  useEffect(() => {
    if (txHash && txStatus === 'SUCCESS') {
      toast.success('Player spawned successfully!', {
        duration: 3000,
        position: 'top-center'
      });
    } else if (txHash && txStatus === 'REJECTED') {
      toast.error('Transaction failed', {
        duration: 4000,
        position: 'top-center'
      });
    }
  }, [txHash, txStatus]);

  // Render different views based on animation state
  switch (view) {
    case 'universe':
      return <UniverseView />;
    case 'game':
      return <GameView />;
    case 'cover':
      return (
        <>
          <VennDiagram 
            currentCircle={currentCircle} 
            onConnect={handleConnect}
          />
          
          {/* Toast Container for status updates */}
          <Toaster
            toastOptions={{
              className: 'bg-white/95 text-gray-800 border border-gray-200 rounded-lg shadow-xl backdrop-blur-sm font-medium',
              success: { 
                iconTheme: { primary: '#10B981', secondary: '#FFFFFF' }
              },
              error: { 
                iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' }
              },
            }}
          />
        </>
      );
    default:
      return null;
  }
};