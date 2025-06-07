import { AnimatePresence } from "framer-motion";
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
    startHatching,
    canClick,
    beastType,
    beastAsset,
    showBeast,
    glowLevel
  } = useEggAnimation(eggType);

  // Mega-burst effects hook
  const { showMegaBurst, showFullScreenFlash } = useMegaBurstEffect(eggState);

  // Function to handle the "Continue" button click
  const handleContinue = () => {
    console.log(`🎮 Continuing to home with ${beastType}...`);
    onLoadingComplete();
  };

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

        {/* Egg Display */}
        {!showBeast && (
          <EggDisplay
            currentFrame={currentFrame}
            eggType={eggType}
            eggState={eggState}
            canClick={canClick}
            glowLevel={glowLevel}
            onHatch={startHatching}
          />
        )}

        {/* Beast Display */}
        {showBeast && (
          <BeastDisplay
            beastAsset={beastAsset}
            beastType={beastType}
          />
        )}

        {/* Continue Button */}
        {eggState === 'revealing' && showBeast && (
          <ContinueButton onContinue={handleContinue} />
        )}
      </div>
    </div>
  );
};