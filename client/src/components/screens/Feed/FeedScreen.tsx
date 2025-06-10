import { useRef } from "react";
import { motion } from "framer-motion";

// Layout and shared components
import { TamagotchiTopBar } from "../../layout/TopBar";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";

// Feed components
import { Beast } from "./components/beasts";
import { FoodCarousel } from "./components/FoodCarousel";
import { DragPortal } from "./components/DragPortal";
import { ToastContainer } from "./components/ToastContainer";

// Hooks and types
import { useFeedLogic, usePortal } from "./components/hooks/useFeedLogic";
import { FeedScreenProps } from "../../types/feed.types";

// Assets
import forestBackground from "../../../assets/backgrounds/bg-home.png";

export const FeedScreen = ({ onNavigation: _ }: FeedScreenProps) => {
  const constraintsRef = useRef(null);
  const portalRoot = usePortal();
  
  const {
    foods,
    dragState,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  } = useFeedLogic();

  return (
    <div
      ref={constraintsRef}
      className="relative min-h-screen w-full flex flex-col items-center overflow-hidden font-rubik"
      style={{
        backgroundImage: `url(${forestBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Toast Container */}
      <ToastContainer />

      {/* Magical Sparkle Particles */}
      <MagicalSparkleParticles />

      {/* Top Bar */}
      <TamagotchiTopBar
        coins={1250}
        gems={45}
        status={{ energy: 85, hunger: 60, happiness: 30, hygiene: 75 }}
      />

      {/* Feed Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-4 z-10"
      >
        <h1 className="text-2xl md:text-3xl font-luckiest text-cream drop-shadow-lg">
          Feed Your Beast
        </h1>
      </motion.div>

      {/* Beast (Drop Zone) */}
      <Beast isDragging={dragState.isDragging} />

      {/* Food Carousel */}
      <FoodCarousel
        foods={foods}
        isDragging={dragState.isDragging}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      />

      {/* Portal for dragged element */}
      <DragPortal
        isDragging={dragState.isDragging}
        draggedFood={dragState.draggedFood}
        portalPosition={dragState.portalPosition}
        portalRoot={portalRoot.current}
      />
    </div>
  );
};