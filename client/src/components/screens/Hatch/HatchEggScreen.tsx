import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useCallback } from "react";
import toast, { Toaster } from 'react-hot-toast';
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";
import { useEggAnimation } from "./hooks/useEggAnimation";
import type { EggType } from "./components/eggAnimation";
import { useMegaBurstEffect } from "./hooks/useMegaBurstEffect";
import { EggDisplay } from "./components/EggDisplay";
import { BeastDisplay } from "./components/BeastDisplay";
import { HatchHeader } from "./components/HatchHeader";
import { ContinueButton } from "./components/ContinueButton";
import { FullScreenFlash } from "./components/FullScreenFlash";
import MegaBurstParticles from "./components/MegaBurstParticles";

// Dojo hooks
import { useSpawnBeast } from "../../../dojo/hooks/useSpawnBeast";
import useAppStore from '../../../zustand/store';

// Beast params and mapping imports
import type { BeastSpawnParams } from "../../../utils/beastHelpers";
import { getBeastDisplayInfo } from "../../../utils/beastHelpers";
import { getEggTypeBySpecie, BEAST_ASSETS } from "./components/eggAnimation";

// Assets
import forestBackground from "../../../assets/backgrounds/bg-home.png";

interface HatchEggScreenProps {
  onLoadingComplete: () => void;
  beastParams: BeastSpawnParams;
}

