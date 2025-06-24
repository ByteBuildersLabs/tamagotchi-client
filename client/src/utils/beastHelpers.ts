/**
 * Beast utility functions and helpers
 * Used for beast spawning and management
 */

// Beast species constants (1-3 as per contract requirements)
export const BEAST_SPECIES = {
  SPECIES_1: 1,
  SPECIES_2: 2, 
  SPECIES_3: 3
} as const;

// Beast type constants (same as species based on contract tests)
export const BEAST_TYPES = {
  TYPE_1: 1,
  TYPE_2: 2,
  TYPE_3: 3
} as const;

// Type definitions
export type BeastSpecies = typeof BEAST_SPECIES[keyof typeof BEAST_SPECIES];
export type BeastType = typeof BEAST_TYPES[keyof typeof BEAST_TYPES];

// Beast spawn parameters interface
export interface BeastSpawnParams {
  specie: BeastSpecies;
  beast_type: BeastType;
}

/**
 * Generates random beast spawn parameters
 * Returns specie and beast_type values (1-3) required by the spawn_beast contract function
 * 
 * @returns BeastSpawnParams object with random specie and beast_type
 */
export const generateRandomBeastParams = (): BeastSpawnParams => {
  // Generate random number between 1 and 3 (inclusive)
  const randomValue = Math.floor(Math.random() * 3) + 1;
  
  // Based on contract tests, beast_type should match specie
  const specie = randomValue as BeastSpecies;
  const beast_type = randomValue as BeastType;
  
  return {
    specie,
    beast_type
  };
};

/**
 * Validates beast spawn parameters
 * Ensures specie and beast_type are within valid range (1-3)
 * 
 * @param params - Beast spawn parameters to validate
 * @returns boolean indicating if parameters are valid
 */
export const validateBeastParams = (params: BeastSpawnParams): boolean => {
  const { specie, beast_type } = params;
  
  // Check if values are within valid range (1-3)
  const isSpecieValid = specie >= 1 && specie <= 3;
  const isBeastTypeValid = beast_type >= 1 && beast_type <= 3;
  
  if (!isSpecieValid) {
    console.error(`Invalid specie: ${specie}. Must be between 1-3`);
    return false;
  }
  
  if (!isBeastTypeValid) {
    console.error(`Invalid beast_type: ${beast_type}. Must be between 1-3`);
    return false;
  }
  
  return true;
};

/**
 * Gets beast species name for display purposes
 * Maps numeric specie values to user-friendly names
 * 
 * @param specie - Numeric specie value (1-3)
 * @returns Display name for the specie
 */
export const getBeastSpecieName = (specie: BeastSpecies): string => {
  switch (specie) {
    case BEAST_SPECIES.SPECIES_1:
      return "Shadow Beast";
    case BEAST_SPECIES.SPECIES_2:
      return "Fire Beast";
    case BEAST_SPECIES.SPECIES_3:
      return "Water Beast";
    default:
      return "Unknown Beast";
  }
};

/**
 * Gets beast type name for display purposes
 * Maps numeric beast_type values to user-friendly names
 * 
 * @param beastType - Numeric beast_type value (1-3)
 * @returns Display name for the beast type
 */
export const getBeastTypeName = (beastType: BeastType): string => {
  switch (beastType) {
    case BEAST_TYPES.TYPE_1:
      return "Shadow Type";
    case BEAST_TYPES.TYPE_2:
      return "Fire Type";
    case BEAST_TYPES.TYPE_3:
      return "Water Type";
    default:
      return "Unknown Type";
  }
};

/**
 * Gets beast display information combining specie and type
 * Useful for UI components that need to show beast information
 * 
 * @param specie - Numeric specie value
 * @param beastType - Numeric beast_type value
 * @returns Object with display names and combined info
 */
export const getBeastDisplayInfo = (specie: BeastSpecies, beastType: BeastType) => {
  return {
    specieName: getBeastSpecieName(specie),
    typeName: getBeastTypeName(beastType),
    displayName: getBeastSpecieName(specie), // Since specie and type are the same
    specie,
    beastType
  };
};

/**
 * Creates a deterministic beast based on a seed (useful for testing)
 * 
 * @param seed - Number to use as seed for deterministic generation
 * @returns BeastSpawnParams with deterministic values
 */
export const generateDeterministicBeastParams = (seed: number): BeastSpawnParams => {
  // Use modulo to ensure we stay within 1-3 range
  const value = (seed % 3) + 1;
  
  return {
    specie: value as BeastSpecies,
    beast_type: value as BeastType
  };
};