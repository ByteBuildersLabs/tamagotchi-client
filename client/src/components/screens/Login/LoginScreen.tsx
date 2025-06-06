import { useLoginAnimations } from './components/useLoginAnimations';
import { UniverseView, GameView } from './components/CoverViews';
import { VennDiagram } from './components/VennDiagram';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

/**
 * Main Login/Cover component that handles the intro sequence
 * and redirects to cover screen when connect button is clicked
 */

export const LoginScreen = ({ onLoginSuccess }: LoginScreenProps) => {
  const { view, currentCircle } = useLoginAnimations();

  const handleConnect = () => {
    console.log('Connecting wallet...');
    // Navegar al CoverScreen
    onLoginSuccess();
  };

  // Render different views based on animation state
  switch (view) {
    case 'universe':
      return <UniverseView />;
    case 'game':
      return <GameView />;
    case 'cover':
      return <VennDiagram currentCircle={currentCircle} onConnect={handleConnect} />;
    default:
      return null;
  }
};