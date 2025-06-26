import { useState, useMemo } from "react";
import { TamagotchiTopBar } from "../../layout/TopBar";
import { HomeScreenProps, BeastData, PlayerData } from "../../types/home.types";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";
import { PlayerInfoModal } from "./components/PlayerInfoModal";
import forestBackground from "../../../assets/backgrounds/bg-home.png";

// 🔥 NUEVO: Imports para datos dinámicos
import useAppStore from "../../../zustand/store";
import { useBeastStatus } from "../../../dojo/hooks/useBeastStatus";
import { getBeastDisplayInfo, type BeastSpecies, type BeastType } from "../../../utils/beastHelpers";
import { BEAST_ASSETS, type BeastType as EggBeastType } from "../Hatch/components/eggAnimation"; // Para obtener assets

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

  // 🔥 NUEVO: Obtener datos reales del store
  const storePlayer = useAppStore(state => state.player);
  const storeBeasts = useAppStore(state => state.beasts);
  
  // 🔥 NUEVO: Hook para verificar beast status
  const { hasLiveBeast, currentBeastStatus } = useBeastStatus();

  // 🔥 NUEVO: Obtener bestia actual del jugador
  const currentBeast = useMemo(() => {
    if (!storePlayer?.current_beast_id || !storeBeasts.length) {
      return null;
    }
    
    return storeBeasts.find(beast => 
      beast.beast_id === storePlayer.current_beast_id
    ) || null;
  }, [storePlayer?.current_beast_id, storeBeasts]);

  // 🔥 NUEVO: Obtener información de display de la bestia actual
  const currentBeastDisplay = useMemo(() => {
    if (!currentBeast) return null;
    
    // 🔥 CORREGIDO: Cast seguro a los tipos esperados
    const displayInfo = getBeastDisplayInfo(
      currentBeast.specie as BeastSpecies, 
      currentBeast.beast_type as BeastType
    );
    
    // 🔥 CORREGIDO: Mapear beast type numérico a string para acceder a BEAST_ASSETS
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

  // 🔥 NUEVO: Datos de bestia dinámicos basados en status real
  const beastData: BeastData = useMemo(() => {
    if (!currentBeastStatus) {
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
      energy: currentBeastStatus.energy,
      hunger: currentBeastStatus.hunger,
      happiness: currentBeastStatus.happiness,
      cleanliness: currentBeastStatus.hygiene,
    };
  }, [currentBeastStatus, currentBeastDisplay]);

  // Custom hooks
  const { isPlayerInfoModalOpen, openPlayerModal, closePlayerModal } = usePlayerModal();
  const { handleShopClick, handleDailyQuestsClick, handleNavigateLogin } = useHomeNavigation(onNavigation);

  // Player data (mantener hardcodeado por ahora, puede ser dinámico después)
  const playerData: PlayerData = {
    username: playerName,
    points: storePlayer?.total_points || 0, // 🔥 ACTUALIZADO: Usar puntos reales
    currentStreak: storePlayer?.daily_streak || 0, // 🔥 ACTUALIZADO: Usar streak real
    banner: "dragon",
  };

  const handleProfileClick = () => {
    console.log("Profile clicked:", playerAddress);
    openPlayerModal();
  };

  // 🔥 NUEVO: Función para renderizar contenido basado en estado de bestia
  const renderBeastContent = () => {
    // Caso 1: No hay bestia o no está viva
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

    // Caso 2: Bestia viva - mostrar normalmente
    return (
      <BeastHomeDisplay 
        beastImage={currentBeastDisplay.asset}
        altText={`${currentBeastDisplay.displayName}`}
      />
    );
  };

  // 🔥 NUEVO: Determinar si mostrar action buttons
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
       
      {/* Top Bar - 🔥 ACTUALIZADO: Usar datos reales de beast status */}
      <TamagotchiTopBar
        coins={12345} // TODO: Hacer dinámico cuando tengas sistema de coins
        gems={678}    // TODO: Hacer dinámico cuando tengas sistema de gems
        status={{
          energy: currentBeastStatus?.energy || 0,
          hunger: currentBeastStatus?.hunger || 0,
          happiness: currentBeastStatus?.happiness || 0,
          hygiene: currentBeastStatus?.hygiene || 0
        }}
      />

      {/* Player Info Section - 🔥 ACTUALIZADO: Usar beastData dinámico */}
      <PlayerInfoSection
        playerName={playerName}
        age={age}
        onProfileClick={handleProfileClick}
        onNavigateLogin={handleNavigateLogin}
        beastData={beastData}
      />

      {/* 🔥 NUEVO: Beast Display Dinámico */}
      {renderBeastContent()}

      {/* Action Buttons - 🔥 NUEVO: Solo mostrar si hay bestia viva */}
      {shouldShowActionButtons && (
        <ActionButtons
          onShopClick={handleShopClick}
          onDailyQuestsClick={handleDailyQuestsClick}
        />
      )}

      {/* Player Info Modal - 🔥 ACTUALIZADO: Usar playerData con puntos reales */}
      <PlayerInfoModal
        isOpen={isPlayerInfoModalOpen}
        onClose={closePlayerModal}
        playerData={playerData}
      />

      {/* 🔥 NUEVO: Debug info en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-20 left-4 bg-black/80 text-white p-2 rounded text-xs max-w-xs">
          <div>Beast ID: {currentBeast?.beast_id || 'None'}</div>
          <div>Specie: {currentBeast?.specie || 'N/A'}</div>
          <div>Type: {currentBeast?.beast_type || 'N/A'}</div>
          <div>Alive: {hasLiveBeast ? 'Yes' : 'No'}</div>
          <div>Display: {currentBeastDisplay?.displayName || 'None'}</div>
        </div>
      )}
    </div>
  );
};