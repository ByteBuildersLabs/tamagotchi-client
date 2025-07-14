import { useState } from 'react';
import { toast } from 'react-hot-toast';

// Types
import { GameResult } from '../../../../../types/play.types';
import { GAME_IDS } from '../../../../../types/game.types';

// Hooks
import { useBeastDisplay } from '../../../../../../dojo/hooks/useBeastDisplay';

// Services
import CoinGemRewardService from '../../../../../utils/coinGemRewardService';

// Constants
const ENERGY_REQUIREMENT = 20;

interface UseFlappyGameLogicProps {
  dojoContext: {
    client: any;
    account: any;
    handleAction: (actionName: string, actionFn: () => Promise<any>) => Promise<any>;
  };
}

interface UseFlappyGameLogicReturn {
  // Energy management
  checkEnergyRequirement: () => boolean;
  consumeEnergy: () => Promise<boolean>;
  showEnergyToast: boolean;
  setShowEnergyToast: (show: boolean) => void;
  
  // Game completion
  handleGameCompletion: (finalScore: number) => Promise<GameResult>;
  
  // High score management
  isNewHighScore: boolean;
  
  // Loading states
  isProcessingResults: boolean;
}

export const useFlappyGameLogic = ({ dojoContext }: UseFlappyGameLogicProps): UseFlappyGameLogicReturn => {
  // State
  const [showEnergyToast, setShowEnergyToast] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isProcessingResults, setIsProcessingResults] = useState(false);

  // Beast data
  const { liveBeastStatus } = useBeastDisplay();

  /**
   * Check if beast has enough energy to play
   */
  const checkEnergyRequirement = (): boolean => {
    const currentEnergy = liveBeastStatus?.energy || 0;
    return currentEnergy >= ENERGY_REQUIREMENT;
  };

  /**
   * Consume energy before starting the game
   */
  const consumeEnergy = async (): Promise<boolean> => {
    try {
      if (!dojoContext.handleAction || !dojoContext.client || !dojoContext.account) {
        console.warn("Missing Dojo context for energy consumption");
        return false;
      }

      await dojoContext.handleAction(
        "Play",
        async () => await dojoContext.client.game.play(dojoContext.account)
      );

      return true;
    } catch (error) {
      console.error("Error consuming energy:", error);
      toast.error("Failed to start game - could not consume energy");
      return false;
    }
  };

  /**
   * Fetch current high score for comparison
   */
  const fetchCurrentHighScore = async (): Promise<number> => {
    try {
      // TODO: Implement high score fetching from Dojo
      // This would typically query the blockchain for the player's best score
      // For now, returning 0 as placeholder
      return 0;
    } catch (error) {
      console.error("Error fetching high score:", error);
      return 0;
    }
  };

  /**
   * Save game results to blockchain
   */
  const saveGameResults = async (score: number, isNewHigh: boolean): Promise<void> => {
    try {
      if (!dojoContext.handleAction || !dojoContext.client || !dojoContext.account) {
        console.warn("Missing Dojo context for saving results");
        return;
      }

      await dojoContext.handleAction(
        "SaveGameResults",
        async () => {
          // Update total points
          await dojoContext.client.player.updatePlayerTotalPoints(
            dojoContext.account, 
            score
          );

          // Achievement for playing
          await dojoContext.client.achieve.achievePlayerNewTotalPoints(
            dojoContext.account
          );

          // Update high score
          await dojoContext.client.player.updatePlayerMinigameHighestScore(
            dojoContext.account, 
            score, 
            GAME_IDS.FLAPPY_BEASTS
          );

          // High score achievement
          if (isNewHigh) {
            await dojoContext.client.achieve.achieveFlappyBeastHighscore(
              dojoContext.account, 
              score
            );
          }
        }
      );

      console.log("Game results saved successfully");
    } catch (error) {
      console.error("Error saving game results:", error);
      toast.error("Failed to save game results");
    }
  };

  /**
   * Calculate rewards based on score
   */
  const calculateRewards = (score: number) => {
    return CoinGemRewardService.calculateCoinReward(GAME_IDS.FLAPPY_BEASTS, score);
  };

  /**
   * Calculate additional game statistics
   */
  const calculateGameStats = (score: number) => {
    return {
      tier: calculateRewards(score).range.label,
      accuracy: score > 0 ? Math.round((score / (score + 1)) * 100) : 0,
      rank: score < 10 ? 'Beginner' : score < 25 ? 'Intermediate' : 'Advanced'
    };
  };

  /**
   * Main function to handle game completion
   * Coordinates all post-game logic
   */
  const handleGameCompletion = async (finalScore: number): Promise<GameResult> => {
    setIsProcessingResults(true);

    try {
      // Calculate rewards
      const rewards = calculateRewards(finalScore);
      
      // Check if this is a new high score
      const currentHighScore = await fetchCurrentHighScore();
      const isNewHigh = finalScore > currentHighScore;
      setIsNewHighScore(isNewHigh);

      // Save results to blockchain (async, don't block UI)
      saveGameResults(finalScore, isNewHigh).catch(error => {
        console.error("Background save failed:", error);
      });

      // Calculate game statistics
      const gameStats = calculateGameStats(finalScore);

      // Create game result object
      const gameResult: GameResult = {
        score: finalScore,
        rewards: {
          coins: rewards.coins,
          gems: rewards.gems,
          range: rewards.range,
          percentage: rewards.percentage
        },
        isNewHighScore: isNewHigh,
        gameData: gameStats
      };

      // Show success toast
      if (isNewHigh) {
        toast.success(`🏆 New High Score: ${finalScore}!`, { duration: 4000 });
      } else {
        toast.success(`Game Complete! +${rewards.coins} coins, +${rewards.gems} gems`, { 
          duration: 3000 
        });
      }

      return gameResult;

    } catch (error) {
      console.error("Error handling game completion:", error);
      
      // Fallback result in case of error
      const fallbackRewards = calculateRewards(finalScore);
      
      return {
        score: finalScore,
        rewards: {
          coins: fallbackRewards.coins,
          gems: fallbackRewards.gems,
          range: fallbackRewards.range,
          percentage: fallbackRewards.percentage
        },
        isNewHighScore: false,
        gameData: calculateGameStats(finalScore)
      };

    } finally {
      setIsProcessingResults(false);
    }
  };

  return {
    // Energy management
    checkEnergyRequirement,
    consumeEnergy,
    showEnergyToast,
    setShowEnergyToast,
    
    // Game completion
    handleGameCompletion,
    
    // High score management
    isNewHighScore,
    
    // Loading states
    isProcessingResults,
  };
};