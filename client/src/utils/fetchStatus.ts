import { Account } from 'starknet';

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
 * @param account - Connected Starknet account
 * @returns Array of status values as numbers or undefined if failed
 */
const fetchStatus = async (account: Account): Promise<number[] | undefined> => {
  console.info('Fetching real-time status for:', String(account?.address));
  
  try {
    const response = await account?.callContract({
      contractAddress: "0x782425ff2132a84992b9e9e497c1305a7e48f6cf3928fd93b7e44ed8efea2ad",
      entrypoint: "get_timestamp_based_status_with_address",
      calldata: [String(account?.address)],
    });
    
    return hexToDecimalArray(response);
  } catch (err) {
    console.error('❌ Failed to fetch real-time status:', err);
    return undefined;
  }
};

export default fetchStatus;