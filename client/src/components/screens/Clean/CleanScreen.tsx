import { TamagotchiTopBar } from "../../layout/TopBar";
import { useState } from "react";
import { motion } from "framer-motion";
import cleanBackground from "../../../assets/backgrounds/bg-clean.png";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";
import RainParticles from "./components/RainParticles";
import { CleanScreenProps } from "../../types/clean.types";

// Universal hook for beast display
import { useBeastDisplay } from "../../../dojo/hooks/useBeastDisplay";

// Hooks
import { useCloudAnimation } from "./components/hooks/useCloudAnimation";
import { useRainSystem } from "./components/hooks/useRainSystem";

// Components
import { CloudController } from "./components/CloudController";
import { BeastDisplay } from "./components/BeastDisplay";

// Assets
import cloudOff from "../../../assets/icons/cloud/icon-cloud.png";

export const CleanScreen = ({ 
  onNavigation,
  rainDuration = 20 
}: CleanScreenProps) => {
  // Universal hook - gets the player's current beast
  const {
    currentBeastDisplay,
    liveBeastStatus,
    hasLiveBeast,
    isLoading
  } = useBeastDisplay();

  const [isCloudOn, setIsCloudOn] = useState(true);
  
  // Custom hooks to handle specific logic for rain and cloud animations
  const cloudFrames = [cloudOff];
  const { 
    frameIndex, 
    stopAnimation, 
    startAnimation 
  } = useCloudAnimation(cloudFrames);
  
  const { 
    isRainActive, 
    startRain, 
    handleRainComplete,
    duration: rainSystemDuration 
  } = useRainSystem(rainDuration);

  const handleCloudClick = () => {
    if (isCloudOn) {
      stopAnimation();
      startRain();
    } else {
      startAnimation();
    }
    setIsCloudOn(!isCloudOn);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-900 to-blue-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-white">Loading your beast...</p>
        </div>
      </div>
    );
  }

  // No beast case
  if (!hasLiveBeast || !currentBeastDisplay) {
    return (
      <div 
        className="relative min-h-screen w-full flex flex-col items-center overflow-hidden font-rubik"
        style={{
          backgroundImage: `url(${cleanBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <MagicalSparkleParticles />
        
        {/* Top Bar with empty status */}
        <TamagotchiTopBar
          coins={12345}
          gems={678}
          status={{ energy: 0, hunger: 0, happiness: 0, hygiene: 0 }}
        />

        <div className="flex-grow flex items-center justify-center w-full">
          <div className="text-center space-y-6 z-10">
            <div className="text-6xl opacity-50">🧼</div>
            <h2 className="text-2xl font-luckiest text-cream drop-shadow-lg">
              No Beast to Clean!
            </h2>
            <p className="text-white/80 drop-shadow-md">
              You need a beast to use the cleaning feature
            </p>
            <button 
              onClick={() => onNavigation("home")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center overflow-hidden font-rubik"
      style={{
        backgroundImage: `url(${cleanBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Particle Effects */}
      <MagicalSparkleParticles />
      <RainParticles
        isActive={isRainActive}
        duration={rainSystemDuration}
        onComplete={handleRainComplete}
      />

      {/* Top Bar - Using real data from liveBeastStatus */}
      <TamagotchiTopBar
        coins={12345} // TODO: Make dynamic when coin system is implemented
        gems={678}    // TODO: Make dynamic when gem system is implemented
        status={{
          energy: liveBeastStatus?.energy || 0,
          hunger: liveBeastStatus?.hunger || 0,
          happiness: liveBeastStatus?.happiness || 0,
          hygiene: liveBeastStatus?.hygiene || 0
        }}
      />

      {/* Main Content */}
      <div className="flex flex-col items-center mt-8 space-y-6 z-10 pointer-events-none select-none">
        {/* Header - Dynamic with beast name */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl md:text-3xl font-luckiest text-cream drop-shadow-lg pointer-events-auto"
        >
          Clean Your {currentBeastDisplay.displayName}
        </motion.h1>
        
        {/* Modular components */}
        <CloudController
          onCloudClick={handleCloudClick}
          cloudFrames={cloudFrames}
          currentFrameIndex={frameIndex} 
          isCloudOn={false} 
          isAnimating={false}
        />
        
        {/* Beast Display */}
        <BeastDisplay 
          beastImage={currentBeastDisplay.asset}
          altText={`${currentBeastDisplay.displayName} getting cleaned`}
        />
      </div>
    </div>
  );
};