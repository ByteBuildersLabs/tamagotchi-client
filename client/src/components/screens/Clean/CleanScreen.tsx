import { TamagotchiTopBar } from "../../layout/TopBar";

type Screen = "login" | "cover" | "home" | "sleep" | "feed" | "clean" | "play";

interface CleanScreenProps {
  onNavigation: (screen: Screen) => void;
}

export const CleanScreen = ({ onNavigation: _ }: CleanScreenProps) => {
  return (
    <div className="min-h-screen bg-yellow-100">
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
      
      {/* Contenido principal */}
      <div className="flex items-center justify-center p-4 pt-20">
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
    </div>
  );
};