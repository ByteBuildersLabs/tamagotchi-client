import { TamagotchiTopBar } from "../../layout/TopBar";

type Screen = "login" | "cover" | "home" | "sleep" | "feed" | "clean" | "play";

interface SleepScreenProps {
  onNavigation: (screen: Screen) => void;
}

export const SleepScreen = ({ onNavigation: _ }: SleepScreenProps) => {
  return (
    <div className="min-h-screen bg-indigo-100">
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
          <h1 className="text-4xl font-bold text-indigo-800 mb-8">
            Sleep Screen
          </h1>
          <div className="text-6xl mb-6">😴</div>
          <p className="text-indigo-600">
            Pantalla de sueño para tu Tamagotchi
          </p>
        </div>
      </div>
    </div>
  );
};