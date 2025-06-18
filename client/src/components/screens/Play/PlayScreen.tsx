import { motion } from "framer-motion";
import { TamagotchiTopBar } from "../../layout/TopBar";
import { NavBar } from "../../layout/NavBar";
import { PlayScreenProps } from "../../types/play.types";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";
import playBackground from "../../../assets/backgrounds/bg-play.png";
import babyWorlfBeast from "../../../assets/beasts/baby-wolf.png";

// Data
import { MINI_GAMES } from "./components/data/miniGames";

// Components
import { BeastPlayDisplay } from "./components/BeastDisplay";
import { GameCarousel } from "./components/GameCarousel";

export const PlayScreen = ({ onNavigation }: PlayScreenProps) => {
  const handleMiniGameSelect = (gameId: string) => {
    console.log(`Selected mini-game: ${gameId}`);
    // For now, just log - you can implement mini-game navigation later
    // navigate(MINI_GAMES.find(game => game.id === gameId)?.route || "/play");
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center overflow-hidden font-rubik"
      style={{
        backgroundImage: `url(${playBackground})`,
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

      {/* Play Title - Integrado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-4 z-10"
      >
        <h1 className="text-2xl md:text-3xl font-luckiest text-cream drop-shadow-lg">
          Play With Your Beast
        </h1>
      </motion.div>

      {/* Center: Beast */}
      <BeastPlayDisplay 
        beastImage={babyWorlfBeast}
        altText="Tamagotchi Beast"
      />

      {/* Mini-Games Carousel */}
      <GameCarousel 
        games={MINI_GAMES}
        onGameSelect={handleMiniGameSelect}
      />

      {/* Navigation Bar */}
      <NavBar onNavigation={onNavigation} activeTab="play" />
    </div>
  );
};