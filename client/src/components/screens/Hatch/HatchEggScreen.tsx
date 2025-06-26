import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo } from "react";
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
  // Determinar eggType usando helper function
  const eggType: EggType = getEggTypeBySpecie(beastParams.specie);
  
  // Obtener información de display de la bestia
  const beastDisplayInfo = useMemo(() => {
    return getBeastDisplayInfo(beastParams.specie, beastParams.beast_type);
  }, [beastParams.specie, beastParams.beast_type]);

  // Obtener asset correcto basado en beastParams reales
  const correctBeastAsset = useMemo(() => {
    // Mapear beast type numérico a string para acceder a BEAST_ASSETS
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

  console.log("🥚 Hatching with params:", beastParams);
  console.log("🥚 Using egg type:", eggType);
  console.log("🐾 Expected beast:", beastDisplayInfo);

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
   * Enhanced hatching function con parámetros específicos
   */
  const handleHatchEgg = async () => {
    // Step 1: Start egg animation
    startEggHatching();

    // Step 2: Execute beast spawn transaction con parámetros predeterminados
    try {
      console.log("🚀 Spawning beast with predetermined params:", beastParams);
      
      const result = await spawnBeast(beastParams);
      
      if (result.success) {
        // Toast success message con nombre específico
        toast.success(`🐾 ${beastDisplayInfo.displayName} spawned!`, {
          duration: 3000,
          position: 'top-center'
        });
      } else {
        // Show error but don't break the animation
        toast.error(`Spawn failed: ${result.error}`, {
          duration: 4000,
          position: 'top-center'
        });
      }
    } catch (error) {
      console.error("Error during beast spawn:", error);
      
      // Show error but don't break the animation
      toast.error("Beast spawn failed. Please try again.", {
        duration: 4000,
        position: 'top-center'
      });
    }
  };

  /**
   * 🔥 UPDATED: Handle continue button using optimized store getter
   */
  const handleContinue = () => {
    // 🔥 NEW: Use optimized store getter instead of manual logic
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
  };

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
      console.error('Beast spawn error:', spawnError);
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
      if (isSpawning) {
        resetSpawner();
      }
    };
  }, [isSpawning, resetSpawner]);

  // 🔥 UPDATED: Use optimized store getter for continue button logic
  const directHasLiveBeast = useAppStore(state => state.hasLiveBeast());

  const canContinue = eggState === 'revealing' && showBeast && (spawnCompleted || directHasLiveBeast);
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
        onComplete={() => {}} // Simplified completion handler
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
          <EggDisplay
            currentFrame={currentFrame}
            eggType={eggType}
            eggState={eggState}
            canClick={canClick && !isSpawning} // Disable clicking during spawn
            glowLevel={glowLevel}
            onHatch={handleHatchEgg}
          />
        )}

        {/* Beast Display */}
        {showBeast && (
          <BeastDisplay
            beastAsset={correctBeastAsset}
            beastType={beastDisplayInfo.displayName}
          />
        )}

        {/* Continue Button - only show when everything is complete */}
        {canContinue && (
          <ContinueButton onContinue={handleContinue} />
        )}

        {/* Wait message if animation done but spawn not complete */}
        {eggState === 'revealing' && showBeast && !spawnCompleted && !directHasLiveBeast && (
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

      {/* Toast Container for status updates */}
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