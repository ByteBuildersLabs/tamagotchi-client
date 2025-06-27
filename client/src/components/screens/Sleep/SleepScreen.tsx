import { TamagotchiTopBar } from "../../layout/TopBar";
import { motion } from "framer-motion";
import sleepBackground from "../../../assets/backgrounds/bg-sleep.png";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";
import { SleepScreenProps } from "../../types/sleep.types";

// Universal hook for beast display
import { useBeastDisplay } from "../../../dojo/hooks/useBeastDisplay";

// Hooks
import { useCampfireAnimation } from "./components/hooks/useCampfireAnimation";
import { useCampfireState } from "./components/hooks/useCampfireState";

// Components
import { CampfireController } from "./components/CampfireController";
import { BeastSleepDisplay } from "./components/BeastDisplay";

// Campfire animation assets
import extinguishedFrame0 from "../../../assets/icons/campfire/Animation/extinguished/extinguished-frame-0.png";
import extinguishedFrame1 from "../../../assets/icons/campfire/Animation/extinguished/extinguished-frame-1.png";
import extinguishedFrame2 from "../../../assets/icons/campfire/Animation/extinguished/extinguished-frame-4.png";
import extinguishedFrame3 from "../../../assets/icons/campfire/Animation/extinguished/extinguished-frame-3.png";
import extinguishedFrame4 from "../../../assets/icons/campfire/Animation/extinguished/extinguished-frame-4.png";
import extinguishedFrame5 from "../../../assets/icons/campfire/Animation/extinguished/extinguished-frame-5.png";

import litFrame0 from "../../../assets/icons/campfire/Animation/lit/lit-frame-0.png";
import litFrame1 from "../../../assets/icons/campfire/Animation/lit/lit-frame-1.png";
import litFrame2 from "../../../assets/icons/campfire/Animation/lit/lit-frame-2.png";
import litFrame3 from "../../../assets/icons/campfire/Animation/lit/lit-frame-3.png";
import litFrame4 from "../../../assets/icons/campfire/Animation/lit/lit-frame-4.png";
import litFrame5 from "../../../assets/icons/campfire/Animation/lit/lit-frame-5.png";

import trunkIcon from "../../../assets/icons/campfire/icon-trunk.png";

export const SleepScreen = ({ onNavigation }: SleepScreenProps) => {
  // Universal hook - gets the player's current beast
  const {
    currentBeastDisplay,
    liveBeastStatus,
    hasLiveBeast,
    isLoading
  } = useBeastDisplay();

  // Frame configuration
  const extinguishedFrames = [
    extinguishedFrame0,
    extinguishedFrame1,
    extinguishedFrame2,
    extinguishedFrame3,
    extinguishedFrame4,
    extinguishedFrame5,
  ];

  const litFrames = [
    litFrame0,
    litFrame1,
    litFrame2,
    litFrame3,
    litFrame4,
    litFrame5,
  ];

  // Custom hooks
  const { isCampfireOn, toggleCampfire } = useCampfireState();
  
  const {
    litFrameIndex,
    extinguishedFrameIndex,
    startLitAnimation,
    startExtinguishedAnimation
  } = useCampfireAnimation({
    litFrames,
    extinguishedFrames,
    animationInterval: 700
  });

  const handleCampfireClick = () => {
    if (isCampfireOn) {
      startExtinguishedAnimation();
    } else {
      startLitAnimation();
    }
    toggleCampfire();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 to-purple-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-white">Loading your beast...</p>
        </div>
      </div>
    );
  }

  // No beast case
  if (!hasLiveBeast || !currentBeastDisplay) {
    return (
      <div 
        className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-rubik"
        style={{
          backgroundImage: `url(${sleepBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <MagicalSparkleParticles />
        
        <div className="text-center space-y-6 z-10">
          <div className="text-6xl opacity-50">😴</div>
          <h2 className="text-2xl font-luckiest text-cream drop-shadow-lg">
            No Beast to Sleep!
          </h2>
          <p className="text-white/80 drop-shadow-md">
            You need a beast to use the sleep feature
          </p>
          <button 
            onClick={() => onNavigation("hatch")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Hatch New Beast
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center overflow-hidden font-rubik"
      style={{
        backgroundImage: `url(${sleepBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Magical Sparkle Particles */}
      <MagicalSparkleParticles />

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

      {/* Sleep Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-4 z-10"
      >
        <h1 className="text-2xl md:text-3xl font-luckiest text-cream drop-shadow-lg">
          Sleep Your {currentBeastDisplay.displayName}
        </h1>
      </motion.div>

      {/* Center: Beast and Campfire together */}
      <div className="flex-grow flex items-center justify-center w-full pointer-events-none select-none z-0 relative">
        {/* Beast Display - Using the actual image of the player's beast */}
        <BeastSleepDisplay 
          beastImage={currentBeastDisplay.asset}
          altText={`Sleeping ${currentBeastDisplay.displayName}`}
        />

        <CampfireController
          isCampfireOn={isCampfireOn}
          onCampfireClick={handleCampfireClick}
          litFrames={litFrames}
          extinguishedFrames={extinguishedFrames}
          litFrameIndex={litFrameIndex}
          extinguishedFrameIndex={extinguishedFrameIndex}
          trunkImage={trunkIcon}
        />
      </div>
    </div>
  );
};