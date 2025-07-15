import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { motion } from "framer-motion";

// Components
import { GameOverModal } from '../GameOverModal';
import { useFlappyGameLogic } from '../flappybeast/useFlappyGameLogic';
import { MiniGameScreenProps, GameResult } from '../../../../../types/play.types';

// Assets
import skyBackground from '../../../../../../assets/icons/games/flappy-beasts-assets/bg-sky.png';
import landBackground from '../../../../../../assets/icons/games/flappy-beasts-assets/bg-land.png';
import ceilingBackground from '../../../../../../assets/icons/games/flappy-beasts-assets/bg-ceiling.png';
import pipeUpImage from '../../../../../../assets/icons/games/flappy-beasts-assets/img-pipe-up.png';
import pipeDownImage from '../../../../../../assets/icons/games/flappy-beasts-assets/img-pipe-up.png';

// Game Constants
const PIPE_GAP = 160;
const PIPE_INTERVAL = 1700;
const GRAVITY = 9.8;
const JUMP_FORCE = -6.5;
const BIRD_WIDTH = 52;
const BIRD_HEIGHT = 52;
const PIPE_WIDTH = 52;

// Speed parameters
const BASE_PIPE_SPEED = 180;
const SPEED_FACTOR = 2;
const MAX_PIPE_SPEED = 600;

// Collider settings
const COLLIDER_MARGIN = 10;
const BIRD_COLLIDER_WIDTH = 30;
const BIRD_COLLIDER_HEIGHT = 30;
const PIPE_COLLIDER_WIDTH = PIPE_WIDTH - (COLLIDER_MARGIN * 2);

const BIRD_COLLIDER_OFFSET_X = (BIRD_WIDTH - BIRD_COLLIDER_WIDTH) / 2;
const BIRD_COLLIDER_OFFSET_Y = (BIRD_HEIGHT - BIRD_COLLIDER_HEIGHT) / 2;

interface FlappyBeastRef {
  resetGame: () => void;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  scored: boolean;
  element: HTMLDivElement;
  topElement: HTMLDivElement;
  bottomElement: HTMLDivElement;
}

interface GameConfig {
  birdX: number;
  birdY: number;
  velocity: number;
  pipes: Pipe[];
  gravity: number;
  jumpForce: number;
  gameWidth: number;
  gameHeight: number;
  running: boolean;
  lastTimestamp: number;
  pipeSpeedPPS: number;
}

