import { useStarknetConnect } from '../../../dojo/hooks/useStarknetConnect';
import { useLoginAnimations } from './components/useLoginAnimations';
import { UniverseView, GameView } from './components/CoverViews';
import { VennDiagram } from './components/VennDiagram';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

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
    address 
  } = useStarknetConnect();

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
   * Monitor connection status and redirect when connected
   */
  useEffect(() => {
    if (status === 'connected' && address) {
      console.log('✅ Controller connected successfully:', address);
      
      // Navigate to main game after successful connection
      setTimeout(() => {
        onLoginSuccess();
      }, 1500);
    }
  }, [status, address, onLoginSuccess]);

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
   * Show connecting state
   */
  useEffect(() => {
    if (isConnecting) {
      console.log('Opening Cartridge Controller...');
    } else {
      console.log('Stopped connecting / connection dismissed');
    }
  }, [isConnecting]);


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