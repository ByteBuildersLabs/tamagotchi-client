import { useState, useCallback, useEffect } from "react";
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

// Helper functions for localStorage
const CURRENT_SCREEN_KEY = "tamagotchi_current_screen";
const PLAYER_ADDRESS_KEY = "tamagotchi_player_address";

const getStoredScreen = (): Screen => {
  try {
    const stored = localStorage.getItem(CURRENT_SCREEN_KEY);
    if (stored && ["login", "hatch", "cover", "home", "sleep", "feed", "clean", "play"].includes(stored)) {
      return stored as Screen;
    }
  } catch (error) {
    console.warn("Error reading from localStorage:", error);
  }
  return "login"; // fallback
};

const setStoredScreen = (screen: Screen) => {
  try {
    localStorage.setItem(CURRENT_SCREEN_KEY, screen);
  } catch (error) {
    console.warn("Error writing to localStorage:", error);
  }
};

const getStoredPlayerAddress = (): string => {
  try {
    return localStorage.getItem(PLAYER_ADDRESS_KEY) || "0x123";
  } catch (error) {
    console.warn("Error reading player address from localStorage:", error);
    return "0x123";
  }
};

const setStoredPlayerAddress = (address: string) => {
  try {
    localStorage.setItem(PLAYER_ADDRESS_KEY, address);
  } catch (error) {
    console.warn("Error writing player address to localStorage:", error);
  }
};

function AppContent() {
  // Initialize state from localStorage
  const [currentScreen, setCurrentScreenState] = useState<Screen>(getStoredScreen);
  const [playerAddress, setPlayerAddress] = useState(getStoredPlayerAddress);

  // Update localStorage whenever screen changes
  useEffect(() => {
    setStoredScreen(currentScreen);
  }, [currentScreen]);

  // Update localStorage whenever player address changes
  useEffect(() => {
    setStoredPlayerAddress(playerAddress);
  }, [playerAddress]);

  const handleNavigation = (screen: Screen) => {
    setCurrentScreenState(screen);
  };

  // Clear localStorage and reset to login (useful for testing)
  // const handleLogout = () => {
  //   try {
  //     localStorage.removeItem(CURRENT_SCREEN_KEY);
  //     localStorage.removeItem(PLAYER_ADDRESS_KEY);
  //     setCurrentScreenState("login");
  //     setPlayerAddress("0x123");
  //   } catch (error) {
  //     console.warn("Error clearing localStorage:", error);
  //   }
  // };

  // 🎯 Specific callback for when HatchEgg finishes
  const handleHatchComplete = useCallback(() => {
    setCurrentScreenState("cover");
  }, []);

  // 🎯 Specific callback for when Cover finishes
  const handleCoverComplete = useCallback(() => {
    setCurrentScreenState("home");
  }, []);

  // Login success handler
  const handleLoginSuccess = useCallback((address?: string) => {
    if (address) {
      setPlayerAddress(address);
    }
    setCurrentScreenState("hatch");
  }, []);

  // Development helper: Log current state
  useEffect(() => {
    console.log(`🎮 Current Screen: ${currentScreen} | Player: ${playerAddress}`);
  }, [currentScreen, playerAddress]);

  return (
    <div className="relative min-h-screen pb-16">
      {/* Development Reset Button - Remove in production */}
      {/* {process.env.NODE_ENV === "development" && currentScreen !== "login" && (
        <button
          onClick={handleLogout}
          className="fixed top-4 right-4 z-[9999] px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors"
          style={{ fontSize: "10px" }}
        >
          Reset to Login
        </button>
      )} */}

      {currentScreen === "login" && (
        <LoginScreen 
          onLoginSuccess={handleLoginSuccess} 
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
        />
      )}

      {currentScreen === "play" && (
        <PlayScreen
          onNavigation={handleNavigation}
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