const FlappyBeastsScreen = forwardRef<FlappyBeastRef, MiniGameScreenProps>(({
  onExitGame,
  beastImage,
  beastDisplayName,
  handleAction,
  client,
  account
}, ref) => {
  // Game state
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  // Game logic hook (handles all transactions and rewards)
  const {
    checkEnergyRequirement,
    consumeEnergy,
    showEnergyToast,
    setShowEnergyToast,
    handleGameCompletion,
    isProcessingResults
  } = useFlappyGameLogic({ handleAction, client, account });

  // Refs
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const beastRef = useRef<HTMLDivElement>(null);
  const pipesRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(0);
  const lastPipeTime = useRef<number>(0);
  const currentScoreRef = useRef<number>(0);

  // Game configuration
  const gameConfig = useRef<GameConfig>({
    birdX: 60,
    birdY: 0,
    velocity: 0,
    pipes: [],
    gravity: GRAVITY,
    jumpForce: JUMP_FORCE,
    gameWidth: 360,
    gameHeight: 576,
    running: false,
    lastTimestamp: 0,
    pipeSpeedPPS: BASE_PIPE_SPEED,
  });

  // Adjust pipe speed based on score
  useEffect(() => {
    const nextSpeed = BASE_PIPE_SPEED + score * SPEED_FACTOR;
    const clamped = Math.min(nextSpeed, MAX_PIPE_SPEED);
    gameConfig.current.pipeSpeedPPS = clamped;
  }, [score]);

  // Expose resetGame to parent
  useImperativeHandle(ref, () => ({
    resetGame: () => {
      resetGame();
    }
  }));

  // Create a new pipe
  const createPipe = () => {
    if (!pipesRef.current || !gameContainerRef.current) return;

    const game = gameConfig.current;
    const gameHeight = game.gameHeight;

    const minHeight = Math.floor(gameHeight * 0.1);
    const maxHeight = Math.floor(gameHeight * 0.6);
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
    const bottomY = topHeight + PIPE_GAP;

    // Create pipe elements
    const pipeContainer = document.createElement('div');
    pipeContainer.className = 'absolute z-10';
    pipeContainer.style.width = `${PIPE_WIDTH}px`;
    pipeContainer.style.left = `${game.gameWidth}px`;
    pipeContainer.style.height = '100%';

    const topPipe = document.createElement('div');
    topPipe.className = 'absolute top-0';
    topPipe.style.height = `${topHeight}px`;
    topPipe.style.width = `${PIPE_WIDTH}px`;
    topPipe.style.backgroundImage = `url(${pipeUpImage})`;
    topPipe.style.backgroundRepeat = 'repeat-y';
    topPipe.style.backgroundPosition = 'center';

    const bottomPipe = document.createElement('div');
    bottomPipe.className = 'absolute bottom-0';
    bottomPipe.style.height = `${gameHeight - bottomY}px`;
    bottomPipe.style.width = `${PIPE_WIDTH}px`;
    bottomPipe.style.top = `${bottomY}px`;
    bottomPipe.style.backgroundImage = `url(${pipeDownImage})`;
    bottomPipe.style.backgroundRepeat = 'repeat-y';
    bottomPipe.style.backgroundPosition = 'center';

    pipeContainer.appendChild(topPipe);
    pipeContainer.appendChild(bottomPipe);
    pipesRef.current.appendChild(pipeContainer);

    // Add pipe to game state
    game.pipes.push({
      x: game.gameWidth,
      topHeight,
      bottomY,
      scored: false,
      element: pipeContainer,
      topElement: topPipe,
      bottomElement: bottomPipe
    });
  };

  // Remove off-screen pipes
  const removePipes = () => {
    const game = gameConfig.current;
    game.pipes = game.pipes.filter(pipe => {
      if (pipe.x + PIPE_WIDTH < 0) {
        if (pipe.element.parentNode) {
          pipe.element.parentNode.removeChild(pipe.element);
        }
        return false;
      }
      return true;
    });
  };

  // Update bird position
  const updateBird = (dt: number) => {
    const game = gameConfig.current;

    // Apply gravity
    game.velocity += game.gravity * dt;
    const MAX_FALL_SPEED = 15;
    if (game.velocity > MAX_FALL_SPEED) game.velocity = MAX_FALL_SPEED;

    // Update position
    game.birdY += game.velocity * dt * 60;

    // Update visual position
    if (beastRef.current) {
      beastRef.current.style.transform = `translateY(${game.birdY}px) rotate(${Math.min(Math.max(game.velocity * 3, -30), 90)}deg)`;
    }

    // Check boundaries
    if (game.birdY < 0) {
      game.birdY = 0;
      game.velocity = 0;
    } else if (game.birdY > game.gameHeight - BIRD_HEIGHT) {
      endGame();
    }
  };

  // Update pipes
  const updatePipes = (dt: number) => {
    const game = gameConfig.current;
    //const pipeSpeed = game.pipeSpeedPPS * dt;
    const pipeSpeed = gameConfig.current.pipeSpeedPPS * dt;

    game.pipes.forEach(pipe => {
      // Move pipe
      pipe.x -= pipeSpeed;
      pipe.element.style.left = `${pipe.x}px`;

      // Check scoring
      if (!pipe.scored && pipe.x + PIPE_WIDTH < game.birdX) {
        pipe.scored = true;
        currentScoreRef.current += 1;
        setScore(currentScoreRef.current);
        if (scoreRef.current) {
          scoreRef.current.textContent = `${currentScoreRef.current}`;
        }
      }

      // Check collision
      const birdColliderLeft = game.birdX + BIRD_COLLIDER_OFFSET_X;
      const birdColliderTop = game.birdY + BIRD_COLLIDER_OFFSET_Y;
      const birdColliderRight = birdColliderLeft + BIRD_COLLIDER_WIDTH;
      const birdColliderBottom = birdColliderTop + BIRD_COLLIDER_HEIGHT;

      const pipeColliderLeft = pipe.x + (PIPE_WIDTH - PIPE_COLLIDER_WIDTH) / 2;
      const pipeColliderRight = pipeColliderLeft + PIPE_COLLIDER_WIDTH;

      const topPipeColliderBottom = pipe.topHeight - COLLIDER_MARGIN;
      const bottomPipeColliderTop = pipe.bottomY + COLLIDER_MARGIN;

      if (
        birdColliderRight > pipeColliderLeft &&
        birdColliderLeft < pipeColliderRight &&
        (birdColliderTop < topPipeColliderBottom || birdColliderBottom > bottomPipeColliderTop)
      ) {
        endGame();
      }
    });
  };

  // Game update loop
  const update = (timestamp: number) => {
    const game = gameConfig.current;

    if (!game.running) return;

    if (!game.lastTimestamp) {
      game.lastTimestamp = timestamp;
      animationFrameId.current = requestAnimationFrame(update);
      return;
    }

    let dt = (timestamp - game.lastTimestamp) / 1000;
    const MAX_DT = 0.1;
    if (dt > MAX_DT) dt = MAX_DT;

    game.lastTimestamp = timestamp;

    // Create new pipes
    if (timestamp - lastPipeTime.current > PIPE_INTERVAL) {
      createPipe();
      lastPipeTime.current = timestamp;
    }

    updateBird(dt);
    updatePipes(dt);
    removePipes();

    animationFrameId.current = requestAnimationFrame(update);
  };

  // Start game
    const startGame = async () => {
    if (gameConfig.current.running) return;

    // Check energy requirement (now async)
    const hasEnoughEnergy = await checkEnergyRequirement();
    if (!hasEnoughEnergy) {
        setShowEnergyToast(true);
        setTimeout(() => setShowEnergyToast(false), 3000);
        return;
    }

    // Consume energy via the hook
    const energyConsumed = await consumeEnergy();
    if (!energyConsumed) {
        return; // Error already handled by the hook
    }

    // Initialize game
    const game = gameConfig.current;
    game.running = true;
    game.birdY = game.gameHeight / 2 - BIRD_HEIGHT / 2;
    game.velocity = 0;

    if (beastRef.current) {
        beastRef.current.style.transform = `translateY(${game.birdY}px) rotate(0deg)`;
    }

    setGameActive(true);
    setGameOver(false);

    createPipe();
    lastPipeTime.current = performance.now();
    animationFrameId.current = requestAnimationFrame(update);

    // Auto jump at start
    setTimeout(() => {
        if (game.running) jump();
    }, 150);
    };

  // End game
  const endGame = () => {
    if (!gameConfig.current.running) return;

    gameConfig.current.running = false;
    setGameActive(false);
    setGameOver(true);

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    handleGameEnd();
  };

  // Handle game completion (simplified - logic moved to hook)
  const handleGameEnd = async () => {
    const finalScore = currentScoreRef.current;
    
    // Use the hook to handle all the complex logic
    const result = await handleGameCompletion(finalScore);
    
    setGameResult(result);
    setShowGameOverModal(true);
  };

  // Reset game
  const resetGame = () => {
    const game = gameConfig.current;

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    // Reset game state
    game.running = false;
    game.birdY = game.gameHeight / 2 - BIRD_HEIGHT / 2;
    game.velocity = 0;
    game.lastTimestamp = 0;

    // Clear pipes
    if (pipesRef.current) {
      while (pipesRef.current.firstChild) {
        pipesRef.current.removeChild(pipesRef.current.firstChild);
      }
    }
    game.pipes = [];

    // Reset score
    currentScoreRef.current = 0;
    setScore(0);
    if (scoreRef.current) {
      scoreRef.current.textContent = "0";
    }

    // Reset UI
    setGameOver(false);
    setGameActive(false);
    setShowGameOverModal(false);
    setGameResult(null);

    if (beastRef.current) {
      beastRef.current.style.transform = `translateY(${game.birdY}px) rotate(0deg)`;
    }
  };

  // Jump action
  const jump = () => {
    if (!gameActive && !gameOver) {
      startGame();
    } else if (gameActive) {
      gameConfig.current.velocity = gameConfig.current.jumpForce;
      gameConfig.current.birdY -= 5;

      if (beastRef.current) {
        beastRef.current.style.transform = `translateY(${gameConfig.current.birdY}px) rotate(-20deg)`;
      }
    }
  };

  // Handle input events
  useEffect(() => {
    const gameContainer = gameContainerRef.current;
    if (!gameContainer) return;

    const handleClick = (e: MouseEvent) => {
      if (showGameOverModal) return;
      e.preventDefault();
      jump();
    };

    const handleTouch = (e: TouchEvent) => {
      if (showGameOverModal) return;
      e.preventDefault();
      jump();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        if (showGameOverModal) return;
        e.preventDefault();
        jump();
      }
    };

    gameContainer.addEventListener('click', handleClick);
    gameContainer.addEventListener('touchstart', handleTouch);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      gameContainer.removeEventListener('click', handleClick);
      gameContainer.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameActive, gameOver, showGameOverModal]);

  // Adjust game size
  useEffect(() => {
    const adjustGameSize = () => {
      if (!gameContainerRef.current) return;

      const container = gameContainerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      gameConfig.current.gameWidth = containerWidth;
      gameConfig.current.gameHeight = containerHeight;
      gameConfig.current.birdY = containerHeight / 2 - BIRD_HEIGHT / 2;

      if (beastRef.current) {
        beastRef.current.style.transform = `translateY(${gameConfig.current.birdY}px) rotate(0deg)`;
      }

      // Clear pipes on resize
      if (pipesRef.current) {
        while (pipesRef.current.firstChild) {
          pipesRef.current.removeChild(pipesRef.current.firstChild);
        }
      }
      gameConfig.current.pipes = [];
    };

    adjustGameSize();
    window.addEventListener('resize', adjustGameSize);
    window.addEventListener('orientationchange', adjustGameSize);

    return () => {
      window.removeEventListener('resize', adjustGameSize);
      window.removeEventListener('orientationchange', adjustGameSize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-blue-400 select-none">
      {/* Game Container */}
      <div
        ref={gameContainerRef}
        className="relative w-full h-full overflow-hidden"
        style={{ touchAction: 'manipulation' }}
      >
        {/* OPTIMIZACIÓN: Contenedor para la animación del cielo */}
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
          <div className="anim-container-sky" style={{ backgroundImage: `url(${skyBackground})` }} />
        </div>

        {/* OPTIMIZACIÓN: Contenedor para la animación del techo */}
        <div className="absolute top-0 left-0 right-0 h-4 z-10 overflow-hidden">
          <div className="anim-container-ceiling" style={{ backgroundImage: `url(${ceilingBackground})` }} />
        </div>


        {/* Play Area */}
        <div className="absolute top-4 bottom-16 left-0 right-0 z-20">
          {/* Beast */}
          <div
            ref={beastRef}
            className="absolute z-30"
            // OPTIMIZACIÓN: Añadimos will-change para que el navegador optimice las transformaciones.
            style={{
              width: `${BIRD_WIDTH}px`,
              height: `${BIRD_HEIGHT}px`,
              left: `${gameConfig.current.birdX}px`,
              transform: `translateY(${gameConfig.current.birdY}px) rotate(0deg)`,
              willChange: 'transform',
            }}
          >
            <img
              src={beastImage}
              alt={beastDisplayName}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Pipes Container */}
          <div ref={pipesRef} className="relative w-full h-full" />

          {/* Score */}
          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-40">
            <div
              ref={scoreRef}
              className="text-4xl font-bold text-white drop-shadow-lg"
            >
              0
            </div>
          </div>
        </div>

        {/* OPTIMIZACIÓN: Contenedor para la animación del suelo */}
        <div className="absolute bottom-0 left-0 right-0 h-16 z-10 overflow-hidden">
          <div className="anim-container-land" style={{ backgroundImage: `url(${landBackground})` }} />
        </div>

        {/* OPTIMIZACIÓN: El renderizado condicional ya estaba bien hecho. 
            Esto elimina el elemento del DOM cuando no es necesario, lo cual es óptimo. */}
        {!gameActive && !gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center z-50"
          >
            <div className="bg-black/70 backdrop-blur-sm rounded-lg p-6 text-center max-w-xs mx-4">
              <h2 className="text-2xl font-bold text-white mb-4">FLAPPY BEASTS</h2>
              <p className="text-white/90 mb-2">Tap or click to fly</p>
              <p className="text-white/90 mb-6">Avoid obstacles</p>
              <button
                onClick={startGame}
                disabled={isProcessingResults}
                className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingResults ? "Processing..." : "START"}
              </button>
            </div>
          </motion.div>
        )}

        {/* Exit Button */}
        <button
          onClick={onExitGame}
          className="absolute top-4 left-4 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center z-50 hover:bg-black/70 transition-colors"
        >
          ✕
        </button>

        {/* Energy Toast */}
        {showEnergyToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg z-50 flex items-center gap-2"
          >
            <span className="text-lg">⚠️</span>
            <span>Your beast needs at least 30 energy to play!</span>
          </motion.div>
        )}

        {/* Processing Results Overlay */}
        {isProcessingResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 z-60 flex items-center justify-center"
          >
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Saving results...</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Game Over Modal */}
      {showGameOverModal && gameResult && (
        <GameOverModal
          isOpen={showGameOverModal}
          gameResult={gameResult}
          onPlayAgain={() => {
            setShowGameOverModal(false);
            resetGame();
          }}
          onExitGame={onExitGame}
          gameName="Flappy Beasts"
        />
      )}

      {/* CSS Animations */}
      <style>{`
        /* OPTIMIZACIÓN: Se usa un contenedor que es el doble de ancho y se anima con 'transform'. 
           Esto es acelerado por GPU y es mucho más fluido que animar 'background-position'. */

        .anim-container-sky, .anim-container-land, .anim-container-ceiling {
          width: 200%;
          height: 100%;
          background-repeat: repeat-x;
          background-size: auto 100%;
          will-change: transform; /* Le decimos al navegador que se prepare para animar esto */
        }
        .anim-container-sky {
            background-size: cover;
        }

        .anim-container-sky { animation: slide 7s linear infinite; }
        .anim-container-land { animation: slide 2.516s linear infinite; }
        .anim-container-ceiling { animation: slide 0.481s linear infinite; }
        
        @keyframes slide {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
});

FlappyBeastsScreen.displayName = 'FlappyBeastsScreen';

export default FlappyBeastsScreen;