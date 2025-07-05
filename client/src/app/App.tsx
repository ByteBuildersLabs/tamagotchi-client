import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
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

// Beast params generation imports
import { generateRandomBeastParams } from "../utils/beastHelpers";
import type { BeastSpawnParams } from "../utils/beastHelpers";

// Sleep logic for navigation blocking
import { useSleepLogic } from "../components/screens/Sleep/components/hooks/useSleepLogic";

function AppContent() {
  const [currentScreen, setCurrentScreenState] = useState<Screen>("login");
  const [playerAddress] = useState("0x123"); // Temporary address
  
  // State for predefined beast parameters
  const [pendingBeastParams, setPendingBeastParams] = useState<BeastSpawnParams | null>(null);

  // Get sleep logic for navigation blocking
  const { shouldBlockNavigation } = useSleepLogic();

  const handleNavigation = (screen: Screen) => {
    // 🚫 NAVIGATION BLOCKING LOGIC
    // Block navigation when beast is sleeping, except to sleep screen
    if (shouldBlockNavigation && screen !== "sleep") {
      toast.error("Your beast is sleeping! 😴 Wake them up first.", {
        duration: 4000,
        style: {
          background: '#1f2937',
          color: '#f3f4f6',
          border: '1px solid #374151',
          borderRadius: '8px',
          fontSize: '14px',
        },
        icon: '🌙',
        position: 'top-center',
      });
      return; // Block navigation
    }

    // Generate parameters when navigating to hatch
    if (screen === "hatch") {
      const beastParams = generateRandomBeastParams();
      setPendingBeastParams(beastParams);
    }
    
    // 🎯 NORMAL NAVIGATION
    setCurrentScreenState(screen);
  };

  // Callback for when Login completes - dynamic navigation based on beast status
  const handleLoginComplete = useCallback((destination: 'hatch' | 'cover') => {
    if (destination === 'cover') {
      // Player has live beast - go directly to home
      setPendingBeastParams(null);
      setCurrentScreenState("cover");
    } else {
      // Player needs to spawn beast - generate params and go to hatch
      const beastParams = generateRandomBeastParams();
      setPendingBeastParams(beastParams);
      setCurrentScreenState("hatch");
    }
  }, []);

  // Specific callback for when HatchEgg completes
  const handleHatchComplete = useCallback(() => {
    // Clear used parameters
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

      {/* Pass beastParams instead of hardcoded eggType */}
      {currentScreen === "hatch" && pendingBeastParams && (
        <HatchEggScreen
          onLoadingComplete={handleHatchComplete}  
          beastParams={pendingBeastParams} 
        />
      )}

      {/* Safety: If no params available, show loading or redirect */}
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

      {/* NavBar - Pass shouldBlockNavigation for visual feedback */}
      {currentScreen !== "cover" && currentScreen !== "login" && currentScreen !== "hatch" && (
        <NavBar
          activeTab={currentScreen as "home" | "sleep" | "feed" | "clean" | "play"}
          onNavigation={handleNavigation}
          shouldBlockNavigation={shouldBlockNavigation}
        />
      )}
    </div>
  );
}

export default function App() {
  return <AppContent />;
}