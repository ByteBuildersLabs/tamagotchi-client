import { motion } from "framer-motion";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";
import { useEggAnimation, type EggState } from "./components/useEggAnimation";
import type { EggType } from "./components/eggAnimation";

// Assets - ajusta la ruta según tu estructura de carpetas
import forestBackground from "../../../assets/backgrounds/bg-home.png";

interface HatchEggScreenProps {
  onLoadingComplete: () => void;
  eggType?: EggType; // 🎯 Prop para tipo de huevo (futuro backend)
}

export const HatchEggScreen = ({ onLoadingComplete, eggType = 'shadow' }: HatchEggScreenProps) => {
  
  // 🥚 Hook para manejar la animación del huevo
  const { 
    currentFrame, 
    eggState, 
    startHatching, 
    canClick,
    beastType,
    beastAsset,
    showBeast
  } = useEggAnimation(eggType);

  // Función para manejar el click del botón "Continue"
  const handleContinue = () => {
    console.log(`🎮 Continuing to home with ${beastType}...`);
    onLoadingComplete();
  };

  // Determinar el texto según el estado del huevo
  const getInstructionText = (state: EggState): string => {
    switch (state) {
      case 'idle':
        return 'Tap the egg to begin hatching!';
      case 'hatching':
        return 'Hatching in progress...';
      case 'completed':
        return 'Breaking out of the shell...';
      case 'revealing':
        return `Meet your ${beastType}!`;
      default:
        return 'Tap the egg to begin hatching!';
    }
  };

  // Función para obtener el nombre del tipo de huevo para mostrar
  const getEggTypeName = (type: EggType): string => {
    const names = {
      shadow: 'Shadow',
      dragon: 'Dragon', 
      water: 'Water'
    };
    return names[type];
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

  // 🎯 Animación del huevo mejorada según su estado
  const eggAnimation = {
    initial: { scale: 0.3, opacity: 0, rotate: -15 },
    animate: {
      scale: eggState === 'idle' ? [1, 1.08, 1] : 1, // Solo palpita en idle
      opacity: showBeast ? 0 : 1, // Se desvanece cuando aparece la bestia
      rotate: 0,
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

  // 🐺 Animación de la bestia
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
    // Animación de "respiración" sutil
    whileInView: {
      scale: [1, 1.02, 1],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      }
    }
  };

  // 🎯 Animación del botón Continue con movimiento atractivo
  const buttonAnimation = {
    initial: { opacity: 0, y: 50, scale: 0.8 },
    animate: { 
      opacity: 1, 
      y: [0, -5, 0], // Pequeño rebote hacia arriba
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
      y: -8, // Se eleva más en hover
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
            {showBeast ? `Your ${beastType.charAt(0).toUpperCase() + beastType.slice(1)}!` : 'Hatch Your Beast'}
          </h1>
          {!showBeast && (
            <p className="text-lg font-rubik text-cream/70">
              {getEggTypeName(eggType)} Egg
            </p>
          )}
        </motion.div>

        {/* Subtitle - Cambia según el estado */}
        <motion.div
          className="text-center max-w-md"
          {...subtitleAnimation}
        >
          <p className="text-lg sm:text-xl font-rubik text-cream/90 drop-shadow-md leading-relaxed">
            {showBeast ? (
              <>
                Congratulations! Your mystical companion has emerged.
                <br />
                <span className="text-emerald font-semibold">
                  Ready to start your adventure together?
                </span>
              </>
            ) : (
              <>
                Your mystical companion awaits inside this ancient egg. 
                <br />
                <span className={`font-semibold transition-colors duration-300 ${
                  eggState === 'hatching' ? 'text-magenta' : 
                  eggState === 'completed' ? 'text-cyan' :
                  eggState === 'revealing' ? 'text-emerald' : 'text-gold'
                }`}>
                  {getInstructionText(eggState)}
                </span>
              </>
            )}
          </p>
        </motion.div>

        {/* Egg Asset - Se desvanece cuando aparece la bestia */}
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
            
            {/* Glow effect - Solo activo en idle y hatching */}
            {(eggState === 'idle' || eggState === 'hatching') && (
              <>
                <div className={`absolute inset-0 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full blur-xl -z-10 transition-colors duration-300 ${
                  eggState === 'hatching' ? 'bg-magenta/40 animate-pulse' : 'bg-gold/30 animate-pulse'
                }`} />
                
                {/* Pulso de interactividad - Solo en idle */}
                {eggState === 'idle' && (
                  <div className="absolute inset-0 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full bg-gold/10 animate-ping -z-10" />
                )}
              </>
            )}
            
            {/* Efecto especial cuando completa */}
            {eggState === 'completed' && (
              <div className="absolute inset-0 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full bg-cyan/50 animate-pulse blur-2xl -z-10" />
            )}
          </motion.div>
        )}

        {/* Beast Asset - Aparece después de la eclosión */}
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
            
            {/* Aura mágica alrededor de la bestia */}
            <div className="absolute inset-0 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full bg-emerald/30 animate-pulse blur-xl -z-10" />
            <div className="absolute inset-0 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full bg-gold/20 animate-pulse blur-2xl -z-10" />
          </motion.div>
        )}

        {/* Continue Button - Solo aparece cuando se revela la bestia */}
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