/**
 * MIGRACIÓN GRADUAL: Cartridge Controller → Chipi SDK
 * 
 * Este archivo permite cambiar entre los hooks originales y los nuevos
 * sin breaking changes. Simplemente cambia USE_CHIPI_HOOKS a true
 * para activar los hooks de Chipi.
 * 
 * 🔄 Proceso de migración:
 * 1. Fase 1: USE_CHIPI_HOOKS = false (usar hooks originales)
 * 2. Fase 2: USE_CHIPI_HOOKS = true (usar hooks Chipi - TESTING)
 * 3. Fase 3: Remover hooks originales cuando Chipi esté completamente probado
 */

// 🚨 TOGGLE DE MIGRACIÓN - Cambia a true para usar hooks Chipi
export const USE_CHIPI_HOOKS = true;

// Importaciones de hooks originales (Cartridge)
import { useFeedBeast as useFeedBeastOriginal } from './useFeedBeast';
import { useCleanBeast as useCleanBeastOriginal } from './useCleanBeast';
import { useSleepAwake as useSleepAwakeOriginal } from './useSleepAwake';
import { useSpawnBeast as useSpawnBeastOriginal } from './useSpawnBeast';
import { useSpawnPlayer as useSpawnPlayerOriginal } from './useSpawnPlayer';
import { useUpdateBeast as useUpdateBeastOriginal } from './useUpdateBeast';

// Importaciones de hooks Chipi
import { useChipiFeedBeast } from './useChipiFeedBeast';
import { useChipiCleanBeast } from './useChipiCleanBeast';
import { useChipiSleepAwake } from './useChipiSleepAwake';
import { useChipiSpawnBeast } from './useChipiSpawnBeast';
import { useChipiSpawnPlayer } from './useChipiSpawnPlayer';
import { useChipiUpdateBeast } from './useChipiUpdateBeast';

/**
 * 🍽️ Hook de Feed Beast - Migración gradual
 * Cambia automáticamente entre Cartridge y Chipi según USE_CHIPI_HOOKS
 */
export const useFeedBeast = USE_CHIPI_HOOKS ? useChipiFeedBeast : useFeedBeastOriginal;

/**
 * 🧽 Hook de Clean Beast - Migración gradual
 * Cambia automáticamente entre Cartridge y Chipi según USE_CHIPI_HOOKS
 */
export const useCleanBeast = USE_CHIPI_HOOKS ? useChipiCleanBeast : useCleanBeastOriginal;

/**
 * 😴 Hook de Sleep/Awake Beast - Migración gradual
 * Cambia automáticamente entre Cartridge y Chipi según USE_CHIPI_HOOKS
 */
export const useSleepAwake = USE_CHIPI_HOOKS ? useChipiSleepAwake : useSleepAwakeOriginal;

/**
 * 🐣 Hook de Spawn Beast - Migración gradual
 * Cambia automáticamente entre Cartridge y Chipi según USE_CHIPI_HOOKS
 */
export const useSpawnBeast = USE_CHIPI_HOOKS ? useChipiSpawnBeast : useSpawnBeastOriginal;

/**
 * 👤 Hook de Spawn Player - Migración gradual
 * Cambia automáticamente entre Cartridge y Chipi según USE_CHIPI_HOOKS
 */
export const useSpawnPlayer = USE_CHIPI_HOOKS ? useChipiSpawnPlayer : useSpawnPlayerOriginal;

/**
 * 🔄 Hook de Update Beast - Migración gradual
 * Cambia automáticamente entre Cartridge y Chipi según USE_CHIPI_HOOKS
 */
export const useUpdateBeast = USE_CHIPI_HOOKS ? useChipiUpdateBeast : useUpdateBeastOriginal;

/**
 * 📊 Información de migración para debugging
 */
export const getMigrationInfo = () => {
  return {
    isUsingChipi: USE_CHIPI_HOOKS,
    framework: USE_CHIPI_HOOKS ? 'Chipi SDK' : 'Cartridge Controller',
    migratedHooks: [
      { name: 'useFeedBeast', migrated: true, active: USE_CHIPI_HOOKS },
      { name: 'useCleanBeast', migrated: true, active: USE_CHIPI_HOOKS },
      { name: 'useSleepAwake', migrated: true, active: USE_CHIPI_HOOKS },
      { name: 'useSpawnBeast', migrated: true, active: USE_CHIPI_HOOKS },
      { name: 'useSpawnPlayer', migrated: true, active: USE_CHIPI_HOOKS },
      { name: 'useUpdateBeast', migrated: true, active: USE_CHIPI_HOOKS },
    ],
    totalProgress: '6/6 hooks migrated (100%)'
  };
};

// Log de migración para debugging
if (typeof window !== 'undefined') {
  console.log('🔄 MIGRATION STATUS:', getMigrationInfo());
}