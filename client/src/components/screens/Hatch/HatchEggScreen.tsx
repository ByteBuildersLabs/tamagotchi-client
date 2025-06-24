import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
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

// Assets
import forestBackground from "../../../assets/backgrounds/bg-home.png";

interface HatchEggScreenProps {
  onLoadingComplete: () => void;
  eggType?: EggType;
}

export const HatchEggScreen = ({ onLoadingComplete, eggType = 'shadow' }: HatchEggScreenProps) => {
  // Hook with progressive effects
  const {
    currentFrame,
    eggState,
    startHatching: startEggHatching,
    canClick,
    beastType,
    beastAsset,
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
    spawnedBeastParams,
    resetSpawner
  } = useSpawnBeast();

  /**
   * Enhanced hatching function that includes beast spawning
   */
  const handleHatchEgg = async () => {
    console.log("🥚 Starting egg hatching with beast spawn...");

    // Step 1: Start egg animation
    startEggHatching();

    // Step 2: Execute beast spawn transaction
    try {
      console.log("🐾 Spawning beast in contract...");
      const result = await spawnBeast();
      
      if (result.success) {
        console.log("✅ Beast spawned successfully!", {
          txHash: result.transactionHash,
          beastParams: result.beastParams
        });
        
        // Toast success message
        toast.success(`🐾 Beast spawned! Specie: ${result.beastParams?.specie}`, {
          duration: 3000,
          position: 'top-center'
        });
      } else {
        console.error("❌ Beast spawn failed:", result.error);
        
        // Show error but don't break the animation
        toast.error(`Spawn failed: ${result.error}`, {
          duration: 4000,
          position: 'top-center'
        });
      }
    } catch (error) {
      console.error("❌ Error during beast spawn:", error);
      
      // Show error but don't break the animation
      toast.error("Beast spawn failed. Please try again.", {
        duration: 4000,
        position: 'top-center'
      });
    }
  };

  /**
   * Handle continue button - check using direct store state
   */
  const handleContinue = () => {
    // Check beast status directly from store instead of reactive hook
    const currentStorePlayer = useAppStore.getState().player;
    const currentBeastStatuses = useAppStore.getState().beastStatuses;
    
    const isBeastReady = currentStorePlayer?.current_beast_id && 
      currentBeastStatuses.some(status => 
        status.beast_id === currentStorePlayer.current_beast_id && status.is_alive
      );

    if (!spawnCompleted && !isBeastReady) {
      console.log("⏳ Waiting for beast spawn to complete...");
      toast("Please wait for beast spawn to complete", {
        duration: 2000,
        position: 'top-center',
        icon: '⏳'
      });
      return;
    }

    console.log(`🎮 Continuing to cover with spawned beast...`, {
      beastType,
      spawnedParams: spawnedBeastParams,
      beastReady: isBeastReady
    });
    onLoadingComplete();
  };

  /**
   * Show spawn progress toasts
   */
  useEffect(() => {
    if (isSpawning && currentStep) {
      const stepMessages = {
        'preparing': '🔄 Preparing beast spawn...',
        'spawning': '📤 Spawning beast...',
        'confirming': '⏳ Confirming transaction...',
        'fetching': '🔄 Updating beast data...',
        'success': '✅ Beast spawn complete!'
      };

      if (stepMessages[currentStep as keyof typeof stepMessages]) {
        console.log(stepMessages[currentStep as keyof typeof stepMessages]);
      }
    }
  }, [isSpawning, currentStep]);

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
      console.error('🚨 Beast spawn error:', spawnError);
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

  // Determine if continue button should be enabled
  // Check directly from store instead of relying on reactive hooks
  const storePlayer = useAppStore(state => state.player);
  const storeBeastStatuses = useAppStore(state => state.beastStatuses);
  
  const directHasLiveBeast = storePlayer?.current_beast_id && 
    storeBeastStatuses.some(status => 
      status.beast_id === storePlayer.current_beast_id && status.is_alive
    );

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

      {/* 🌟💥 MEGA-BURST OF SATURATED FLASHES */}
      <MegaBurstParticles
        trigger={showMegaBurst}
        eggPosition={{ x: 50, y: 50 }}
        onComplete={() => console.log("🎇 Mega-burst of flashes completed!")}
      />

      {/* FULL-SCREEN PROLONGED FLASH */}
      <AnimatePresence>
        {showFullScreenFlash && <FullScreenFlash />}
      </AnimatePresence>

      {/* Content Container */}
      <div className="flex flex-col items-center justify-center space-y-8 z-50 px-4">
        {/* Header */}
        <HatchHeader 
          showBeast={showBeast} 
          beastType={beastType} 
          eggState={eggState} 
        />

        {/* Spawn Progress Indicator */}
        {showSpawnProgress && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              <span className="text-sm font-medium text-gray-700">
                {isSpawning ? `Spawning beast... (${currentStep})` : 'Transaction pending...'}
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
            onHatch={handleHatchEgg} // Use enhanced hatch function
          />
        )}

        {/* Beast Display */}
        {showBeast && (
          <BeastDisplay
            beastAsset={beastAsset}
            beastType={beastType}
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
                Finalizing beast creation...
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