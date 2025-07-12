import { AccountInterface } from 'starknet';

/**
 * Converts hex array to decimal numbers
 */
const hexToDecimalArray = (hexArray: string[] | undefined): number[] | undefined => {
  if (!hexArray) return undefined;
  return hexArray.map(hexString => parseInt(hexString, 16));
};

/**
 * Fetches real-time beast status from contract using read call
 * This is a gas-free call that can be made frequently
 * 
 * Enhanced to handle the "Option::unwrap failed" error gracefully
 * This error occurs when a player has no live beast, which is a valid state
 * 
 * @param account - Connected Starknet account interface
 * @returns Array of status values as numbers, undefined if no beast exists, or null if error
 */
const fetchStatus = async (account: AccountInterface): Promise<number[] | undefined | null> => {
  console.info('📡 Fetching real-time status for:', String(account?.address));
  
  try {
    const response = await account?.callContract({
      contractAddress: "0x5ca90d27bd019b06be5375af35d3075d4c8ee847e0221aae83565525eeb95fd",
      entrypoint: "get_timestamp_based_status_with_address",
      calldata: [String(account?.address)],
    });
    
    const result = hexToDecimalArray(response);
    return result;
    
  } catch (err: any) {
    // Check if this is the expected "no beast" error
    const errorMessage = err?.message || '';
    const isNoBeastError = errorMessage.includes('Option::unwrap failed');
    
    if (isNoBeastError) {
      console.info('No live beast found for player (Option::unwrap failed) - this is expected');
      return undefined; // undefined = no beast exists (expected)
    }
    
    // For other errors, log as actual errors
    console.error('❌ Unexpected error fetching status:', err);
    return null; // null = actual error occurred
  }
};

export default fetchStatus;