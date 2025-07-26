import { TamagotchiTopBar } from "../../layout/TopBar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import sleepBackground from "../../../assets/backgrounds/bg-sleep.png";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";
import { SleepScreenProps } from "../../types/sleep.types";

// Universal hook for beast display
import { useBeastDisplay } from "../../../dojo/hooks/useBeastDisplay";

// Music Context
import { useMusic } from "../../../context/MusicContext";

// Store
import useAppStore from "../../../zustand/store";

// Main sleep logic hook
import { useSleepLogic } from "./components/hooks/useSleepLogic";

// Animation hook (kept for campfire animations)
import { useCampfireAnimation } from "./components/hooks/useCampfireAnimation";

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
  // Music context
  const { setCurrentScreen } = useMusic();

  // Store player data
  const storePlayer = useAppStore(state => state.player);

  // Universal hook - gets the player's current beast
  const {
    currentBeastDisplay,
    liveBeastStatus,
    hasLiveBeast,
    isLoading
  } = useBeastDisplay();

  // State for triggered animations
  const [triggerAction, setTriggerAction] = useState<'sleeping' | 'wake' | null>(null);

  // Set current screen for music control
  useEffect(() => {
    setCurrentScreen("sleep");
  }, [setCurrentScreen]);

  // Main sleep logic hook
  const {
    isBeastSleeping,
    isSleepTransactionInProgress,
    handleCampfireClick: originalHandleCampfireClick,
    isInteractionDisabled
  } = useSleepLogic();

  // State for lighting effect based on campfire state changes
  const [isDarkened, setIsDarkened] = useState(false);
  const [previousCampfireState, setPreviousCampfireState] = useState<boolean | null>(null);

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

  // Animation hook (kept for frame cycling)
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

  // Current campfire state for UI
  const isCampfireOn = !isBeastSleeping; // Awake = lit, Sleeping = extinguished

  // Only start animation when beast state changes, not constantly
  useEffect(() => {
    if (isBeastSleeping) {
      startExtinguishedAnimation();
    } else {
      startLitAnimation();
    }
  }, [isBeastSleeping]);

  // Detect campfire state changes and apply lighting effect
  useEffect(() => {
    // Initialize previous state on first render
    if (previousCampfireState === null) {
      setPreviousCampfireState(isCampfireOn);
      setIsDarkened(!isCampfireOn); 
      return;
    }

    // Detect state change
    if (previousCampfireState !== isCampfireOn) {
      
      if (!isCampfireOn) {
        // Beast is going to sleep - trigger sleeping animation
        console.info("😴 Beast going to sleep! Triggering sleeping animation");
        setTriggerAction('sleeping');
        setIsDarkened(true);
        
        // Clear the trigger after a short delay to allow re-triggering
        setTimeout(() => {
          setTriggerAction(null);
        }, 200);
      } else {
        // Beast is waking up - trigger wake action
        console.info("🌅 Beast waking up! Triggering wake action");
        setTriggerAction('wake');
        setIsDarkened(false);
        
        // Clear the trigger after a short delay
        setTimeout(() => {
          setTriggerAction(null);
        }, 200);
      }
      
      // Update previous state
      setPreviousCampfireState(isCampfireOn);
    }
  }, [isCampfireOn, previousCampfireState]);

  // Simple click handler - no animation manipulation
  const handleCampfireClickWithAnimation = async () => {
    if (isInteractionDisabled) return;
    await originalHandleCampfireClick();
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

      {/* Dark overlay when campfire is extinguished */}
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none z-5"
        initial={{ opacity: isDarkened ? 0.5 : 0 }}
        animate={{ 
          opacity: isDarkened ? 0.5 : 0,
        }}
        transition={{ 
          duration: 1.5, 
          ease: "easeInOut" 
        }}
      />

      {/* Top Bar - Using real data from liveBeastStatus */}
      <TamagotchiTopBar
        coins={storePlayer?.total_coins || 0}
        gems={storePlayer?.total_gems || 0}
        status={{
          energy: liveBeastStatus?.energy || 0,
          hunger: liveBeastStatus?.hunger || 0,
          happiness: liveBeastStatus?.happiness || 0,
          hygiene: liveBeastStatus?.hygiene || 0
        }}
      />

      {/* Sleep Title - Updated to show current state */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-4 z-10"
      >
        <h1 className="text-2xl md:text-3xl font-luckiest text-cream drop-shadow-lg text-center">
          {isBeastSleeping ? (
            <>Your Beast is Sleeping 😴</>
          ) : (
            <>Sleep Your Beast</>
          )}
        </h1>
      </motion.div>

      {/* Center: Beast and Campfire together */}
      <div className="flex-grow flex items-center justify-center w-full pointer-events-none select-none z-0 relative">
        {/* Beast Display - Now using 3D Dragon instead of static image */}
        <BeastSleepDisplay triggerAction={triggerAction} />

        {/* Campfire Controller */}
        <CampfireController
          isCampfireOn={isCampfireOn}
          onCampfireClick={handleCampfireClickWithAnimation} 
          litFrames={litFrames}
          extinguishedFrames={extinguishedFrames}
          litFrameIndex={litFrameIndex}
          extinguishedFrameIndex={extinguishedFrameIndex}
          trunkImage={trunkIcon}
        />
      </div>

      {/* Loading indicator during transactions */}
      {isSleepTransactionInProgress && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30"
        >
          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cream"></div>
          </div>
        </motion.div>
      )}
    </div>
  );
};