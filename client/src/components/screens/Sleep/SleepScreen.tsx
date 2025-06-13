import { TamagotchiTopBar } from "../../layout/TopBar";
import { useState, useEffect } from "react";
import sleepBackground from "../../../assets/backgrounds/bg-sleep.png";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";
import { motion } from "framer-motion";
import type { Screen } from "../../types/screens";

import babyWorlfBeast from "../../../assets/beasts/baby-wolf.png";

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

interface SleepScreenProps {
  onNavigation: (screen: Screen) => void;
  playerAddress: string;
}

export const SleepScreen = ({ }: SleepScreenProps) => {

  const [frameIndex, setFrameIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const hasMultipleExtinguishedFrames = extinguishedFrames.length > 1;
  const hasMultipleLitFrames = litFrames.length > 1;

  const [litFrameIndex, setLitFrameIndex] = useState(0);
  const [isLitAnimating, setIsLitAnimating] = useState(true);

  // Animate the extinguished frames
  useEffect(() => {
    if (!hasMultipleExtinguishedFrames || !isAnimating) return;

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % extinguishedFrames.length);
    }, 700);

    return () => clearInterval(interval);
  }, [hasMultipleExtinguishedFrames, isAnimating]);

  // Animate the lit frames
  useEffect(() => {
    if (!hasMultipleLitFrames || !isLitAnimating) return;

    const interval = setInterval(() => {
      setLitFrameIndex((prev) => (prev + 1) % litFrames.length);
    }, 700);

    return () => clearInterval(interval);
  }, [hasMultipleLitFrames, isLitAnimating]);

  const beastAnimation = {
    initial: { scale: 0.3, opacity: 0, rotate: -15 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.6,
        scale: { delay: 0.6, duration: 0.5 },
        opacity: { delay: 0.6, duration: 0.4 },
      },
    },
    whileHover: { scale: 1.03, rotate: 2 },
  };

  const campFireAnimation = {
    initial: { scale: 0.3, opacity: 0, rotate: -15 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",   // puedes mantener un spring o simplemente quitar el scale transition
        stiffness: 100,
        damping: 10,
        delay: 0.6,
        opacity: { delay: 0.6, duration: 0.4 },
        rotate: { delay: 0.6, duration: 0.5 },
      },
    },
    whileHover: { scale: 1.03, rotate: 2 },
  };

  const trunkAnimation = {
    initial: { scale: 0.3, opacity: 0, rotate: -15 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.6,
        scale: { delay: 0.6, duration: 0.5 },
        opacity: { delay: 0.6, duration: 0.4 },
      },
    },
    whileHover: { scale: 1.03, rotate: 2 },
  };

  const [isCampfireOn, setIsCampfireOn] = useState(true);

  const handleCampfireClick = () => {
    if (isCampfireOn) {
      setIsAnimating(true); // Start extinguished animation
      setFrameIndex(0); // Reset to the first extinguished frame
      setIsLitAnimating(false); // Stop lit animation
      setLitFrameIndex(0); // Reset lit frame
    } else {
      setIsAnimating(false); // Stop extinguished animation
      setFrameIndex(0); // Reset extinguished frame
      setIsLitAnimating(true); // Start lit animation
      setLitFrameIndex(0); // Reset to the first lit frame
    }
    setIsCampfireOn(!isCampfireOn);
  };

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

      {/* Top Bar with Coins, Gems, and Status */}
      <TamagotchiTopBar
        coins={12345}
        gems={678}
        status={{ energy: 85, hunger: 60, happiness: 75, hygiene: 90 }}
      />

      {/* Sleep Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-4 z-10"
      >
        <h1 className="text-2xl md:text-3xl font-luckiest text-cream drop-shadow-lg">
          Sleep Your Beast
        </h1>
      </motion.div>

      {/* Center: Beast and Campfire together */}
      <div className="flex-grow flex items-center justify-center w-full pointer-events-none select-none z-0 relative">
        <motion.img
          src={babyWorlfBeast}
          alt="Tamagotchi Beast"
          className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] pointer-events-auto"
          initial={beastAnimation.initial}
          animate={beastAnimation.animate}
          whileHover={beastAnimation.whileHover}
        />

        {/* Campfire Container */}
        <div className="relative h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px] pointer-events-auto flex flex-col items-center justify-end">
          {/* Trunk (base layer) */}
          <motion.img
            src={trunkIcon}
            alt="Campfire Trunk"
            className="absolute bottom-0 h-1/2 w-2/3 sm:h-3/5 sm:w-3/4 md:h-2/3 md:w-4/5 lg:h-3/4 lg:w-5/6 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] z-10"
            initial={trunkAnimation.initial}
            animate={trunkAnimation.animate}
            whileHover={trunkAnimation.whileHover}
            onClick={handleCampfireClick}
          />

          {/* Fire/Smoke Animation (on top of trunk) */}
          <motion.img
            src={isCampfireOn ? litFrames[litFrameIndex] : extinguishedFrames[frameIndex]}
            alt="Camp Fire"
            className="absolute bottom-[20%] h-3/4 w-3/4 sm:h-4/5 sm:w-4/5 md:h-full md:w-full object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] z-20"
            initial={campFireAnimation.initial}
            animate={campFireAnimation.animate}
            whileHover={campFireAnimation.whileHover}
            onClick={handleCampfireClick}
          />
        </div>
      </div>
    </div>
  );
};