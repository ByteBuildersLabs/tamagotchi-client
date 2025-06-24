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
  const [playerAddress] = useState("0x123"); // Temporary address

  const handleNavigation = (screen: Screen) => {
    setCurrentScreenState(screen);
  };

  // Callback for when Login completes - dynamic navigation based on beast status
  const handleLoginComplete = useCallback((destination: 'hatch' | 'home') => {
    if (destination === 'home') {
      // Player has live beast - go directly to home
      setCurrentScreenState("home");
    } else {
      // Player needs to spawn beast - go to hatch
      setCurrentScreenState("hatch");
    }
  }, []);

  // Specific callback for when HatchEgg completes
  const handleHatchComplete = useCallback(() => {
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