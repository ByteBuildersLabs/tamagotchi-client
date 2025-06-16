import { TamagotchiTopBar } from "../../layout/TopBar";
import { useState, useEffect } from "react";
import cleanBackground from "../../../assets/backgrounds/bg-clean.png";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";
import RainParticles from "./RainParticles";
import { motion } from "framer-motion";
import type { Screen } from "../../types/screens";

import babyWorlfBeast from "../../../assets/beasts/baby-wolf.png";
import cloudOff from "../../../assets/icons/cloud/icon-cloud.png";

interface CleanScreenProps {
  onNavigation: (screen: Screen) => void;
  playerAddress: string;
  rainDuration?: number;
}

export const CleanScreen = ({ rainDuration = 20 }: CleanScreenProps) => {
  const [isRainActive, setIsRainActive] = useState(false);

  const cloudOffFrames = [cloudOff];
  const hasMultiplecloudOffFrames = cloudOffFrames.length > 1;
  const [cloudOffFrameIndex, setcloudOffFrameIndex] = useState(0);
  const [iscloudOffAnimating, setIscloudOffAnimating] = useState(true);

  // Animate the cloudOff frames
  useEffect(() => {
    if (!hasMultiplecloudOffFrames || !iscloudOffAnimating) return;

    const interval = setInterval(() => {
      setcloudOffFrameIndex((prev) => (prev + 1) % cloudOffFrames.length);
    }, 200);

    return () => clearInterval(interval);
  }, [hasMultiplecloudOffFrames, iscloudOffAnimating]);

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

  const cloudAnimation = {
    initial: { scale: 0.3, opacity: 0, rotate: -15 },
    animate: {
      scale: [1, 1.05, 1],
      opacity: 1,
      rotate: 0,
      transition: {
        scale: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 1.5,
          ease: "easeInOut",
          delay: 0.6,
        },
        opacity: { delay: 0.6, duration: 0.4 },
        rotate: { delay: 0.6, duration: 0.5 },
      },
    },
    whileHover: { scale: 1.03, rotate: 2 },
  };

  const [iscloudOn, setIscloudOn] = useState(true);

  const handlecloudClick = () => {
    if (iscloudOn) {
      setIscloudOffAnimating(false);
      setcloudOffFrameIndex(0);
      setIsRainActive(true);
    } else {
      setIscloudOffAnimating(true);
      setcloudOffFrameIndex(0);
    }
    setIscloudOn(!iscloudOn);
  };

  const handleRainComplete = () => {
    setIsRainActive(false);
    console.log("Rain animation completed!");
    // Additional logic when rain finishes
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
      {/* Magical Sparkle Particles */}
      <MagicalSparkleParticles />

      {/* Rain Particles with dynamic duration */}
      <RainParticles
        isActive={isRainActive}
        duration={rainDuration}
        onComplete={handleRainComplete}
      />

      {/* Top Bar */}
      <TamagotchiTopBar
        coins={12345}
        gems={678}
        status={{ energy: 85, hunger: 60, happiness: 75, hygiene: 90 }}
      />

      {/* Main content */}
      <div className="flex flex-col items-center mt-8 space-y-6 z-10 pointer-events-none select-none">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl md:text-3xl font-luckiest text-cream drop-shadow-lg pointer-events-auto"
        >
          Clean Your Beast
        </motion.h1>

        <motion.img
          src={cloudOffFrames[cloudOffFrameIndex]}
          alt="Cloud"
          className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] pointer-events-auto cursor-pointer"
          initial={cloudAnimation.initial}
          animate={{ ...cloudAnimation.animate, y: 10 }}
          whileHover={cloudAnimation.whileHover}
          whileTap={{ scale: 0.95 }}
          onClick={handlecloudClick}
        />

        <motion.img
          src={babyWorlfBeast}
          alt="Tamagotchi Beast"
          className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] pointer-events-auto"
          initial={beastAnimation.initial}
          animate={beastAnimation.animate}
          whileHover={beastAnimation.whileHover}
        />
      </div>
    </div>
  );
};