export const HatchEggScreen = ({ onLoadingComplete, beastParams }: HatchEggScreenProps) => {
  // Refs to prevent infinite re-renders
  const mountedRef = useRef(true);

  // Ensure mounted ref stays true during component lifecycle
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Memoize static values to prevent re-calculations
  const eggType: EggType = useMemo(() => getEggTypeBySpecie(beastParams.specie), [beastParams.specie]);
  
  const beastDisplayInfo = useMemo(() => {
    return getBeastDisplayInfo(beastParams.specie, beastParams.beast_type);
  }, [beastParams.specie, beastParams.beast_type]);

  const correctBeastAsset = useMemo(() => {
    const getBeastTypeString = (beastType: number): 'wolf' | 'dragon' | 'snake' => {
      switch (beastType) {
        case 1: return 'wolf';
        case 2: return 'dragon';  
        case 3: return 'snake';
        default: return 'wolf';
      }
    };
    
    const beastTypeString = getBeastTypeString(beastParams.beast_type);
    return BEAST_ASSETS[beastTypeString];
  }, [beastParams.beast_type]);

  // Hook with progressive effects
  const {
    currentFrame,
    eggState,
    startHatching: startEggHatching,
    canClick,
    showBeast,
    glowLevel
  } = useEggAnimation(eggType);

  // Mega-burst effects hook
  const { showMegaBurst, showFullScreenFlash } = useMegaBurstEffect(eggState);

  // Beast spawning hook
  const {
    spawnBeast,
    isSpawning,
    completed: spawnCompleted,
    error: spawnError,
    currentStep,
    txHash,
    txStatus,
    resetSpawner
  } = useSpawnBeast();

  /**
   * Enhanced hatching function with proper state checks
   */
  const handleHatchEgg = useCallback(async () => {
    if (!canClick) return;

    if (isSpawning) return;

    try {
      // Step 1: Start egg animation
      startEggHatching();
      
      // Step 2: Execute beast spawn transaction
      const result = await spawnBeast(beastParams);
      
      if (result.success) {
        toast.success(`🐾 ${beastDisplayInfo.displayName} spawned!`, {
          duration: 3000,
          position: 'top-center'
        });
      } else {
        toast.error(`Spawn failed: ${result.error}`, {
          duration: 4000,
          position: 'top-center'
        });
      }
    } catch (error) {
      toast.error("Beast spawn failed. Please try again.", {
        duration: 4000,
        position: 'top-center'
      });
    }
  }, [canClick, isSpawning, startEggHatching, beastParams, spawnBeast, beastDisplayInfo]);

  /**
   * Handle continue button with direct store access
   */
  const handleContinue = useCallback(() => {
    // Use direct store access to get fresh state
    const isBeastReady = useAppStore.getState().hasLiveBeast();
    
    if (!spawnCompleted && !isBeastReady) {
      toast("Please wait for beast spawn to complete", {
        duration: 2000,
        position: 'top-center',
        icon: '⏳'
      });
      return;
    }

    onLoadingComplete();
  }, [spawnCompleted, onLoadingComplete]);

  /**
   * Handle transaction status updates
   */
  useEffect(() => {
    if (txHash && txStatus === 'SUCCESS') {
      toast.success('Transaction confirmed!', {
        duration: 2000,
        position: 'top-center'
      });
    } else if (txHash && txStatus === 'REJECTED') {
      toast.error('Transaction failed!', {
        duration: 4000,
        position: 'top-center'
      });
    }
  }, [txHash, txStatus]);

  /**
   * Handle spawn errors
   */
  useEffect(() => {
    if (spawnError) {
      toast.error(`Beast spawn error: ${spawnError}`, {
        duration: 4000,
        position: 'top-center'
      });
    }
  }, [spawnError]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (isSpawning) {
        resetSpawner();
      }
    };
  }, [isSpawning, resetSpawner]);

  // Calculate continue button logic without reactive dependencies
  const canContinueCalc = useMemo(() => {
    const eggRevealed = eggState === 'revealing' && showBeast;
    const directHasLiveBeast = useAppStore.getState().hasLiveBeast();
    return eggRevealed && (spawnCompleted || directHasLiveBeast);
  }, [eggState, showBeast, spawnCompleted]);

  const showSpawnProgress = isSpawning || (txHash && txStatus === 'PENDING');

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-rubik"
      style={{
        backgroundImage: `url(${forestBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Base Magical Sparkle Particles */}
      <MagicalSparkleParticles />

      {/* Mega-burst of saturated flashes */}
      <MegaBurstParticles
        trigger={showMegaBurst}
        eggPosition={{ x: 50, y: 50 }}
        onComplete={() => {}}
      />

      {/* Full-screen prolonged flash */}
      <AnimatePresence>
        {showFullScreenFlash && <FullScreenFlash />}
      </AnimatePresence>

      {/* Content Container */}
      <div className="flex flex-col items-center justify-center space-y-8 z-50 px-4">
        {/* Header */}
        <HatchHeader 
          showBeast={showBeast} 
          beastType={beastDisplayInfo.displayName} 
          eggState={eggState} 
        />

        {/* Spawn Progress Indicator */}
        {showSpawnProgress && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              <span className="text-sm font-medium text-gray-700">
                {isSpawning ? `Spawning ${beastDisplayInfo.displayName}... (${currentStep})` : 'Transaction pending...'}
              </span>
            </div>
          </div>
        )}

        {/* Egg Display */}
        {!showBeast && (
          <div className="relative">
            <EggDisplay
              currentFrame={currentFrame}
              eggType={eggType}
              eggState={eggState}
              canClick={canClick && !isSpawning}
              glowLevel={glowLevel}
              onHatch={handleHatchEgg}
            />
          </div>
        )}

        {/* Beast Display */}
        {showBeast && (
          <BeastDisplay
            beastAsset={correctBeastAsset}
            beastType={beastDisplayInfo.displayName}
          />
        )}

        {/* Continue Button */}
        {canContinueCalc && (
          <ContinueButton onContinue={handleContinue} />
        )}

        {/* Wait message if animation done but spawn not complete */}
        {eggState === 'revealing' && showBeast && !spawnCompleted && !canContinueCalc && (
          <div className="bg-amber-100 border border-amber-400 rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
              <span className="text-sm font-medium text-amber-800">
                Finalizing {beastDisplayInfo.displayName} creation...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Toast Container */}
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
    </div>
  );
};