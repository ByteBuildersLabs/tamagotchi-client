import type { PropsWithChildren } from "react";
import { StarknetConfig, jsonRpcProvider } from "@starknet-react/core";
import { sepolia } from "@starknet-react/chains";

/**
 * PASO 1: StarknetProvider temporal con contexto real pero sin connectors
 * Previene que los hooks fallen mientras desconectamos Cartridge
 * TODO: Remover cuando integremos Chipi SDK
 */
export default function EmptyStarknetProvider({ children }: PropsWithChildren) {
    console.log('⚠️ PASO 1: Usando EmptyStarknetProvider con StarknetConfig - Cartridge desconectado');
    
    // Create minimal provider for sepolia
    const provider = jsonRpcProvider({
        rpc: () => ({ nodeUrl: "https://api.cartridge.gg/x/starknet/sepolia" }),
    });
    
    // StarknetConfig mínimo sin connectors para proveer contexto pero sin Cartridge
    return (
        <StarknetConfig
            chains={[sepolia]}
            connectors={[]} // Sin connectors - Cartridge desconectado
            provider={provider}
        >
            {children}
        </StarknetConfig>
    );
}