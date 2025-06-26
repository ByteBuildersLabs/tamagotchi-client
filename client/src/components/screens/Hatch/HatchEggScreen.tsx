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

// Beast params y mapping imports
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
  // 🔥 FIXED: Refs to prevent infinite re-renders - properly initialized
  const mountedRef = useRef(true);
  const paramsLoggedRef = useRef(false);

  // 🔥 NEW: Ensure mounted ref stays true
  useEffect(() => {
    mountedRef.current = true;
    console.log("🔄 [HATCH-MOUNT] Component mounted, mountedRef set to true");
    
    return () => {
      console.log("🔄 [HATCH-MOUNT] Component unmounting, mountedRef set to false");
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

  // Only log once per mount to prevent spam
  useEffect(() => {
    if (!paramsLoggedRef.current) {
      console.log("🥚 [HATCH] Initializing with params:", beastParams);
      console.log("🥚 [HATCH] Using egg type:", eggType);
      console.log("🐾 [HATCH] Expected beast:", beastDisplayInfo);
      paramsLoggedRef.current = true;
    }
  }, []);

  // Hook with progressive effects
  const {
    currentFrame,
    eggState,
    startHatching: startEggHatching,
    canClick,
    showBeast,
    glowLevel
  } = useEggAnimation(eggType);

  // 🔥 NEW: Debug egg animation state
  useEffect(() => {
    console.log("🥚 [HATCH-DEBUG] Egg animation state:", {
      currentFrame,
      eggState,
      canClick,
      showBeast,
      glowLevel
    });
  }, [currentFrame, eggState, canClick, showBeast, glowLevel]);

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
   * 🔥 FIXED: Enhanced hatching function with proper mount check
   */
  const handleHatchEgg = useCallback(async () => {
    console.log("🔥 [HATCH-CLICK] Hatch egg clicked!");
    console.log("🔥 [HATCH-CLICK] Current state:", {
      canClick,
      isSpawning,
      eggState,
      mounted: mountedRef.current
    });

    // 🔥 REMOVED: Mount check that was causing issues
    // The component should be mounted if this function is called

    if (!canClick) {
      console.log("❌ [HATCH-CLICK] Cannot click (canClick: false)");
      return;
    }

    if (isSpawning) {
      console.log("❌ [HATCH-CLICK] Already spawning, aborting");
      return;
    }

    try {
      console.log("🎬 [HATCH-CLICK] Starting egg animation...");
      // Step 1: Start egg animation
      startEggHatching();

      console.log("🚀 [HATCH-CLICK] Starting beast spawn with params:", beastParams);
      
      // Step 2: Execute beast spawn transaction
      const result = await spawnBeast(beastParams);
      
      console.log("📊 [HATCH-CLICK] Spawn result:", result);
      
      if (result.success) {
        console.log("✅ [HATCH-CLICK] Beast spawn transaction successful");
        toast.success(`🐾 ${beastDisplayInfo.displayName} spawned!`, {
          duration: 3000,
          position: 'top-center'
        });
      } else {
        console.error("❌ [HATCH-CLICK] Beast spawn failed:", result.error);
        toast.error(`Spawn failed: ${result.error}`, {
          duration: 4000,
          position: 'top-center'
        });
      }
    } catch (error) {
      console.error("❌ [HATCH-CLICK] Error during beast spawn:", error);
      toast.error("Beast spawn failed. Please try again.", {
        duration: 4000,
        position: 'top-center'
      });
    }
  }, [canClick, isSpawning, eggState, startEggHatching, beastParams, spawnBeast, beastDisplayInfo]);

  /**
   * Handle continue button with direct store access
   */
  const handleContinue = useCallback(() => {
    // Use direct store access to get fresh state
    const isBeastReady = useAppStore.getState().hasLiveBeast();
    
    console.log("🔄 [HATCH] Continue check:", {
      spawnCompleted,
      isBeastReady,
      canContinue: spawnCompleted || isBeastReady
    });

    if (!spawnCompleted && !isBeastReady) {
      toast("Please wait for beast spawn to complete", {
        duration: 2000,
        position: 'top-center',
        icon: '⏳'
      });
      return;
    }

    console.log("✅ [HATCH] Continuing to home screen");
    onLoadingComplete();
  }, [spawnCompleted, onLoadingComplete]);

  /**
   * Handle transaction status updates
   */
  useEffect(() => {
    if (txHash && txStatus === 'SUCCESS') {
      console.log("✅ [HATCH] Transaction confirmed:", txHash);
      toast.success('Transaction confirmed!', {
        duration: 2000,
        position: 'top-center'
      });
    } else if (txHash && txStatus === 'REJECTED') {
      console.error("❌ [HATCH] Transaction failed:", txHash);
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
      console.error('❌ [HATCH] Beast spawn error:', spawnError);
      toast.error(`Beast spawn error: ${spawnError}`, {
        duration: 4000,
        position: 'top-center'
      });
    }
  }, [spawnError]);

  /**
   * Monitor spawn completion for debugging
   */
  useEffect(() => {
    if (spawnCompleted) {
      console.log("🎉 [HATCH] Spawn completed successfully!");
      
      // Check store state for debugging
      const storeState = useAppStore.getState();
      console.log("🔍 [HATCH] Store state after completion:", {
        hasLiveBeast: storeState.hasLiveBeast(),
        liveBeast: storeState.liveBeast
      });
    }
  }, [spawnCompleted]);

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
    const canShow = eggRevealed && (spawnCompleted || directHasLiveBeast);
    
    if (canShow) {
      console.log("🔄 [HATCH] Continue button should be visible:", {
        eggRevealed,
        spawnCompleted,
        directHasLiveBeast
      });
    }
    
    return canShow;
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

        {/* 🔥 ENHANCED: Egg Display with debug info */}
        {!showBeast && (
          <div className="relative">
            {/* Debug overlay for click area */}
            {process.env.NODE_ENV === 'development' && (
              <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white p-2 rounded text-xs z-50">
                <div>Can Click: {canClick ? 'YES' : 'NO'}</div>
                <div>Is Spawning: {isSpawning ? 'YES' : 'NO'}</div>
                <div>Egg State: {eggState}</div>
                <div>Frame: {currentFrame}</div>
              </div>
            )}
            
            <EggDisplay
              currentFrame={currentFrame}
              eggType={eggType}
              eggState={eggState}
              canClick={canClick && !isSpawning}
              glowLevel={glowLevel}
              onHatch={handleHatchEgg}
            />
            
            {/* 🔥 NEW: Fallback click area for debugging */}
            {process.env.NODE_ENV === 'development' && (
              <div 
                className="absolute inset-0 border-2 border-red-500 border-dashed cursor-pointer"
                onClick={() => {
                  console.log("🔥 [DEBUG] Fallback click area clicked!");
                  handleHatchEgg();
                }}
                style={{ pointerEvents: canClick && !isSpawning ? 'auto' : 'none' }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                  CLICK HERE (DEBUG)
                </div>
              </div>
            )}
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

        {/* 🔥 ENHANCED: Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs max-w-xs z-50">
            <div>🥚 Egg State: {eggState}</div>
            <div>🖱️ Can Click: {canClick ? 'YES' : 'NO'}</div>
            <div>🔄 Is Spawning: {isSpawning ? 'YES' : 'NO'}</div>
            <div>👁️ Show Beast: {showBeast ? 'YES' : 'NO'}</div>
            <div>✅ Spawn Completed: {spawnCompleted ? 'YES' : 'NO'}</div>
            <div>🐾 Has Live Beast: {useAppStore.getState().hasLiveBeast() ? 'YES' : 'NO'}</div>
            <div>🚀 Can Continue: {canContinueCalc ? 'YES' : 'NO'}</div>
            <div>📡 TX Status: {txStatus || 'None'}</div>
            <div>🎬 Frame: {currentFrame}</div>
            <div>🏠 Mounted: {mountedRef.current ? 'YES' : 'NO'}</div>
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