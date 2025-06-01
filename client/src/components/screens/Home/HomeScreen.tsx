import { TamagotchiTopBar } from "../../layout/TopBar";

type Screen = "login" | "cover" | "home" | "sleep" | "feed" | "clean" | "play";

interface HomeScreenProps {
  onNavigation: (screen: Screen) => void;
  playerAddress: string;
}

export const HomeScreen = ({ 
  onNavigation: _, 
  playerAddress 
}: HomeScreenProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* TopBar */}
      <TamagotchiTopBar 
        coins={500}
        gems={50}
        status={{
          energy: 85,
          hunger: 60,
          happiness: 75,
          hygiene: 60
        }}
      />
      
      {/* Main Content */}
      <div className="flex items-center justify-center p-4 pt-20">
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
    </div>
  );
};