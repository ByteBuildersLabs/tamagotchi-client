import { TamagotchiTopBar } from "../../layout/TopBar";
import { useState, useEffect } from "react";
import cleanBackground from "../../../assets/backgrounds/bg-clean.png";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";
// import RainingParticles from "../../shared/RainingParticles";
import { motion } from "framer-motion";
import type { Screen } from "../../types/screens";

import babyWorlfBeast from "../../../assets/beasts/baby-wolf.png";

import cloudFrame0 from "../../../assets/icons/cloud/Animation/icon-cloud-frame-0.png";
import cloudFrame1 from "../../../assets/icons/cloud/Animation/icon-cloud-frame-1.png";
import cloudFrame2 from "../../../assets/icons/cloud/Animation/icon-cloud-frame-2.png";
import cloudFrame3 from "../../../assets/icons/cloud/Animation/icon-cloud-frame-3.png";
import cloudFrame4 from "../../../assets/icons/cloud/Animation/icon-cloud-frame-4.png";
import cloudFrame5 from "../../../assets/icons/cloud/Animation/icon-cloud-frame-5.png";
import cloudFrame6 from "../../../assets/icons/cloud/Animation/icon-cloud-frame-6.png";

import cloudOff from "../../../assets/icons/cloud/icon-cloud.png";


interface CleanScreenProps {
  onNavigation: (screen: Screen) => void;
  playerAddress: string;
}

export const CleanScreen = ({ }: CleanScreenProps) => {

  const [frameIndex, setFrameIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const cloudFrames = [
    cloudFrame0,
    cloudFrame1,
    cloudFrame2,
    cloudFrame3,
    cloudFrame4,
    cloudFrame5,
    cloudFrame6
  ];

  const cloudOffFrames = [
    cloudOff
  ];

  const hasMultiplecloudFrames = cloudFrames.length > 1;
  const hasMultiplecloudOffFrames = cloudOffFrames.length > 1;

  const [cloudOffFrameIndex, setcloudOffFrameIndex] = useState(0);
  const [iscloudOffAnimating, setIscloudOffAnimating] = useState(true);

  // Animate the cloud frames
  useEffect(() => {
    if (!hasMultiplecloudFrames || !isAnimating) return;

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % cloudFrames.length);
    }, 300);

    return () => clearInterval(interval);
  }, [hasMultiplecloudFrames, isAnimating]);

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
    dragConstraints: { left: -30, right: 30, top: -20, bottom: 20 },
    dragElastic: 0.1,
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
    dragConstraints: { left: -30, right: 30, top: -20, bottom: 20 },
    dragElastic: 0.1,
  };

  const [iscloudOn, setIscloudOn] = useState(true);

  const handlecloudClick = () => {
    if (iscloudOn) {
      setIsAnimating(true); // Start cloud animation
      setFrameIndex(0); // Reset to the first cloud frame
      setIscloudOffAnimating(false); // Stop cloudOff animation
      setcloudOffFrameIndex(0); // Reset cloudOff frame
    } else {
      setIsAnimating(false); // Stop cloud animation
      setFrameIndex(0); // Reset cloud frame
      setIscloudOffAnimating(true); // Start cloudOff animation
      setcloudOffFrameIndex(0); // Reset to the first cloudOff frame
    }
    setIscloudOn(!iscloudOn);
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

      {/* Top Bar with Coins, Gems, and Status */}
      <TamagotchiTopBar
        coins={12345}
        gems={678}
        status={{ energy: 85, hunger: 60, happiness: 75, hygiene: 90 }}
      />

      {/* Contenedor principal: título, nube y beast */}
      <div className="flex flex-col items-center mt-8 space-y-6 z-10 pointer-events-none select-none">
        {/* Clean Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl md:text-3xl font-luckiest text-cream drop-shadow-lg pointer-events-auto"
        >
          Clean Your Beast
        </motion.h1>

        {/* Cloud */}
        <motion.img
          src={iscloudOn ? cloudOffFrames[cloudOffFrameIndex] : cloudFrames[frameIndex]}
          alt="Cloud"
          className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] pointer-events-auto"
          initial={cloudAnimation.initial}
          animate={{ ...cloudAnimation.animate, y: 10 }}
          whileHover={cloudAnimation.whileHover}
          onClick={handlecloudClick}
          drag
          dragConstraints={cloudAnimation.dragConstraints}
          dragElastic={cloudAnimation.dragElastic}
        />

        {/* Beast */}
        <motion.img
          src={babyWorlfBeast}
          alt="Tamagotchi Beast"
          className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] pointer-events-auto"
          initial={beastAnimation.initial}
          animate={beastAnimation.animate}
          whileHover={beastAnimation.whileHover}
          drag
          dragConstraints={beastAnimation.dragConstraints}
          dragElastic={beastAnimation.dragElastic}
        />
      </div>
    </div>
  );

};
