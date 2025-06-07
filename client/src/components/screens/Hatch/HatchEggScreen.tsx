import { AnimatePresence, motion } from "framer-motion";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";
import { useEggAnimation } from "./components/useEggAnimation";
import type { EggType } from "./components/eggAnimation";

// Assets - adjust the path according to your folder structure
import forestBackground from "../../../assets/backgrounds/bg-home.png";
import { useState, useEffect } from "react";
import MegaBurstParticles from "./components/MegaBurstParticles";

interface HatchEggScreenProps {
  onLoadingComplete: () => void;
  eggType?: EggType;
}

export const HatchEggScreen = ({ onLoadingComplete, eggType = 'shadow' }: HatchEggScreenProps) => {

  // 🥚 Hook with progressive effects
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

  // 🌟💥 States for mega-burst effects
  const [showMegaBurst, setShowMegaBurst] = useState(false);
  const [showFullScreenFlash, setShowFullScreenFlash] = useState(false);

  // Function to handle the "Continue" button click
  const handleContinue = () => {
    console.log(`🎮 Continuing to home with ${beastType}...`);
    onLoadingComplete();
  };

  // Function to get the egg type name
  const getEggTypeName = (type: EggType): string => {
    const names = {
      shadow: 'Shadow',
      dragon: 'Dragon',
      water: 'Water'
    };
    return names[type];
  };

  // 🌟💥 MEGA-BURST EFFECT when the egg completes
  useEffect(() => {
    if (eggState === 'completed') {
      console.log("🌟💥 ACTIVATING SATURATED BURST OF FLASHES!");

      // Activate fullscreen flash immediately
      setShowFullScreenFlash(true);

      // Activate mega-burst simultaneously
      setShowMegaBurst(true);

      // Deactivate flash after 2.5s
      const flashTimeout = setTimeout(() => {
        setShowFullScreenFlash(false);
        console.log("🌟 Flash completed");
      }, 2500);

      // Deactivate mega-burst after 4s
      const burstTimeout = setTimeout(() => {
        setShowMegaBurst(false);
        console.log("💥 Mega-burst completed");
      }, 4000);

      return () => {
        clearTimeout(flashTimeout);
        clearTimeout(burstTimeout);
      };
    }
  }, [eggState]);

  // Base animations
  const titleAnimation = {
    initial: { opacity: 0, y: -30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const subtitleAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // 🎯 Egg animation with progressive glow effects
  const eggAnimation = {
    initial: { scale: 0.3, opacity: 0, rotate: -15 },
    animate: {
      scale: eggState === 'idle' ? [1, 1.08, 1] : 1,
      opacity: showBeast ? 0 : 1,
      rotate: eggState === 'hatching' ? [0, -2, 2, 0] : 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.6,
        scale: eggState === 'idle' ? {
          delay: 0.8,
          repeat: Infinity,
          duration: 2.5,
          ease: "easeInOut"
        } : { delay: 0.6, duration: 0.7 },
        opacity: {
          delay: showBeast ? 0 : 0.6,
          duration: showBeast ? 0.5 : 0.5
        },
        rotate: eggState === 'hatching' ? {
          repeat: Infinity,
          duration: 0.3,
          ease: "easeInOut"
        } : { delay: 0.6, duration: 0.3 }
      },
    },
    whileHover: canClick ? {
      scale: 1.15,
      rotate: [0, -3, 3, 0],
      transition: {
        scale: { duration: 0.3 },
        rotate: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
      }
    } : {},
    whileTap: canClick ? {
      scale: 0.95,
      transition: { duration: 0.1 }
    } : {}
  };

  // 🐺 Beast animation
  const beastAnimation = {
    initial: { scale: 0.3, opacity: 0, rotate: -10, y: 30 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2,
        duration: 0.8
      }
    },
    whileInView: {
      scale: [1, 1.02, 1],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      }
    }
  };

  // 🎯 Continue button animation
  const buttonAnimation = {
    initial: { opacity: 0, y: 50, scale: 0.8 },
    animate: {
      opacity: 1,
      y: [0, -5, 0],
      scale: 1,
      transition: {
        delay: 0.5,
        duration: 0.8,
        ease: "easeOut",
        type: "spring",
        stiffness: 300,
        damping: 25,
        y: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }
      }
    }
  };

  const buttonInteractionProps = {
    whileHover: {
      scale: 1.1,
      y: -8,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    },
    whileTap: {
      scale: 0.95,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    },
  };

  // 🌟💥 Full-Screen Flash Animation
  const fullScreenFlashAnimation = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 1, 1, 0],
      transition: {
        times: [0, 0.1, 0.9, 1], // Fast flash, hold, slow fade out
        duration: 2.5,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
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

      {/* 🌟💥 FULL-SCREEN PROLONGED FLASH */}
      <AnimatePresence>
        {showFullScreenFlash && (
          <motion.div
            className="absolute inset-0 z-40 pointer-events-none"
            style={{
              backgroundColor: 'rgba(255, 255, 240, 0.95)' // Bright blackout
            }}
            {...fullScreenFlashAnimation}
            key="mega-flash-effect"
          />
        )}
      </AnimatePresence>

      {/* Content Container */}
      <div className="flex flex-col items-center justify-center space-y-8 z-50 px-4">

        {/* Title */}
        <motion.div
          className="text-center space-y-2"
          {...titleAnimation}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-luckiest text-cream drop-shadow-lg">
            {showBeast ? `Your ${beastType.charAt(0).toUpperCase() + beastType.slice(1)}!` : 'Hatch Your Beast'}
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          className="text-center max-w-md"
          {...subtitleAnimation}
        >
          <p className="text-lg sm:text-xl font-rubik text-cream/90 drop-shadow-md leading-relaxed">
            {showBeast ? (
              <>
                <br />
              </>
            ) : (
              <>
                <br />
                <span className={`font-semibold transition-colors duration-300 ${eggState === 'hatching' ? 'text-magenta' :
                    eggState === 'completed' ? 'text-cyan' :
                      eggState === 'revealing' ? 'text-emerald' : 'text-gold'
                  }`}>
                  {eggState === 'idle' ? '' :
                    eggState === 'hatching' ? '' :
                      eggState === 'completed' ? '' :
                        ''}
                </span>
              </>
            )}
          </p>
        </motion.div>

        {/* Egg Asset with progressive glow effects */}
        {!showBeast && (
          <motion.div
            className={`relative ${canClick ? 'cursor-pointer' : 'cursor-default'}`}
            {...eggAnimation}
            onClick={canClick ? startHatching : undefined}
          >
            <img
              src={currentFrame}
              alt={`${getEggTypeName(eggType)} Beast Egg - ${eggState}`}
              className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)] select-none"
            />

            {/* 🌟 Progressive Glow System */}
            {glowLevel > 0 && (
              <>
                {/* Glow Level 1: Soft */}
                {glowLevel >= 1 && (
                  <div className="absolute inset-0 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full bg-gold/20 animate-pulse blur-lg -z-10" />
                )}

                {/* Glow Level 2: Medium */}
                {glowLevel >= 2 && (
                  <div className="absolute inset-0 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full bg-gold/30 animate-pulse blur-xl -z-10" />
                )}

                {/* Glow Level 3: Intense */}
                {glowLevel >= 3 && (
                  <div className="absolute inset-0 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full bg-yellow-400/40 animate-pulse blur-2xl -z-10" />
                )}

                {/* Glow Level 4: Very Intense */}
                {glowLevel >= 4 && (
                  <>
                    <div className="absolute inset-0 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full bg-orange-300/50 animate-pulse blur-3xl -z-10" />
                    <div className="absolute inset-0 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full bg-white/20 animate-ping -z-10" />
                  </>
                )}

                {/* Glow Level 5: MAXIMUM POWER */}
                {glowLevel >= 5 && (
                  <>
                    <div className="absolute inset-0 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full bg-white/60 animate-pulse blur-[40px] -z-10" />
                    <div className="absolute inset-0 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full bg-cyan-300/40 animate-ping -z-10" />
                    <div className="absolute inset-0 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full bg-magenta/30 animate-pulse blur-[50px] -z-10" />
                  </>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* Beast Asset */}
        {showBeast && (
          <motion.div
            className="relative"
            {...beastAnimation}
          >
            <img
              src={beastAsset}
              alt={`Baby ${beastType}`}
              className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)] select-none"
            />

            {/* Magical aura around the beast */}
            <div className="absolute inset-0 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full bg-emerald/30 animate-pulse blur-xl -z-10" />
            <div className="absolute inset-0 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full bg-gold/20 animate-pulse blur-2xl -z-10" />
          </motion.div>
        )}

        {/* Continue Button */}
        {eggState === 'revealing' && showBeast && (
          <motion.button
            onClick={handleContinue}
            className="btn-cr-yellow text-xl sm:text-2xl px-8 py-4 focus:outline-none active:scale-90"
            {...buttonAnimation}
            {...buttonInteractionProps}
            aria-label="Continue to meet your beast"
          >
            START ADVENTURE
          </motion.button>
        )}

      </div>
    </div>
  );
};