import { useRef } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { TamagotchiTopBar } from "../../layout/TopBar";
import { NavBar } from "../../layout/NavBar";
import type { Screen } from "../../types/screens";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";
import babyWorlfBeast from "../../../assets/beasts/baby-wolf.png";
import playBackground from "../../../assets/backgrounds/bg-play.png";
import flappyGameIcon from "../../../assets/icons/games/flappy.png";
import platformGameIcon from "../../../assets/icons/games/platform.png";
import ArrowLeftIcon from "../../../assets/icons/extras/icon-arrow-left.png";
import ArrowRightIcon from "../../../assets/icons/extras/icon-arrow-right.png";

interface PlayScreenProps {
  onNavigation: (screen: Screen) => void;
  playerAddress: string;
}

// Mini-games data
const miniGames = [
  {
    id: "flappy",
    title: "Flappy Beast",
    icon: flappyGameIcon,
    route: "/play/flappy"
  },
  {
    id: "platform",
    title: "Platform Jump",
    icon: platformGameIcon,
    route: "/play/platform"
  }
];

// Slider settings for mini-games carousel
const GAME_SLIDER_SETTINGS = {
  dots: true,
  infinite: miniGames.length > 1,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: false,
  centerMode: false,
  variableWidth: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ]
};

// Minimal custom styles - solo para elementos que react-slick controla
const GAME_CAROUSEL_STYLES = `
  .slick-dots {
    bottom: -40px !important;
    display: flex !important;
    justify-content: center;
    gap: 8px;
  }

  .slick-dots li button {
    width: 12px !important;
    height: 12px !important;
    border-radius: 50% !important;
    background: rgba(255, 255, 255, 0.3) !important;
    border: none !important;
    transition: all 0.3s ease !important;
  }

  .slick-dots li.slick-active button {
    background: rgba(255, 255, 255, 0.8) !important;
    transform: scale(1.2);
  }

  .slick-dots li button:before {
    display: none !important;
  }
`;

export const PlayScreen = ({ onNavigation }: PlayScreenProps) => {
  const sliderRef = useRef<Slider>(null);

  const handleMiniGameSelect = (gameId: string) => {
    console.log(`Selected mini-game: ${gameId}`);
    // For now, just log - you can implement mini-game navigation later
    // navigate(miniGames.find(game => game.id === gameId)?.route || "/play");
  };

  const goToPrevious = () => {
    sliderRef.current?.slickPrev();
  };

  const goToNext = () => {
    sliderRef.current?.slickNext();
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

      {/* Top Bar with Coins, Gems, and Status */}
      <TamagotchiTopBar
        coins={12345}
        gems={678}
        status={{ energy: 85, hunger: 60, happiness: 75, hygiene: 90 }}
      />

      {/* Play Title */}
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
      <div className="flex-1 flex items-center justify-center w-full pointer-events-none select-none z-0 relative">
        <motion.img
          src={babyWorlfBeast}
          alt="Tamagotchi Beast"
          className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] pointer-events-auto"
          initial={beastAnimation.initial}
          animate={beastAnimation.animate}
          whileHover={beastAnimation.whileHover}
        />
      </div>

      {/* Mini-Games Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.6, ease: "easeOut" } }}
        className="w-full max-w-sm px-2 pb-32 z-10"
      >
        <div className="flex items-center justify-center space-x-1">
          {/* Previous Button */}
          {miniGames.length > 1 && (
            <motion.button
              onClick={goToPrevious}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="z-40 flex items-center justify-center"
            >
              <img 
                src={ArrowLeftIcon} 
                alt="Previous" 
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14"
              />
            </motion.button>
          )}

          {/* Carousel Container */}
          <div className="w-full max-w-[280px] h-32">
            <Slider ref={sliderRef} {...GAME_SLIDER_SETTINGS}>
              {miniGames.map((game) => (
                <div key={game.id} className="px-2">
                  <div
                    onClick={() => handleMiniGameSelect(game.id)}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <motion.div 
                      className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mb-3"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={game.icon}
                        alt={game.title}
                        className="w-16 h-16 md:w-20 md:h-20 object-contain"
                      />
                    </motion.div>
                    <p className="text-sm md:text-base font-rubik font-semibold text-cream text-center drop-shadow-sm">
                      {game.title}
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Next Button */}
          {miniGames.length > 1 && (
            <motion.button
              onClick={goToNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="z-40 flex items-center justify-center"
            >
              <img 
                src={ArrowRightIcon} 
                alt="Next" 
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14"
              />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Custom Carousel Dots Styling */}
      <style>{GAME_CAROUSEL_STYLES}</style>

      {/* Navigation Bar */}
      <NavBar onNavigation={onNavigation} activeTab="play" />
    </div>
  );
};