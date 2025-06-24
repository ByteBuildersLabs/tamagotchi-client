import { useStarknetConnect } from '../../../dojo/hooks/useStarknetConnect';
import { usePlayerInitialization } from '../../../dojo/hooks/usePlayerInitialization';
import { useAccount } from '@starknet-react/core';
import { useLoginAnimations } from './components/useLoginAnimations';
import { UniverseView, GameView } from './components/CoverViews';
import { VennDiagram } from './components/VennDiagram';
import { useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import useAppStore from '../../../zustand/store'; 

interface LoginScreenProps {
  onLoginSuccess: (destination: 'hatch' | 'home') => void;
}

/**
 * Main Login/Cover component that handles the intro sequence
 * and redirects to appropriate screen based on player's beast status
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

  // Integrate player initialization coordinator hook
  const { 
    initializeComplete,
    isInitializing,
    error: initializationError,
    completed,
    currentStep,
    playerExists,
    hasLiveBeast,
    shouldGoToHatch,
    shouldGoToHome,
    playerSpawnTxHash,
    playerSpawnTxStatus,
  } = usePlayerInitialization();

  const { account } = useAccount();

  // Get player from store
  const storePlayer = useAppStore(state => state.player);

  // Ref to prevent multiple initializations
  const hasInitialized = useRef(false);

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
   * Trigger complete player initialization on wallet connect
   */
  useEffect(() => {
    if (status === 'connected' && hasTriedConnect && account && !hasInitialized.current) {
      console.log("Wallet connected, starting complete initialization...");
      hasInitialized.current = true;
      
      initializeComplete().then(result => {
        console.log("Complete initialization result:", result);
      }).catch(error => {
        console.error("Initialization failed:", error);
        hasInitialized.current = false; // Reset on error
      });
    }
  }, [status, hasTriedConnect, account, initializeComplete]);

  /**
   * Monitor initialization completion and navigate appropriately
   */
  useEffect(() => {
    // Only navigate when initialization is complete
    if (status === 'connected' && address && completed && storePlayer) {
      console.log('✅ Complete initialization finished:', {
        address,
        playerExists,
        hasLiveBeast,
        shouldGoToHatch,
        shouldGoToHome
      });
      
      // Navigate based on beast status
      setTimeout(() => {
        if (shouldGoToHome) {
          console.log('🏠 Navigating to Home - Player has live beast');
          onLoginSuccess('home');
        } else if (shouldGoToHatch) {
          console.log('🥚 Navigating to Hatch - Player needs to spawn beast');
          onLoginSuccess('hatch');
        }
      }, 1500);
    }
  }, [
    status, 
    address, 
    completed, 
    storePlayer, 
    playerExists, 
    hasLiveBeast, 
    shouldGoToHatch, 
    shouldGoToHome, 
    onLoginSuccess
  ]);

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
   * Handle initialization errors
   */
  useEffect(() => {
    if (initializationError && initializationError !== "Already initializing") {
      console.error('🚨 Initialization error:', initializationError);
      toast.error(`Initialization failed: ${initializationError}`, {
        duration: 4000,
        position: 'top-center'
      });
    }
  }, [initializationError]);

  /**
   * Show connecting/initializing state with more detail
   */
  useEffect(() => {
    if (isConnecting) {
      console.log('Opening Cartridge Controller...');
    } else if (isInitializing) {
      console.log(`Initializing - Step: ${currentStep}`);
      if (playerSpawnTxHash) {
        console.log(`Transaction: ${playerSpawnTxHash} - Status: ${playerSpawnTxStatus}`);
      }
    } else {
      console.log('Stopped connecting / connection dismissed');
    }
  }, [isConnecting, isInitializing, currentStep, playerSpawnTxHash, playerSpawnTxStatus]);

  /**
   * Show transaction progress toasts
   */
  useEffect(() => {
    if (playerSpawnTxHash && playerSpawnTxStatus === 'SUCCESS') {
      toast.success('Player spawned successfully!', {
        duration: 3000,
        position: 'top-center'
      });
    } else if (playerSpawnTxHash && playerSpawnTxStatus === 'REJECTED') {
      toast.error('Transaction failed', {
        duration: 4000,
        position: 'top-center'
      });
    }
  }, [playerSpawnTxHash, playerSpawnTxStatus]);

  /**
   * Show beast status information (for debugging)
   */
  useEffect(() => {
    if (completed) {
      if (hasLiveBeast) {
        toast.success('🐾 Beast found! Going to Home', {
          duration: 2000,
          position: 'top-center'
        });
      } else {
        toast('🥚 No beast found. Time to hatch!', {
          duration: 2000,
          position: 'top-center',
          icon: '🥚'
        });
      }
    }
  }, [completed, hasLiveBeast]);

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