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
  // Mounted ref to prevent updates after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Static memoized values
  const eggType: EggType = useMemo(
    () => getEggTypeBySpecie(beastParams.specie),
    [beastParams.specie]
  );
  const beastDisplayInfo = useMemo(
    () => getBeastDisplayInfo(beastParams.specie, beastParams.beast_type),
    [beastParams.specie, beastParams.beast_type]
  );
  const correctBeastAsset = useMemo(() => {
    const getBeastTypeString = (type: number): 'wolf' | 'dragon' | 'snake' => {
      switch (type) {
        case 1:
          return 'wolf';
        case 2:
          return 'dragon';
        case 3:
          return 'snake';
        default:
          return 'wolf';
      }
    };
    const beastTypeString = getBeastTypeString(beastParams.beast_type);
    return BEAST_ASSETS[beastTypeString];
  }, [beastParams.beast_type]);

  // Animation hooks
  const {
    currentFrame,
    eggState,
    startHatching: startEggHatching,
    canClick,
    showBeast,
    glowLevel
  } = useEggAnimation(eggType);
  const { showMegaBurst, showFullScreenFlash } = useMegaBurstEffect(eggState);

  // Spawn hook with sync
  const {
    spawnBeast,
    isSpawning,
    completed: spawnCompleted,
    error: spawnError,
    currentStep,
    txHash,
    txStatus,
    syncSuccess,
    resetSpawner
  } = useSpawnBeast();

  // Handle hatch click
  const handleHatchEgg = useCallback(async () => {
    if (!canClick || isSpawning) return;
    try {
      startEggHatching();
      console.log('🥚 Starting beast spawn with params:', beastParams);

      const result = await spawnBeast(beastParams);
      if (result.success) {
        if (result.syncSuccess) {
          toast.success(
            `🐾 ${beastDisplayInfo.displayName} spawned and ready!`,
            { duration: 3000, position: 'top-center' }
          );
        } else if (result.transactionHash) {
          toast.success(
            `🐾 ${beastDisplayInfo.displayName} spawned! (Syncing...)`,
            { duration: 4000, position: 'top-center' }
          );
        }
      } else {
        toast.error(
          `Spawn failed: ${result.error}`,
          { duration: 4000, position: 'top-center' }
        );
      }
    } catch (error) {
      console.error('❌ Beast spawn error:', error);
      toast.error(
        "Beast spawn failed. Please try again.",
        { duration: 4000, position: 'top-center' }
      );
    }
  }, [canClick, isSpawning, startEggHatching, spawnBeast, beastParams, beastDisplayInfo]);

  const handleContinue = useCallback(() => {
    
    const state = useAppStore.getState();
    const hasBeast = state.hasLiveBeast();

    if (!spawnCompleted && !hasBeast) {
      toast("Please wait for beast spawn to complete", {
        duration: 2000,
        position: 'top-center',
        icon: '⏳'
      });
      return;
    }

    if (!syncSuccess && !hasBeast) {
      toast("Beast is syncing... Please wait a moment", {
        duration: 3000,
        position: 'top-center',
        icon: '🔄'
      });
      return;
    }

    console.log('✅ Proceeding to next screen');
    onLoadingComplete();
  }, [spawnCompleted, syncSuccess, onLoadingComplete]);

  // Transaction status effects
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

  // Spawn error effect
  useEffect(() => {
    if (spawnError) {
      toast.error(
        `Beast spawn error: ${spawnError}`,
        { duration: 4000, position: 'top-center' }
      );
    }
  }, [spawnError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (isSpawning) resetSpawner();
    };
  }, [isSpawning, resetSpawner]);

  // Continue calculation
  const canContinueCalc = useMemo(() => {
    const eggRevealed = eggState === 'revealing' && showBeast;
    const hasLive = useAppStore.getState().hasLiveBeast();
    return eggRevealed && ((spawnCompleted && syncSuccess) || hasLive);
  }, [eggState, showBeast, spawnCompleted, syncSuccess]);

  const showSpawnProgress = isSpawning || (txHash && txStatus === 'PENDING');
  const showSyncProgress = spawnCompleted && !syncSuccess && currentStep === 'syncing';

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
                {isSpawning
                  ? `Spawning ${beastDisplayInfo.displayName}... (${currentStep})`
                  : 'Transaction pending...'}
              </span>
            </div>
          </div>
        )}

        {/* Sync Progress Indicator */}
        {showSyncProgress && (
          <div className="bg-blue-50/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-blue-200 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium text-blue-700">
                Synchronizing beast data...
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
        {canContinueCalc && <ContinueButton onContinue={handleContinue} />}

        {/* Wait messages with sync awareness */}
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
          }
        }}
      />
    </div>
  );
};