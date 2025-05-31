import React from "react";

type Screen = "login" | "cover" | "home" | "sleep" | "feed" | "clean" | "play";

interface CleanScreenProps {
  onNavigation: (screen: Screen) => void;
}

export const CleanScreen: React.FC<CleanScreenProps> = ({ onNavigation }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-100 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-yellow-800 mb-8">
          Clean Screen
        </h1>
        <div className="text-6xl mb-6">🧼</div>
        <p className="text-yellow-600">
          Pantalla para limpiar a tu Tamagotchi
        </p>
      </div>
    </div>
  );
};