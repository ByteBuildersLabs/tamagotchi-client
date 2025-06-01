import { useState } from "react";
import { motion } from "framer-motion";
import { TamagotchiTopBar } from "../../layout/TopBar"; // Verifica que esta ruta sea correcta

// Assets imports – Asegúrate de que las rutas sean correctas
import bannerImg from "../../../assets/banners/banner-dragon.png";
import treeOfLifeIcon from "../../../assets/icons/age/icon-age-tree-of-life.webp";
import dropdownMenuIcon from "../../../assets/icons/menu/icon-menu.webp";
import dailyQuestIcon from "../../../assets/icons/daily-quests/icon-daily-quests.png";
import shopIcon from "../../../assets/icons/shop/icon-general-shop.webp";
import babyWorlfBeast from "../../../assets/beasts/baby-wolf.png"; 
import forestBackground from "../../../assets/backgrounds/bg-home.png";

type Screen = "login" | "cover" | "home" | "sleep" | "feed" | "clean" | "play" | "profile" | "market";

interface HomeScreenProps {
  onNavigation: (screen: Screen) => void;
  playerAddress: string; 
}

export const HomeScreen = ({ 
  onNavigation,
  playerAddress 
}: HomeScreenProps) => {
  const [age] = useState(1); 
  const playerName = "0xluis"; // Nombre del jugador quemado

  const handleProfileClick = () => {
    console.log("Banner/Profile clicked. Player Address:", playerAddress);
    // onNavigation("profile"); 
  };

  const handleDropdownMenuClick = () => {
    console.log("Dropdown menu clicked");
  };

  const handleShopClick = () => {
    console.log("Shop icon clicked");
    // onNavigation("market");
  };

  const handleDailyQuestsClick = () => {
    console.log("Daily Quests icon clicked");
  };

  const topBarProps = {
    coins: 12345, 
    gems: 678,
    status: {
      energy: 85,
      hunger: 60,
      happiness: 75,
      hygiene: 90,
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (customDelay: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: customDelay,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

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
      }
    },
    whileHover: { scale: 1.03, rotate: 2 },
    dragConstraints: { left: -30, right: 30, top: -20, bottom: 20 },
    dragElastic: 0.1,
  };

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col items-center overflow-hidden font-rubik"
      style={{ 
        backgroundImage: `url(${forestBackground})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <TamagotchiTopBar {...topBarProps} />

      <div className="w-full px-4 md:px-6 lg:px-8 flex justify-between items-start mt-3 md:mt-4 z-10">
        {/* Izquierda: Banner (Botón de Perfil) y Nombre del Jugador */}
        <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={itemVariants.visible(0.2)}
            className="flex flex-col items-center space-y-1 md:space-y-1.5" // Espacio entre banner y nombre
        >
            <motion.button
                onClick={handleProfileClick}
                // Aplicar buttonInteractionProps directamente al botón si es preferible
                // {...buttonInteractionProps} 
                className="transform transition-transform duration-200 ease-in-out active:scale-95 focus:outline-none"
                aria-label="Player Profile"
                whileHover={{ scale: 1.05 }} // Movido aquí para que el hover sea solo en la imagen
                whileTap={{ scale: 0.95 }}
            >
                <img 
                    src={bannerImg} 
                    alt="Player Profile Banner" 
                    className="h-16 sm:h-20 md:h-24 w-auto" 
                />
            </motion.button>
            <p className="text-sm md:text-base font-rubik text-cream font-semibold select-none drop-shadow-sm">
                {playerName}
            </p>
        </motion.div>

        {/* Derecha: Edad del Beast y Menú Dropdown */}
        <div className="flex items-center space-x-3 md:space-x-4 lg:space-x-5 pt-1"> {/* Contenedor para elementos de la derecha, pt-1 para alinear un poco mejor con el nombre del jugador */}
            {/* Grupo Edad (Árbol + Número) */}
            <motion.div 
                className="flex items-center space-x-1 md:space-x-1.5"
                variants={itemVariants}
                initial="hidden"
                animate={itemVariants.visible(0.3)}
            >
                <img 
                    src={treeOfLifeIcon} 
                    alt="Tree of Life" 
                    className="h-10 w-10 md:h-10 md:w-10 lg:h-12 lg:w-12" 
                />
                <span className="text-xl md:text-2xl lg:text-3xl font-luckiest text-cream select-none">
                    {age}
                </span>
            </motion.div>

            {/* Botón Dropdown Menu */}
            <motion.button
                onClick={handleDropdownMenuClick}
                variants={itemVariants}
                initial="hidden"
                animate={itemVariants.visible(0.35)}
                {...buttonInteractionProps}
                className="transform transition-transform duration-200 ease-in-out active:scale-90 focus:outline-none"
                aria-label="Game Menu"
            >
                <img 
                    src={dropdownMenuIcon} 
                    alt="Menu" 
                    className="h-10 w-10 md:h-10 md:w-10 lg:h-12 lg:w-12"
                />
            </motion.button>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center w-full pointer-events-none select-none z-0 relative">
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

      <motion.button
        onClick={handleShopClick}
        variants={itemVariants}
        initial="hidden"
        animate={itemVariants.visible(0.4)}
        {...buttonInteractionProps}
        className="fixed bottom-[calc(theme(spacing.16)+0.75rem)] left-3 sm:left-4 md:left-5 lg:left-6 z-30 p-3 bg-cream/80 focus:outline-none active:scale-90"
        aria-label="Open Shop"
      >
        <img src={shopIcon} alt="Shop" className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16" />
      </motion.button>

      <motion.button
        onClick={handleDailyQuestsClick}
        variants={itemVariants}
        initial="hidden"
        animate={itemVariants.visible(0.5)}
        {...buttonInteractionProps}
        className="fixed bottom-[calc(theme(spacing.16)+0.75rem)] right-3 sm:right-4 md:right-5 lg:right-6 z-30 p-3 bg-cream/80 focus:outline-none active:scale-90"
        aria-label="Open Daily Quests"
      >
        <img src={dailyQuestIcon} alt="Daily Quests" className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16" />
      </motion.button>
    </div>
  );
};