import React from "react";

type Screen = "login" | "cover" | "home" | "sleep" | "feed" | "clean" | "play";

interface FeedScreenProps {
  onNavigation: (screen: Screen) => void;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({ onNavigation }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-8">
          Feed Screen
        </h1>
        <div className="text-6xl mb-6">🍎</div>
        <p className="text-green-600">
          Pantalla para alimentar a tu Tamagotchi
        </p>
      </div>
    </div>
  );
};