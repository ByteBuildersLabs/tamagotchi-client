import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

// Layout and shared components
import { TamagotchiTopBar } from "../../layout/TopBar";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";

// Universal hook for beast display
import { useBeastDisplay } from "../../../dojo/hooks/useBeastDisplay";

// Food inventory hook to fetch food data from Dojo
import { useFoodInventory } from "../../../dojo/hooks/useFoodInventory";

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

export const FeedScreen = ({ onNavigation }: FeedScreenProps) => {
  const constraintsRef = useRef(null);
  const portalRoot = usePortal();
  
  // Get current beast data - single hook consumption to avoid conflicts
  const {
    currentBeastDisplay,
    liveBeastStatus,
    hasLiveBeast,
    isLoading: beastLoading
  } = useBeastDisplay();
  
  // Get food inventory data from Dojo
  const {
    foods,
    isLoading: foodLoading,
    error: foodError,
    refetch: refetchFood,
    hasFoodAvailable
  } = useFoodInventory();
  
  // Initialize feeding logic with Dojo contract food data
  const {
    dragState,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  } = useFeedLogic();

  // Auto-refetch food when entering feed screen
  useEffect(() => {
    // Refetch food inventory when component mounts or beast changes
    if (hasLiveBeast) refetchFood();

  }, [hasLiveBeast, refetchFood]);

  // Show loading state while data is being fetched
  if (beastLoading || foodLoading) {
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

  // Show error state if food failed to load
  if (foodError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-900 to-orange-900">
        <div className="text-center">
          <div className="text-6xl opacity-50 mb-4">❌</div>
          <h2 className="text-2xl font-luckiest text-cream drop-shadow-lg mb-4">
            Failed to Load Food
          </h2>
          <p className="text-white/80 mb-6">
            {foodError.message}
          </p>
          <button
            onClick={() => refetchFood()}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Try Again
          </button>
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
            <button 
              onClick={() => refetchFood()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Refresh Food
            </button>
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
        </h1>
      </motion.div>

      {/* Beast display - acts as drop zone for food items */}
      <Beast 
        isDragging={dragState.isDragging} 
        beastImage={currentBeastDisplay.asset}
        beastName={currentBeastDisplay.displayName}
      />

      {/* Food carousel with draggable items */}
      <FoodCarousel
        foods={foods} 
        isDragging={dragState.isDragging}
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
    </div>
  );
};