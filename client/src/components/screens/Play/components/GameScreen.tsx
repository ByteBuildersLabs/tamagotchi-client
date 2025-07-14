import { useEffect } from 'react';
import { GameId } from '../.../../../../types/play.types';
import { getGameById } from '../components/data/miniGames';
import { useBeastDisplay } from '../../../../dojo/hooks/useBeastDisplay';
import { useAccount } from "@starknet-react/core";

// Game Components
import FlappyBeastsScreen from '../components/minigames/flappybeast/FlappyBeastsScreen';

interface GameScreenProps {
  gameId: GameId;
  onExitGame: () => void;
  dojoContext: {
    client: any;
    account: any;
    handleAction: (actionName: string, actionFn: () => Promise<any>) => Promise<any>;
  };
}

export const GameScreen = ({ gameId, onExitGame, dojoContext }: GameScreenProps) => {
  const { account } = useAccount();
  const { currentBeastDisplay, hasLiveBeast, isLoading } = useBeastDisplay();

  // Prevent body scroll when game is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading game...</p>
        </div>
      </div>
    );
  }

  // No beast validation
  if (!hasLiveBeast || !currentBeastDisplay) {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-xl font-bold text-white mb-4">No Beast Available</h2>
          <p className="text-gray-300 mb-6">You need a live beast to play games</p>
          <button
            onClick={onExitGame}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Play
          </button>
        </div>
      </div>
    );
  }

  // Game validation
  const gameConfig = getGameById(gameId);
  if (!gameConfig || !gameConfig.isActive) {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-white mb-4">Game Not Available</h2>
          <p className="text-gray-300 mb-6">This game is currently unavailable</p>
          <button
            onClick={onExitGame}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Play
          </button>
        </div>
      </div>
    );
  }

  // Render the appropriate game based on gameId
  const renderGame = () => {
    switch (gameId) {
      case GameId.FLAPPY_BEASTS:
        return (
          <FlappyBeastsScreen
            onExitGame={onExitGame}
            gameId={gameId}
            beastId={currentBeastDisplay.beast_id}
            beastImage={currentBeastDisplay.asset}
            beastDisplayName={currentBeastDisplay.displayName}
            playerAddress={account?.address || ''}
            dojoContext={dojoContext}
          />
        );
      
      case GameId.PLATFORM_JUMP:
        // TODO: Implement when PlatformJumpScreen is ready
        return (
          <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-xl font-bold text-white mb-4">Coming Soon</h2>
              <p className="text-gray-300 mb-6">Platform Jump is under development</p>
              <button
                onClick={onExitGame}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Back to Play
              </button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">❓</div>
              <h2 className="text-xl font-bold text-white mb-4">Unknown Game</h2>
              <p className="text-gray-300 mb-6">Game ID: {gameId}</p>
              <button
                onClick={onExitGame}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Back to Play
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-screen">
      {renderGame()}
    </div>
  );
};