import { TamagotchiTopBar } from "../../layout/TopBar";

type Screen = "login" | "cover" | "home" | "sleep" | "feed" | "clean" | "play";

interface FeedScreenProps {
  onNavigation: (screen: Screen) => void;
}

export const FeedScreen = ({ onNavigation: _ }: FeedScreenProps) => {
  return (
    <div className="min-h-screen bg-green-100">
      {/* TopBar */}
      <TamagotchiTopBar 
        coins={1250}
        gems={45}
        status={{
          energy: 85,
          hunger: 60,
          happiness: 30,
          hygiene: 75
        }}
      />
      
      {/* Main Content */}
      <div className="flex items-center justify-center p-4 pt-20">
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
    </div>
  );
};