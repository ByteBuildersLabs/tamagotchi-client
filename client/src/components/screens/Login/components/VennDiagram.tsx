import type { CircleType } from '../../../types/login.types';
import { SVGDefinitions, BackgroundElements } from './SVGComponents';
import { InteractiveCircles } from './InteractiveCircles';

interface VennDiagramProps {
  currentCircle: CircleType;
  onConnect?: () => void;
}

export const VennDiagram = ({ currentCircle, onConnect }: VennDiagramProps) => {
  const handleConnect = () => {
    console.log('Connect button clicked');
    onConnect?.();
  };

  return (
    <div className="h-screen w-full bg-screen flex flex-col items-center justify-center absolute top-0 left-0 z-10 opacity-0 translate-y-8 animate-fadeInUp">
      <div className="max-w-md mx-auto">
        
        {/* Main title */}
        <h1 
          className="font-luckiest text-3xl sm:text-4xl text-center text-text-primary mb-8 opacity-0 translate-y-8 animate-fadeInUp"
          style={{ animationDelay: '0.2s' }}
        >
          Beasts Awaits You!
        </h1>
        
        {/* Interactive diagram */}
        <div 
          className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto opacity-0 translate-y-8 animate-fadeInUp"
          style={{ animationDelay: '0.4s' }}
        >
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <SVGDefinitions />
            <BackgroundElements />
            <InteractiveCircles currentCircle={currentCircle} />
          </svg>
        </div>
        
        {/* Connect Button */}
        <div 
          className="flex justify-center mt-8 opacity-0 translate-y-8 animate-fadeInUp"
          style={{ animationDelay: '0.6s' }}
        >
          <button
            onClick={handleConnect}
            className="btn-cr-yellow text-lg px-8 py-3 hover:scale-105 active:scale-95 transition-transform duration-150"
          >
            CONNECT
          </button>
        </div>
        
      </div>
    </div>
  );
};