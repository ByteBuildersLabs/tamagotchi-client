import { useStarknetConnect } from '../../../dojo/hooks/useStarknetConnect';
// import { useSpawnPlayer } from '../../../dojo/hooks/useSpawnPlayer'; // TODO: Re-enable after beast spawn integration
import { useLoginAnimations } from './components/useLoginAnimations';
import { UniverseView, GameView } from './components/CoverViews';
import { VennDiagram } from './components/VennDiagram';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
//import useAppStore from '../../../zustand/store';

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
  } = useStarknetConnect();

  // TODO: Re-enable after beast spawn integration
  // Integrate player spawn hook - TEMPORARILY DISABLED
  // const { 
  //   initializePlayer, 
  //   playerExists,
  //   completed,
  //   isInitializing,
  //   error: spawnError
  // } = useSpawnPlayer();

  // Get player from store
  //const storePlayer = useAppStore(state => state.player);

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

  // TODO: Re-enable after beast spawn integration
  /**
   * Trigger player initialization on wallet connect - TEMPORARILY DISABLED
   */
  // useEffect(() => {
  //   if (status === 'connected' && hasTriedConnect) {
  //     console.log("Wallet connected, initializing player...");
  //     initializePlayer().then(result => {
  //       console.log("Player initialization result:", result);
  //     });
  //   }
  // }, [status, hasTriedConnect, initializePlayer]);

  /**
   * Monitor connection status and redirect when wallet connects
   * TEMPORARILY SIMPLIFIED - just redirect on wallet connection
   * TODO: Re-enable full player initialization check after beast spawn integration
   */
  useEffect(() => {
    // Temporarily simplified: just redirect when wallet is connected
    if (status === 'connected' && address) {
      console.log('✅ Controller connected, redirecting to game:', address);
      
      // Navigate to main game after successful connection
      setTimeout(() => {
        onLoginSuccess();
      }, 1500);
    }
    
    // TODO: Re-enable full check after beast spawn integration
    // if (status === 'connected' && address && (playerExists || completed) && storePlayer) {
    //   console.log('✅ Controller connected and player initialized:', address);
    //   
    //   // Navigate to main game after successful connection and initialization
    //   setTimeout(() => {
    //     onLoginSuccess();
    //   }, 1500);
    // }
  }, [status, address, onLoginSuccess]);
  // }, [status, address, playerExists, completed, storePlayer, onLoginSuccess]); // TODO: Re-enable after beast spawn

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

  // TODO: Re-enable after beast spawn integration
  /**
   * Handle spawn errors - TEMPORARILY DISABLED
   */
  // useEffect(() => {
  //   if (spawnError) {
  //     console.error('🚨 Player spawn error:', spawnError);
  //     toast.error(`Player initialization failed: ${spawnError}`, {
  //       duration: 4000,
  //       position: 'top-center'
  //     });
  //   }
  // }, [spawnError]);

  /**
   * Show connecting state
   */
  useEffect(() => {
    if (isConnecting) {
      console.log('Opening Cartridge Controller...');
    } else {
      console.log('Stopped connecting / connection dismissed');
    }
    
    // TODO: Re-enable after beast spawn integration
    // } else if (isInitializing) {
    //   console.log('Initializing player...');
    // } else {
    //   console.log('Stopped connecting / connection dismissed');
    // }
  }, [isConnecting]);
  // }, [isConnecting, isInitializing]); // TODO: Re-enable after beast spawn

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
          
          {/* Toast Container in case of errors*/}
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