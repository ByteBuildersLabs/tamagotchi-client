import React from "react";

type Screen = "login" | "cover" | "home" | "sleep" | "feed" | "clean" | "play";

interface SleepScreenProps {
  onNavigation: (screen: Screen) => void;
}

export const SleepScreen: React.FC<SleepScreenProps> = ({ onNavigation }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-100 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-indigo-800 mb-8">
          Sleep Screen
        </h1>
        <div className="text-6xl mb-6">😴</div>
        <p className="text-indigo-600">
          Pantalla de sueño para tu Tamagotchi
        </p>
      </div>
    </div>
  );
};