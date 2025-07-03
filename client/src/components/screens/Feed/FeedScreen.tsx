import { useRef } from "react";
import { motion } from "framer-motion";

// Layout and shared components
import { TamagotchiTopBar } from "../../layout/TopBar";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";

// Universal hook for beast display
import { useBeastDisplay } from "../../../dojo/hooks/useBeastDisplay";

// Feed components
import { Beast } from "./components/beasts";
import { FoodCarousel } from "./components/FoodCarousel";
import { DragPortal } from "./components/DragPortal";
import { ToastContainer } from "./components/ToastContainer";

// Main feed logic hook (includes all food inventory + transaction logic)
import { useFeedLogic, usePortal } from "./components/hooks/useFeedLogic";
import { FeedScreenProps } from "../../types/feed.types";

// Assets
import forestBackground from "../../../assets/backgrounds/bg-home.png";

export const FeedScreen = ({ onNavigation }: FeedScreenProps) => {
  const constraintsRef = useRef(null);
  const portalRoot = usePortal();
  
  // Get current beast data
  const {
    currentBeastDisplay,
    liveBeastStatus,
    hasLiveBeast,
    isLoading: beastLoading
  } = useBeastDisplay();
  
  // Get complete feeding logic (includes food inventory + transactions)
  const {
    foods,
    isLoading: foodLoading,
    dragState,
    isFeeding,
    isCarouselDisabled,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  } = useFeedLogic();

  // Computed states
  const hasFoodAvailable = foods.some(food => food.count > 0);
  const isLoading = beastLoading || foodLoading;

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-900 to-orange-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-white">
            {beastLoading ? "Loading your beast..." : "Loading your food inventory..."}
          </p>
        </div>
      </div>
    );
  }

  // Show empty state when no beast is available
  if (!hasLiveBeast || !currentBeastDisplay) {
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
        <MagicalSparkleParticles />
        
        <TamagotchiTopBar
          coins={1250}
          gems={45}
          status={{ energy: 0, hunger: 0, happiness: 0, hygiene: 0 }}
        />

        <div className="flex-grow flex items-center justify-center w-full">
          <div className="text-center space-y-6 z-10">
            <div className="text-6xl opacity-50">🍽️</div>
            <h2 className="text-2xl font-luckiest text-cream drop-shadow-lg">
              No Beast to Feed!
            </h2>
            <p className="text-white/80 drop-shadow-md">
              You need a beast to use the feeding feature
            </p>
            <button 
              onClick={() => onNavigation("hatch")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Hatch New Beast
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show no food available state
  if (!hasFoodAvailable) {
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
        <MagicalSparkleParticles />
        
        <TamagotchiTopBar
          coins={1250}
          gems={45}
          status={{
            energy: liveBeastStatus?.energy || 0,
            hunger: liveBeastStatus?.hunger || 0,
            happiness: liveBeastStatus?.happiness || 0,
            hygiene: liveBeastStatus?.hygiene || 0
          }}
        />

        <div className="flex-grow flex items-center justify-center w-full">
          <div className="text-center space-y-6 z-10">
            <div className="text-6xl opacity-50">🍽️</div>
            <h2 className="text-2xl font-luckiest text-cream drop-shadow-lg">
              No Food Available!
            </h2>
            <p className="text-white/80 drop-shadow-md">
              You don't have any food to feed your {currentBeastDisplay.displayName}
            </p>
            <p className="text-white/60 text-sm">
              {isFeeding ? "Feeding in progress..." : "Try refreshing or check your inventory"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render main feeding interface
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
      {/* Toast notifications for feeding feedback */}
      <ToastContainer />

      {/* Background particle effects */}
      <MagicalSparkleParticles />

      {/* Top status bar with coins, gems, and beast stats */}
      <TamagotchiTopBar
        coins={1250} // TODO: Make dynamic when coin system is implemented
        gems={45}    // TODO: Make dynamic when gem system is implemented
        status={{
          energy: liveBeastStatus?.energy || 0,
          hunger: liveBeastStatus?.hunger || 0,
          happiness: liveBeastStatus?.happiness || 0,
          hygiene: liveBeastStatus?.hygiene || 0
        }}
      />

      {/* Screen title with beast name */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-4 z-10"
      >
        <h1 className="text-2xl md:text-3xl font-luckiest text-cream drop-shadow-lg">
          Feed Your {currentBeastDisplay.displayName}
          {isFeeding && <span className="text-lg text-yellow-300 ml-2">🍽️</span>}
        </h1>
      </motion.div>

      {/* Beast display - acts as drop zone for food items */}
      <Beast 
        isDragging={dragState.isDragging}
        isFeeding={isFeeding} // NEW: Pass feeding state to beast
        beastImage={currentBeastDisplay.asset}
        beastName={currentBeastDisplay.displayName}
      />

      {/* Food carousel with draggable items */}
      <FoodCarousel
        foods={foods}
        isDragging={dragState.isDragging}
        isDisabled={isCarouselDisabled} // NEW: Pass disabled state
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      />

      {/* Portal for rendering dragged food item outside normal DOM hierarchy */}
      <DragPortal
        isDragging={dragState.isDragging}
        draggedFood={dragState.draggedFood}
        portalPosition={dragState.portalPosition}
        portalRoot={portalRoot.current}
      />

      {/* Feeding indicator overlay */}
      {isFeeding && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
              <span className="text-gray-800 font-semibold">Feeding your beast...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};