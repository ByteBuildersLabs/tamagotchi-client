import { useCreateWallet } from '@chipi-pay/chipi-sdk';
import { useWorldApp } from '../../hooks/useWorldApp';

/**
 * Hook centralizado para estado de wallet y conexión con Chipi + Worldcoin
 * 
 * Combina información de:
 * - Chipi SDK (wallet address, creation status)
 * - Worldcoin MiniKit (authentication, World App status)
 * 
 * ✅ Reemplaza placeholders en hooks de Chipi
 */
export function useChipiWallet() {
  const { createWalletResponse, isLoading: isCreatingWallet } = useCreateWallet();
  const { isInWorldApp, username } = useWorldApp();

  // Wallet address real desde Chipi SDK
  const walletAddress = createWalletResponse?.wallet?.publicKey || null;
  
  // Estado de conexión combinado
  const isConnected = Boolean(
    createWalletResponse?.success && // Wallet creado exitosamente
    walletAddress && // Tiene dirección válida
    isInWorldApp // Está en World App (opcional pero recomendado)
  );

  // Estado de autenticación Worldcoin
  const isAuthenticated = Boolean(username); // Si tiene username, está autenticado

  // Estado general de la aplicación
  const isReady = isConnected && isAuthenticated;

  return {
    // Wallet Info
    walletAddress,
    isConnected,
    
    // Worldcoin Auth
    isAuthenticated,
    username,
    isInWorldApp,
    
    // Combined Status
    isReady,
    isCreatingWallet,
    
    // Debug Info
    debug: {
      hasWalletResponse: !!createWalletResponse,
      walletSuccess: createWalletResponse?.success,
      hasPublicKey: !!createWalletResponse?.wallet?.publicKey,
      worldAppStatus: isInWorldApp,
      authStatus: username || 'not_authenticated'
    }
  };
}