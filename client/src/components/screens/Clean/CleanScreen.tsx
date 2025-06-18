import { TamagotchiTopBar } from "../../layout/TopBar";
import { useState } from "react";
import { motion } from "framer-motion";
import cleanBackground from "../../../assets/backgrounds/bg-clean.png";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";
import RainParticles from "./components/RainParticles";
import { CleanScreenProps } from "../../types/clean.types";

// Hooks
import { useCloudAnimation } from "./components/hooks/useCloudAnimation";
import { useRainSystem } from "./components/hooks/useRainSystem";

// Components
import { CloudController } from "./components/CloudController";
import { BeastDisplay } from "./components/BeastDisplay";

// Assets
import babyWorlfBeast from "../../../assets/beasts/baby-wolf.png";
import cloudOff from "../../../assets/icons/cloud/icon-cloud.png";

export const CleanScreen = ({ 
  rainDuration = 20 
}: CleanScreenProps) => {
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

      {/* Top Bar */}
      <TamagotchiTopBar
        coins={12345}
        gems={678}
        status={{ energy: 85, hunger: 60, happiness: 75, hygiene: 90 }}
      />

      {/* Main Content */}
      <div className="flex flex-col items-center mt-8 space-y-6 z-10 pointer-events-none select-none">
        {/* Integrated Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl md:text-3xl font-luckiest text-cream drop-shadow-lg pointer-events-auto"
        >
          Clean Your Beast
        </motion.h1>
        
        {/* Modular components */}
        <CloudController
          onCloudClick={handleCloudClick}
          cloudFrames={cloudFrames}
          currentFrameIndex={frameIndex} isCloudOn={false} isAnimating={false}/>
        
        <BeastDisplay 
          beastImage={babyWorlfBeast}
          altText="Tamagotchi Beast"
        />
      </div>
    </div>
  );
};