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

function AppContent() {
  const [currentScreen, setCurrentScreenState] = useState<Screen>("login");
  const [playerAddress] = useState("0x123"); // Dirección temporal

  const handleNavigation = (screen: Screen) => {
    setCurrentScreenState(screen);
  };

  // 🎯 Callback para cuando Login termina - navegación dinámica basada en beast status
  const handleLoginComplete = useCallback((destination: 'hatch' | 'home') => {
    console.log(`🧭 Login complete, navigating to: ${destination}`);
    
    if (destination === 'home') {
      // Player has live beast - go directly to home
      setCurrentScreenState("home");
    } else {
      // Player needs to spawn beast - go to hatch
      setCurrentScreenState("hatch");
    }
  }, []);

  // 🎯 Callback específico para cuando HatchEgg termina
  const handleHatchComplete = useCallback(() => {
    console.log("🥚 Hatch complete, going to cover screen");
    setCurrentScreenState("cover");
  }, []);

  // 🎯 Callback específico para cuando Cover termina
  const handleCoverComplete = useCallback(() => {
    console.log("🌟 Cover complete, going to home screen");
    setCurrentScreenState("home");
  }, []);

  return (
    <div className="relative min-h-screen pb-16">
      {currentScreen === "login" && (
        <LoginScreen 
          onLoginSuccess={handleLoginComplete}
        />
      )}

      {currentScreen === "hatch" && (
        <HatchEggScreen
          onLoadingComplete={handleHatchComplete}  
          eggType="shadow"
        />
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