import { motion } from "framer-motion";
import { useEffect } from "react";
import { TamagotchiTopBar } from "../../layout/TopBar";
import { NavBar } from "../../layout/NavBar";
import { PlayScreenProps } from "../../types/play.types";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";
import playBackground from "../../../assets/backgrounds/bg-play.png";

// Universal hook for beast display
import { useBeastDisplay } from "../../../dojo/hooks/useBeastDisplay";

// Music Context
import { useMusic } from "../../../context/MusicContext";

// Data
import { MINI_GAMES } from "./components/data/miniGames";

// Components
import { BeastPlayDisplay } from "./components/BeastDisplay";
import { GameCarousel } from "./components/GameCarousel";

export const PlayScreen = ({ onNavigation }: PlayScreenProps) => {
  // Music context
  const { setCurrentScreen } = useMusic();

  // Universal hook - gets the player's current beast
  const {
    currentBeastDisplay,
    liveBeastStatus,
    hasLiveBeast,
    isLoading
  } = useBeastDisplay();

  // Set current screen for music control
  useEffect(() => {
    setCurrentScreen("play");
  }, [setCurrentScreen]);

  const handleMiniGameSelect = (gameId: string) => {
    console.log(`Selected mini-game: ${gameId}`);
    // For now, just log - you can implement mini-game navigation later
    // navigate(MINI_GAMES.find(game => game.id === gameId)?.route || "/play");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-900 to-blue-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-white">Loading your beast...</p>
        </div>
      </div>
    );
  }

  // No beast case
  if (!hasLiveBeast || !currentBeastDisplay) {
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
        <MagicalSparkleParticles />
        
        {/* Top Bar with empty status */}
        <TamagotchiTopBar
          coins={12345}
          gems={678}
          status={{ energy: 0, hunger: 0, happiness: 0, hygiene: 0 }}
        />

        <div className="flex-grow flex items-center justify-center w-full">
          <div className="text-center space-y-6 z-10">
            <div className="text-6xl opacity-50">🎮</div>
            <h2 className="text-2xl font-luckiest text-cream drop-shadow-lg">
              No Beast to Play With!
            </h2>
            <p className="text-white/80 drop-shadow-md">
              You need a beast to play mini-games
            </p>
            <button 
              onClick={() => onNavigation("hatch")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Hatch New Beast
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <NavBar onNavigation={onNavigation} activeTab="play" />
      </div>
    );
  }

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

      {/* Play Title - Dynamic with beast's name */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-4 z-10"
      >
        <h1 className="text-2xl md:text-3xl font-luckiest text-cream drop-shadow-lg">
          Play With Your {currentBeastDisplay.displayName}
        </h1>
      </motion.div>

      {/* Center: Beast Display - Using the player's real beast image */}
      <BeastPlayDisplay 
        beastImage={currentBeastDisplay.asset}
        altText={`${currentBeastDisplay.displayName} ready to play`}
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