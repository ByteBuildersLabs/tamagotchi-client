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
  onLoginSuccess: (destination: 'hatch' | 'cover') => void;
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
    error: connectionError,
    address,
    hasTriedConnect
  } = useStarknetConnect();

  // Integrate player initialization coordinator hook
  const { 
    initializeComplete,
    error: initializationError,
    completed,
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
    try {
      await connectWallet();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  /**
   * Trigger complete player initialization on wallet connect
   */
  useEffect(() => {
    if (status === 'connected' && hasTriedConnect && account && !hasInitialized.current) {
      hasInitialized.current = true;
      
      initializeComplete().then(() => {
        // Initialization completed successfully
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
      // Navigate based on beast status
      setTimeout(() => {
        if (shouldGoToHome) {
          onLoginSuccess('cover');
        } else if (shouldGoToHatch) {
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
      console.error('Connection error:', connectionError);
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
      console.error('Initialization error:', initializationError);
      toast.error(`Initialization failed: ${initializationError}`, {
        duration: 4000,
        position: 'top-center'
      });
    }
  }, [initializationError]);

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
   * Show beast status information
   */
  useEffect(() => {
    if (completed) {
      if (hasLiveBeast) {
        toast.success('🐾 Beast found!', {
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