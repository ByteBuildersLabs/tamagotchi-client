import { useState, useMemo } from "react";
import { TamagotchiTopBar } from "../../layout/TopBar";
import { HomeScreenProps, BeastData, PlayerData } from "../../types/home.types";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";
import { PlayerInfoModal } from "./components/PlayerInfoModal";
import forestBackground from "../../../assets/backgrounds/bg-home.png";

// Dynamic data imports with optimized hook
import useAppStore from "../../../zustand/store";
import { useLiveBeast } from "../../../dojo/hooks/useLiveBeast";
import { getBeastDisplayInfo, type BeastSpecies, type BeastType } from "../../../utils/beastHelpers";
import { BEAST_ASSETS, type BeastType as EggBeastType } from "../Hatch/components/eggAnimation";

// Hooks
import { usePlayerModal } from "./components/hooks/usePlayerModal";
import { useHomeNavigation } from "./components/hooks/useHomeNavigation";

// Components
import { PlayerInfoSection } from "./components/PlayerInfoSection";
import { ActionButtons } from "./components/ActionButtons";
import { BeastHomeDisplay } from "./components/BeastDisplay";

export const HomeScreen = ({ onNavigation }: HomeScreenProps) => {
  const [age] = useState(1);
  const playerName = "0xluis";

  // Get real data from optimized store
  const storePlayer = useAppStore(state => state.player);
  
  // Optimized hook that replaces useBeasts + useBeastStatus
  const { 
    liveBeast, 
    liveBeastStatus, 
    hasLiveBeast 
  } = useLiveBeast();

  const currentBeast = liveBeast;

  // Get display information for current beast
  const currentBeastDisplay = useMemo(() => {
    if (!currentBeast) return null;
    
    // Safe cast to expected types
    const displayInfo = getBeastDisplayInfo(
      currentBeast.specie as BeastSpecies, 
      currentBeast.beast_type as BeastType
    );
    
    // Map numeric beast type to string for BEAST_ASSETS access
    const getBeastTypeString = (beastType: number): EggBeastType => {
      switch (beastType) {
        case 1: return 'wolf';
        case 2: return 'dragon';  
        case 3: return 'snake';
        default: return 'wolf';
      }
    };
    
    const beastTypeString = getBeastTypeString(displayInfo.beastType as number);
    const beastAsset = BEAST_ASSETS[beastTypeString];
    
    return {
      ...displayInfo,
      asset: beastAsset,
      age: currentBeast.age,
      beast_id: currentBeast.beast_id
    };
  }, [currentBeast]);

  // Dynamic beast data based on real status from optimized hook
  const beastData: BeastData = useMemo(() => {
    if (!liveBeastStatus) {
      return {
        age: 0,
        energy: 0,
        hunger: 0,
        happiness: 0,
        cleanliness: 0,
      };
    }

    return {
      age: currentBeastDisplay?.age || 0,
      energy: liveBeastStatus.energy,
      hunger: liveBeastStatus.hunger,
      happiness: liveBeastStatus.happiness,
      cleanliness: liveBeastStatus.hygiene,
    };
  }, [liveBeastStatus, currentBeastDisplay]);

  // Custom hooks
  const { isPlayerInfoModalOpen, openPlayerModal, closePlayerModal } = usePlayerModal();
  const { handleShopClick, handleDailyQuestsClick, handleNavigateLogin } = useHomeNavigation(onNavigation);

  // Player data
  const playerData: PlayerData = {
    username: playerName,
    points: storePlayer?.total_points || 0,
    currentStreak: storePlayer?.daily_streak || 0,
    banner: "dragon",
  };

  const handleProfileClick = () => {
    openPlayerModal();
  };

  // Render content based on beast state
  const renderBeastContent = () => {
    // Case 1: No live beast
    if (!hasLiveBeast || !currentBeastDisplay) {
      return (
        <div className="flex-grow flex items-center justify-center w-full">
          <div className="text-center space-y-4">
            <div className="text-6xl opacity-50">💔</div>
            <h3 className="text-xl font-semibold text-white/90 drop-shadow-lg">
              {!currentBeast ? "No Beast Found" : "Beast Needs Attention"}
            </h3>
            <p className="text-sm text-white/70 drop-shadow-md">
              {!currentBeast 
                ? "Time to hatch your first beast!" 
                : "Your beast needs care to come back to life"}
            </p>
            <button 
              onClick={() => onNavigation("hatch")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              {!currentBeast ? "Hatch New Beast" : "Revive Beast"}
            </button>
          </div>
        </div>
      );
    }

    // Case 2: Live beast - display normally
    return (
      <BeastHomeDisplay 
        beastImage={currentBeastDisplay.asset}
        altText={`${currentBeastDisplay.displayName}`}
      />
    );
  };

  // Determine if action buttons should be shown
  const shouldShowActionButtons = hasLiveBeast && currentBeastDisplay;

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center overflow-hidden font-rubik"
      style={{
        backgroundImage: `url(${forestBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Magical Sparkle Particles */}
      <MagicalSparkleParticles />
       
      {/* Top Bar using liveBeastStatus from optimized hook */}
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

      {/* Player Info Section */}
      <PlayerInfoSection
        playerName={playerName}
        age={age}
        onProfileClick={handleProfileClick}
        onNavigateLogin={handleNavigateLogin}
        beastData={beastData}
      />

      {/* Dynamic Beast Display */}
      {renderBeastContent()}

      {/* Action Buttons - Only show if there's a live beast */}
      {shouldShowActionButtons && (
        <ActionButtons
          onShopClick={handleShopClick}
          onDailyQuestsClick={handleDailyQuestsClick}
        />
      )}

      {/* Player Info Modal */}
      <PlayerInfoModal
        isOpen={isPlayerInfoModalOpen}
        onClose={closePlayerModal}
        playerData={playerData}
      />
    </div>
  );
};