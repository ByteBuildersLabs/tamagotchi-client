type Screen = "login" | "cover" | "home" | "sleep" | "feed" | "clean" | "play";

interface PlayScreenProps {
  onNavigation: (screen: Screen) => void;
}

export const PlayScreen = ({ onNavigation: _ }: PlayScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple-800 mb-8">
          Play Screen
        </h1>
        <div className="text-6xl mb-6">🎮</div>
        <p className="text-purple-600">
          Pantalla para jugar con tu Tamagotchi
        </p>
      </div>
    </div>
  );
};