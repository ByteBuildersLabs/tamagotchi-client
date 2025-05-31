import React from "react";

type Screen = "login" | "cover" | "home" | "sleep" | "feed" | "clean" | "play";

interface HomeScreenProps {
  onNavigation: (screen: Screen) => void;
  playerAddress: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onNavigation, 
  playerAddress 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Home Screen
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <p className="text-gray-600 mb-4">
            Player: {playerAddress}
          </p>
          <p className="text-sm text-gray-500">
            Usa el navbar para navegar entre pantallas
          </p>
        </div>
      </div>
    </div>
  );
};