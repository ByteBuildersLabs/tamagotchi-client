import { TamagotchiTopBar } from "../../layout/TopBar";
import { useState, useEffect } from "react";
import cleanBackground from "../../../assets/backgrounds/bg-clean.png";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";
// import RainingParticles from "../../shared/RainingParticles";
import { motion } from "framer-motion";
import type { Screen } from "../../types/screens";

//IMAGES
import bannerImg from "../../../assets/banners/banner-dragon.png";
import treeOfLifeIcon from "../../../assets/icons/age/icon-age-tree-of-life.webp";
import dropdownMenuIcon from "../../../assets/icons/menu/icon-menu.webp";
import dailyQuestIcon from "../../../assets/icons/daily-quests/icon-daily-quests.png";
import shopIcon from "../../../assets/icons/shop/icon-general-shop.webp";
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

export const CleanScreen = ({ onNavigation, playerAddress }: CleanScreenProps) => {
  const [age] = useState(1);
  const playerName = "0xdaniel";

  const handleProfileClick = () => {
    console.log("Profile clicked:", playerAddress);
    onNavigation("profile");
  };

  const handleDropdownMenuClick = () => {
    console.log("Dropdown menu clicked");
    onNavigation("home");
  };

  const handleShopClick = () => {
    console.log("Shop clicked");
    onNavigation("market");
  };

  const handleDailyQuestsClick = () => {
    console.log("Daily Quests clicked");
    onNavigation("home");
  };

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


  const buttonInteractionProps = {
    whileHover: { scale: 1.1, transition: { type: "spring", stiffness: 300, damping: 15 } },
    whileTap: { scale: 0.95, transition: { type: "spring", stiffness: 400, damping: 20 } },
  };

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
      {/* <RainingParticles/> */}

      {/* Top Bar with Coins, Gems, and Status */}
      <TamagotchiTopBar
        coins={12345}
        gems={678}
        status={{ energy: 85, hunger: 60, happiness: 75, hygiene: 90 }}
      />

      <div className="w-full px-4 md:px-6 lg:px-8 flex justify-between items-start mt-3 md:mt-4 z-10">
        {/* Left: Banner & Player Name */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2, duration: 0.5, ease: "easeOut" } }}
          className="flex flex-col items-center space-y-1 md:space-y-1.5"
        >
          <motion.button
            onClick={handleProfileClick}
            {...buttonInteractionProps}
            className="focus:outline-none active:scale-95"
            aria-label="Player Profile"
          >
            <img src={bannerImg} alt="Profile Banner" className="h-16 sm:h-20 md:h-24 w-auto" />
          </motion.button>
          <p className="text-sm md:text-base font-rubik text-cream font-semibold select-none drop-shadow-sm">
            {playerName}
          </p>
        </motion.div>

        {/* Right: Age & Dropdown */}
        <div className="flex items-center space-x-3 md:space-x-4 lg:space-x-5 pt-1">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.3, duration: 0.5, ease: "easeOut" } }}
            className="flex items-center space-x-1 md:space-x-1.5"
          >
            <img src={treeOfLifeIcon} alt="Tree of Life" className="h-10 w-10 lg:h-12 lg:w-12" />
            <span className="text-xl md:text-2xl lg:text-3xl font-luckiest text-cream select-none">
              {age}
            </span>
          </motion.div>

          <motion.button
            onClick={handleDropdownMenuClick}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.35, duration: 0.5, ease: "easeOut" } }}
            {...buttonInteractionProps}
            className="focus:outline-none active:scale-90"
            aria-label="Game Menu"
          >
            <img src={dropdownMenuIcon} alt="Menu" className="h-10 w-10 lg:h-12 lg:w-12" />
          </motion.button>
        </div>
      </div>

      {/* Center: Beast and cloud together */}
<div className="flex-grow flex items-center justify-center w-full pointer-events-none select-none z-0 relative mt-[-20%]">
  <div className="relative flex flex-col items-center">
    <motion.img
      src={iscloudOn ? cloudOffFrames[cloudOffFrameIndex] : cloudFrames[frameIndex]}
      alt="Cloud"
      className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] pointer-events-auto mb-4"
      initial={cloudAnimation.initial}
      animate={{ ...cloudAnimation.animate, y: 10 }}
      whileHover={cloudAnimation.whileHover}
      onClick={handlecloudClick}
      drag
      dragConstraints={cloudAnimation.dragConstraints}
      dragElastic={cloudAnimation.dragElastic}
    />
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

      {/* Shop Button */}
      <motion.button
        onClick={handleShopClick}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.4, duration: 0.5, ease: "easeOut" } }}
        {...buttonInteractionProps}
        className="fixed bottom-[calc(theme(spacing.16)+0.75rem+env(safe-area-inset-bottom))] left-3 sm:left-4 md:left-5 lg:left-6 z-30 p-3 bg-cream/80 rounded-full focus:outline-none active:scale-90"
        aria-label="Open Shop"
      >
        <img src={shopIcon} alt="Shop" className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16" />
      </motion.button>

      <motion.button
        onClick={handleDailyQuestsClick}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.45, duration: 0.5, ease: "easeOut" } }}
        {...buttonInteractionProps}
        className="fixed bottom-[calc(theme(spacing.16)+0.75rem+env(safe-area-inset-bottom))] right-3 sm:right-4 md:right-5 lg:right-6 z-30 p-3 bg-cream/80 rounded-full focus:outline-none active:scale-90"
        aria-label="Open Daily Quests"
      >
        <img src={dailyQuestIcon} alt="Daily Quests" className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16" />
      </motion.button>
    </div>
  );
};
