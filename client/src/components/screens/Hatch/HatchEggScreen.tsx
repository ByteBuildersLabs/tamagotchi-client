import { motion } from "framer-motion";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";

// Assets - ajusta la ruta según tu estructura de carpetas
import forestBackground from "../../../assets/backgrounds/bg-home.png";
import eggAsset from "../../../assets/eggs/egg-wolf/egg-wolf-frame-0.png";

interface HatchEggScreenProps {
  onLoadingComplete: () => void;
}

export const HatchEggScreen = ({ onLoadingComplete }: HatchEggScreenProps) => {
  const handleHatchClick = () => {
    console.log('Hatching egg...');
    // Simular animación de eclosión y luego continuar
    setTimeout(() => {
      onLoadingComplete();
    }, 1500); // 1.5s para animación de eclosión
  };

  // Animaciones siguiendo el patrón del HomeScreen
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

  const eggAnimation = {
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
        scale: { delay: 0.6, duration: 0.7 },
        opacity: { delay: 0.6, duration: 0.5 },
      },
    },
    whileHover: { 
      scale: 1.05, 
      rotate: [0, -5, 5, 0], 
      transition: { 
        rotate: { repeat: Infinity, duration: 2 } 
      } 
    }
  };

  const buttonAnimation = {
    initial: { opacity: 0, y: 50 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: 0.8, 
        duration: 0.5, 
        ease: "easeOut" 
      } 
    }
  };

  const buttonInteractionProps = {
    whileHover: { 
      scale: 1.1, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 15 
      } 
    },
    whileTap: { 
      scale: 0.95, 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 20 
      } 
    },
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
      {/* Magical Sparkle Particles */}
      <MagicalSparkleParticles />

      {/* Content Container */}
      <div className="flex flex-col items-center justify-center space-y-8 z-10 px-4">
        
        {/* Title */}
        <motion.div
          className="text-center space-y-2"
          {...titleAnimation}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-luckiest text-cream drop-shadow-lg">
            Hatch Your Beast
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          className="text-center max-w-md"
          {...subtitleAnimation}
        >
          <p className="text-lg sm:text-xl font-rubik text-cream/90 drop-shadow-md leading-relaxed">
            Your mystical companion awaits inside this ancient egg. 
            <br />
            <span className="text-gold font-semibold">Ready to meet your destiny?</span>
          </p>
        </motion.div>

        {/* Egg Asset */}
        <motion.div
          className="relative"
          {...eggAnimation}
        >
          <img
            src={eggAsset}
            alt="Mystical Beast Egg"
            className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)] cursor-pointer"
          />
          
          {/* Glow effect around egg */}
          <div className="absolute inset-0 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full bg-gold/20 animate-pulse blur-xl -z-10" />
        </motion.div>

        {/* Hatch Button */}
        <motion.button
          onClick={handleHatchClick}
          className="btn-cr-yellow text-xl sm:text-2xl px-8 py-4 focus:outline-none active:scale-90"
          {...buttonAnimation}
          {...buttonInteractionProps}
          aria-label="Hatch your beast egg"
        >
          HATCH
        </motion.button>

      </div>
    </div>
  );
};