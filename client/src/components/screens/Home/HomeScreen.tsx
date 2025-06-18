import { useState } from "react";
import { TamagotchiTopBar } from "../../layout/TopBar";
import { HomeScreenProps, BeastData, PlayerData } from "../../types/home.types";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";
import { PlayerInfoModal } from "./components/PlayerInfoModal";
import forestBackground from "../../../assets/backgrounds/bg-home.png";
import babyWorlfBeast from "../../../assets/beasts/baby-wolf.png";

// Hooks
import { usePlayerModal } from "./components/hooks/usePlayerModal";
import { useHomeNavigation } from "./components/hooks/useHomeNavigation";

// Components
import { PlayerInfoSection } from "./components/PlayerInfoSection";
import { ActionButtons } from "./components/ActionButtons";
import { BeastHomeDisplay } from "./components/BeastDisplay";

export const HomeScreen = ({ onNavigation, playerAddress }: HomeScreenProps) => {
  const [age] = useState(1);
  const playerName = "0xluis";

  // Custom hooks
  const { isPlayerInfoModalOpen, openPlayerModal, closePlayerModal } = usePlayerModal();
  const { handleShopClick, handleDailyQuestsClick, handleNavigateLogin } = useHomeNavigation(onNavigation);

  // Data objects
  const beastData: BeastData = {
    age: 3,
    energy: 85,
    hunger: 40,
    happiness: 92,
    cleanliness: 68,
  };

  const playerData: PlayerData = {
    username: playerName,
    points: 5800,
    currentStreak: 4,
    banner: "dragon",
  };

  const handleProfileClick = () => {
    console.log("Profile clicked:", playerAddress);
    openPlayerModal();
  };

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
       
      {/* Top Bar */}
      <TamagotchiTopBar
        coins={12345}
        gems={678}
        status={{ energy: 85, hunger: 60, happiness: 75, hygiene: 90 }}
      />

      {/* Player Info Section */}
      <PlayerInfoSection
        playerName={playerName}
        age={age}
        onProfileClick={handleProfileClick}
        onNavigateLogin={handleNavigateLogin}
        beastData={beastData}
      />

      {/* Beast Display */}
      <BeastHomeDisplay 
        beastImage={babyWorlfBeast}
        altText="Tamagotchi Beast"
      />

      {/* Action Buttons */}
      <ActionButtons
        onShopClick={handleShopClick}
        onDailyQuestsClick={handleDailyQuestsClick}
      />

      {/* Player Info Modal */}
      <PlayerInfoModal
        isOpen={isPlayerInfoModalOpen}
        onClose={closePlayerModal}
        playerData={playerData}
      />
    </div>
  );
};