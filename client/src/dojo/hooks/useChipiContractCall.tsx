import { useState } from 'react';
// import { useCallAnyContract } from '@chipi-pay/chipi-sdk'; // TODO: Usar cuando tengamos API correcta
import toast from 'react-hot-toast';
import { useChipiWallet } from './useChipiWallet';

// Contract addresses from manifest
const CONTRACT_ADDRESSES = {
  world: '0x1e87c289aacc73a6b5ac33688097cc13de58b7b5da2168573bd610e859fd9a9',
  game: '0x8efc9411c660ef584995d8f582a13cac41aeddb6b9245b4715aa1e9e6a201e', 
  player: '0x5e79b9650cb00d19d21601c9c712654cb13daa3007fd78cce0e90051e46ec8a',
  achieve: '0x6846e1d528421a1569e36a3f80613f77e0d9f927e50967ada831347513f4c85'
} as const;

export type ContractName = keyof typeof CONTRACT_ADDRESSES;

interface ChipiContractCallParams {
  contractName: ContractName;
  entrypoint: string;
  calldata?: any[];
}

interface ChipiContractCallResult {
  success: boolean;
  data?: any;
  transactionHash?: string;
  error?: string;
}

interface UseChipiContractCallOptions {
  onSuccess?: (result: ChipiContractCallResult) => void;
  onError?: (error: string) => void;
  showToast?: boolean;
}

/**
 * Hook base para llamadas a contratos usando Chipi SDK
 * Mantiene la misma interfaz que los hooks existentes de Dojo
 * para evitar breaking changes
 */
export function useChipiContractCall(options: UseChipiContractCallOptions = {}) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  
  // const { callAnyContractAsync, callAnyContractData } = useCallAnyContract(); // TODO: Usar cuando tengamos API correcta
  const { walletAddress, debug } = useChipiWallet();

  const executeCall = async (params: ChipiContractCallParams): Promise<ChipiContractCallResult> => {
    const { contractName, entrypoint, calldata = [] } = params;
    
    try {
      setIsExecuting(true);
      setError(null);
      setTransactionHash(null);

      console.log(`🔄 Executando ${contractName}.${entrypoint} con Chipi...`, {
        contractAddress: CONTRACT_ADDRESSES[contractName],
        entrypoint,
        calldata,
        walletAddress,
        connectionStatus: debug
      });

      // Validar que tenemos wallet address
      if (!walletAddress) {
        throw new Error('No wallet address available. Please create wallet first.');
      }

      // 🚧 DEPLOYMENT MOCK: Simular transacción exitosa para testing en World App
      // TODO: Implementar llamada real a Chipi SDK una vez que tengamos la API correcta
      
      console.log('🚧 MOCK: Simulando llamada a contrato para testing...');
      
      // Simular delay de transacción
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockTransactionHash = `chipi_${contractName}_${entrypoint}_${Date.now()}`;
      
      console.log(`✅ ${contractName}.${entrypoint} completado (MOCK):`, {
        contractAddress: CONTRACT_ADDRESSES[contractName],
        entrypoint,
        calldata,
        walletAddress,
        mockTransactionHash
      });

      const successResult: ChipiContractCallResult = {
        success: true,
        data: { mockResult: 'success' },
        transactionHash: mockTransactionHash
      };

      setTransactionHash(successResult.transactionHash!);
      
      if (options.showToast !== false) {
        toast.success(`Transaction successful!`);
      }
      
      options.onSuccess?.(successResult);
      return successResult;

    } catch (err: any) {
      const errorMessage = err?.message || 'Contract call failed';
      console.error(`❌ Error en ${contractName}.${entrypoint}:`, err);
      
      setError(errorMessage);
      
      if (options.showToast !== false) {
        toast.error(`Transaction failed: ${errorMessage}`);
      }
      
      const errorResult: ChipiContractCallResult = {
        success: false,
        error: errorMessage
      };
      
      options.onError?.(errorMessage);
      return errorResult;

    } finally {
      setIsExecuting(false);
    }
  };

  const resetState = () => {
    setError(null);
    setTransactionHash(null);
    setIsExecuting(false);
  };

  return {
    executeCall,
    resetState,
    isExecuting,
    error,
    transactionHash,
    canExecute: !isExecuting
  };
}