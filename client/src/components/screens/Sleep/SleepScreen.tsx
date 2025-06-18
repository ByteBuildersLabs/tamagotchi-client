import { TamagotchiTopBar } from "../../layout/TopBar";
import { motion } from "framer-motion";
import sleepBackground from "../../../assets/backgrounds/bg-sleep.png";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";
import { SleepScreenProps } from "../../types/sleep.types";

// Hooks
import { useCampfireAnimation } from "./components/hooks/useCampfireAnimation";
import { useCampfireState } from "./components/hooks/useCampfireState";

// Components
import { CampfireController } from "./components/CampfireController";
import { BeastSleepDisplay } from "./components/BeastDisplay";

// Assets
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

export const SleepScreen = ({}: SleepScreenProps) => {
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

      {/* Top Bar */}
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
        <BeastSleepDisplay 
          beastImage={babyWorlfBeast}
          altText="Tamagotchi Beast"
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