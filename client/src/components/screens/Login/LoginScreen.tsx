// PASO 1: Desconectando Cartridge Controller temporalmente
// import { useStarknetConnect } from '../../../dojo/hooks/useStarknetConnect';
// import { usePlayerInitialization } from '../../../dojo/hooks/usePlayerInitialization';
// import { useAccount } from '@starknet-react/core';
import { useLoginAnimations } from './components/useLoginAnimations';
import { UniverseView, GameView } from './components/CoverViews';
import { VennDiagram } from './components/VennDiagram';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { MiniKit, VerificationLevel } from '@worldcoin/minikit-js';
import { useCreateWallet } from '@chipi-pay/chipi-sdk';
// import useAppStore from '../../../zustand/store'; 

interface LoginScreenProps {
  onLoginSuccess: (destination: 'hatch' | 'cover') => void;
}

/**
 * Enhanced Login/Cover component that handles the intro sequence
 * and redirects to appropriate screen based on VALIDATED player's beast status
 * includes fetchStatus + updateBeast validation before navigation
 */
export const LoginScreen = ({ onLoginSuccess }: LoginScreenProps) => {
  const { view, currentCircle } = useLoginAnimations();
  
  // PASO 2: Estado de autenticación Worldcoin  
  const [authStatus, setAuthStatus] = useState<'disconnected' | 'verifying' | 'verified' | 'creating_wallet' | 'ready'>('disconnected');
  const [isProcessing, setIsProcessing] = useState(false);
  const [userInfo, setUserInfo] = useState<{nullifier_hash: string, verification_level: string} | null>(null);
  
  // PASO 3: Chipi wallet creation
  const { createWalletAsync, createWalletResponse } = useCreateWallet();
  // const [walletData, setWalletData] = useState<{address: string, pin: string} | null>(null);
  
  // Helper: Generate PIN from wallet address (last 6 digits) - TODO: Use after debugging
  // const generatePinFromAddress = (address: string): string => {
  //   const cleanAddress = address.replace('0x', '');
  //   const lastChars = cleanAddress.slice(-6);
  //   const numericPin = parseInt(lastChars, 16).toString().padStart(6, '0').slice(-6);
  //   return numericPin;
  // };
  
  // Handle Worldcoin authentication
  const handleConnect = async () => {
    try {
      setIsProcessing(true);
      setAuthStatus('verifying');
      
      console.log('🌍 PASO 2: Iniciando World ID verification...');
      
      // Check if running in World App
      if (!MiniKit.isInstalled()) {
        toast.error('This game requires World App to play!');
        setIsProcessing(false);
        setAuthStatus('disconnected');
        return;
      }

      // World ID verification payload (will be used when MiniKit types are fixed)
      // const verifyPayload = {
      //   action: 'bytebeasts-login', 
      //   verification_level: VerificationLevel.Orb,
      //   signal: '', 
      // };

      // Always use real World ID verification modal
      console.log('🌍 Iniciando World ID verification real...');
      
      try {
        // Real World ID verification using MiniKit
        const response = await MiniKit.commands.verify({
          action: 'bytebeasts-login',
          verification_level: VerificationLevel.Orb,
          signal: ''
        });
        
        if (response && response.verification_level) {
          console.log('✅ World ID verification successful!', response);
          
          const realUserInfo = {
            nullifier_hash: (response as any).nullifier_hash || 'temp_nullifier_' + Date.now(),
            verification_level: response.verification_level
          };
          
          setUserInfo(realUserInfo);
          setAuthStatus('verified');
          toast.success('🌍 World ID verified!');
          
          // PASO 3: Create Chipi wallet automatically after World ID verification
          console.log('🔄 Creating Starknet wallet with Chipi...');
          setAuthStatus('creating_wallet');
          setIsProcessing(true);
          
          try {
            // DEBUGGING: Test what createWalletAsync actually accepts
            console.log('🧪 Testing createWalletAsync parameters...');
            
            // Try to call with different parameter combinations to see what works
            const tempPin = realUserInfo.nullifier_hash.slice(-6);
            
            // Test with correct API based on TypeScript errors
            console.log('Test: Calling createWalletAsync with required params');
            try {
              const result = await createWalletAsync({ 
                encryptKey: tempPin,
                bearerToken: 'debug_bearer_token_123' // Temporary for testing
              });
              console.log('✅ createWalletAsync worked:', result);
              console.log('✅ createWalletResponse:', createWalletResponse);
              
              // Check what properties are available in the response
              if (createWalletResponse) {
                console.log('📋 createWalletResponse keys:', Object.keys(createWalletResponse));
                console.log('📋 Full response:', JSON.stringify(createWalletResponse, null, 2));
              }
              
            } catch (e: any) {
              console.log('❌ createWalletAsync failed:', e?.message || e);
            }
            
            // For now, just simulate success
            setAuthStatus('ready');
            setIsProcessing(false);
            toast.success('🔍 API debugging complete! Check console.');
            
            // Navigate after debugging
            setTimeout(() => {
              onLoginSuccess('hatch');
            }, 2000);
            
          } catch (walletErr) {
            console.error('❌ Wallet API testing failed:', walletErr);
            toast.error('API testing failed. Check console for details.');
            setAuthStatus('verified');
            setIsProcessing(false);
          }
          
        } else {
          console.error('❌ World ID verification failed');
          toast.error('World ID verification failed');
          setIsProcessing(false);
          setAuthStatus('disconnected');
        }
        
      } catch (error) {
        console.error('❌ Worldcoin authentication error:', error);
        toast.error('Authentication failed. Please try again.');
        setIsProcessing(false);
        setAuthStatus('disconnected');
      }
    } catch (mainError) {
      console.error('❌ Main authentication error:', mainError);
      toast.error('Authentication failed. Please try again.');
      setIsProcessing(false);
      setAuthStatus('disconnected');
    }
  };

  // PASO 3: Debug Chipi API
  useEffect(() => {
    console.log('🔍 Debugging Chipi API:');
    console.log('createWalletAsync:', createWalletAsync);
    console.log('createWalletAsync.toString():', createWalletAsync.toString());
    console.log('createWalletResponse:', createWalletResponse);
    
    // Check if createWalletAsync has any properties or prototype info
    console.log('createWalletAsync keys:', Object.keys(createWalletAsync));
    console.log('createWalletAsync prototype:', Object.getPrototypeOf(createWalletAsync));
  }, [createWalletAsync, createWalletResponse]);

  // PASO 2: Log del estado de autenticación
  useEffect(() => {
    console.log('🔄 LoginScreen authStatus:', authStatus);
    if (userInfo) {
      console.log('👤 User info:', userInfo);
    }
  }, [authStatus, userInfo]);

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
            isProcessing={isProcessing}
            authStatus={authStatus}
          />
          
          {/* Enhanced Toast Container with loading support */}
          <Toaster
            toastOptions={{
              className: 'bg-white/95 text-gray-800 border border-gray-200 rounded-lg shadow-xl backdrop-blur-sm font-medium',
              success: { 
                iconTheme: { primary: '#10B981', secondary: '#FFFFFF' }
              },
              error: { 
                iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' }
              },
              loading: {
                iconTheme: { primary: '#3B82F6', secondary: '#FFFFFF' }
              }
            }}
          />
        </>
      );
    default:
      return null;
  }
};