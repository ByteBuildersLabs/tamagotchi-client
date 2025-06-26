import { useState, useCallback } from "react";
import { CoverScreen } from "../components/screens/Cover/CoverScreen";
import { HatchEggScreen } from "../components/screens/Hatch/HatchEggScreen";
import { HomeScreen } from "../components/screens/Home/HomeScreen";
import { SleepScreen } from "../components/screens/Sleep/SleepScreen";
import { FeedScreen } from "../components/screens/Feed/FeedScreen";
import { CleanScreen } from "../components/screens/Clean/CleanScreen";
import { PlayScreen } from "../components/screens/Play/PlayScreen";
import { LoginScreen } from "../components/screens/Login/LoginScreen";
import { NavBar } from "../components/layout/NavBar";
import type { Screen } from "../components/types/screens";

// 🔥 NUEVO: Imports para generación de beast params
import { generateRandomBeastParams } from "../utils/beastHelpers";
import type { BeastSpawnParams } from "../utils/beastHelpers";

function AppContent() {
  const [currentScreen, setCurrentScreenState] = useState<Screen>("login");
  const [playerAddress] = useState("0x123"); // Temporary address
  
  // 🔥 NUEVO: Estado para parámetros de bestia predeterminados
  const [pendingBeastParams, setPendingBeastParams] = useState<BeastSpawnParams | null>(null);

  const handleNavigation = (screen: Screen) => {
    // 🔥 NUEVO: Si navega a hatch, generar parámetros
    if (screen === "hatch") {
      const beastParams = generateRandomBeastParams();
      console.log("🎲 Generated beast params for navigation:", beastParams);
      setPendingBeastParams(beastParams);
    }
    
    setCurrentScreenState(screen);
  };

  // Callback for when Login completes - dynamic navigation based on beast status
  const handleLoginComplete = useCallback((destination: 'hatch' | 'cover') => {
    if (destination === 'cover') {
      // Player has live beast - go directly to home
      setPendingBeastParams(null); // 🔥 Limpiar params si no se necesitan
      setCurrentScreenState("cover");
    } else {
      // Player needs to spawn beast - generate params and go to hatch
      const beastParams = generateRandomBeastParams();
      console.log("🎲 Generated beast params for new player:", beastParams);
      setPendingBeastParams(beastParams);
      setCurrentScreenState("hatch");
    }
  }, []);

  // Specific callback for when HatchEgg completes
  const handleHatchComplete = useCallback(() => {
    // 🔥 NUEVO: Limpiar parámetros usados
    setPendingBeastParams(null);
    setCurrentScreenState("cover");
  }, []);

  // Specific callback for when Cover completes
  const handleCoverComplete = useCallback(() => {
    setCurrentScreenState("home");
  }, []);

  return (
    <div className="relative min-h-screen pb-16">
      {currentScreen === "login" && (
        <LoginScreen 
          onLoginSuccess={handleLoginComplete}
        />
      )}

      {/* 🔥 ACTUALIZADO: Pasar beastParams en lugar de eggType hardcodeado */}
      {currentScreen === "hatch" && pendingBeastParams && (
        <HatchEggScreen
          onLoadingComplete={handleHatchComplete}  
          beastParams={pendingBeastParams} 
        />
      )}

      {/* 🔥 SEGURIDAD: Si no hay params, mostrar loading o redirigir */}
      {currentScreen === "hatch" && !pendingBeastParams && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-white">Preparing beast hatching...</p>
          </div>
        </div>
      )}

      {currentScreen === "cover" && (
        <CoverScreen
          onLoadingComplete={handleCoverComplete}  
        />
      )}

      {currentScreen === "home" && (
        <HomeScreen
          onNavigation={handleNavigation}
          playerAddress={playerAddress}
        />
      )}

      {currentScreen === "sleep" && (
        <SleepScreen
          onNavigation={handleNavigation}
          playerAddress={playerAddress}
        />
      )}

      {currentScreen === "feed" && (
        <FeedScreen
          onNavigation={handleNavigation}
        />
      )}

      {currentScreen === "clean" && (
        <CleanScreen
          onNavigation={handleNavigation}
          playerAddress={playerAddress}
        />
      )}

      {currentScreen === "play" && (
        <PlayScreen
          onNavigation={handleNavigation}
          playerAddress={playerAddress}
        />
      )}

      {/* NavBar */}
      {currentScreen !== "cover" && currentScreen !== "login" && currentScreen !== "hatch" && (
        <NavBar
          activeTab={currentScreen as "home" | "sleep" | "feed" | "clean" | "play"}
          onNavigation={handleNavigation}
        />
      )}
    </div>
  );
}

export default function App() {
  return <AppContent />;
}