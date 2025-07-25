import { ChipiProvider as ChipiSDKProvider } from "@chipi-pay/chipi-sdk";
import type { PropsWithChildren } from "react";

/**
 * PASO 3: ChipiProvider para Chipi SDK
 * Provee el contexto necesario para useCreateWallet y otros hooks de Chipi
 */
export function ChipiProvider({ children }: PropsWithChildren) {
  console.log('🎯 PASO 3: ChipiProvider initialized');
  
  // Configuration for Chipi SDK
  const chipiConfig = {
    apiPublicKey: import.meta.env.VITE_PUBLIC_CHIPI_API_KEY || 'debug_api_key_123',
    // Add other required config options as needed
  };
  
  return (
    <ChipiSDKProvider config={chipiConfig}>
      {children}
    </ChipiSDKProvider>
  );
}