import { useState } from 'react';
import { toast } from 'react-hot-toast';

// Types
import { GameResult } from '../../../../../types/play.types';
import { GAME_IDS } from '../../../../../types/game.types';

// Services
import CoinGemRewardService from '../../../../../utils/coinGemRewardService';
import { AccountInterface } from 'starknet';
import fetchStatus from '../../../../../../utils/fetchStatus';

// Constants
const ENERGY_REQUIREMENT = 20;

interface UseFlappyGameLogicProps {
  // Using the same pattern as your existing code
  handleAction?: (actionName: string, actionFn: () => Promise<any>) => Promise<any>;
  client?: any;
  account?: AccountInterface;
}

interface UseFlappyGameLogicReturn {
  // Energy management
  checkEnergyRequirement: () => Promise<boolean>; // Updated to async
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

export const useFlappyGameLogic = ({ handleAction, client, account }: UseFlappyGameLogicProps): UseFlappyGameLogicReturn => {
  // State
  const [showEnergyToast, setShowEnergyToast] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isProcessingResults, setIsProcessingResults] = useState(false);

  /**
   * Check if beast has enough energy to play using real-time data
   */
  const checkEnergyRequirement = async (): Promise<boolean> => {
    if (!account) {
      console.warn("No account available for energy check");
      return false;
    }

    try {
      const statusResponse = await fetchStatus(account);
      
      // Handle the different response cases from your fetchStatus
      if (statusResponse === null) {
        // Actual error occurred
        console.error("Error fetching beast status");
        return false;
      }
      
      if (statusResponse === undefined) {
        // No beast exists - expected case
        console.info("No live beast found");
        return false;
      }
      
      // Beast exists, check energy (index 4 per your implementation)
      const currentEnergy = statusResponse[5] || 0;
      console.info("Current energy level:", currentEnergy);
      const energyByPass = 100;
      //return currentEnergy >= ENERGY_REQUIREMENT;
      return energyByPass >= ENERGY_REQUIREMENT;
      
    } catch (error) {
      console.error("Error checking energy requirement:", error);
      return false;
    }
  };

  /**
   * Consume energy before starting the game
   */
  const consumeEnergy = async (): Promise<boolean> => {
    try {
      if (!handleAction || !client || !account) {
        console.warn("Missing Dojo dependencies for energy consumption");
        return false;
      }

      await handleAction(
        "Play",
        async () => await client.game.play(account)
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
      // TODO: Implement high score fetching using your existing Dojo setup
      // This would typically query the blockchain for the player's best score
      // You might already have a hook or function for this
      return 0;
    } catch (error) {
      console.error("Error fetching high score:", error);
      return 0;
    }
  };

  /**
   * Save game results to blockchain using your existing pattern
   */
  const saveGameResults = async (score: number, isNewHigh: boolean): Promise<void> => {
    try {
      if (!handleAction || !client || !account) {
        console.warn("Cannot save game results - missing required dependencies");
        return;
      }

      await handleAction(
        "SaveGameResults",
        async () => {
          // Update total points
          await client.player.updatePlayerTotalPoints(account, score);
          
          // Achievement for playing
          const txtest = await client.achieve.achievePlayerNewTotalPoints(account);
          console.info('achievePlayerNewTotalPoints result:', txtest);
          
          // Update high score (using FLAPPY_BEASTS game ID = 1)
          await client.player.updatePlayerMinigameHighestScore(account, score, GAME_IDS.FLAPPY_BEASTS);
          
          // High score achievement
          if (isNewHigh) {
            await client.achieve.achieveFlappyBeastHighscore(account, score);
          }
        }
      );

      console.log("Game results saved successfully");
    } catch (error) {
      console.error("Error saving game results:", error);
      toast.error("Couldn't save your game results. Your progress might not be recorded.");
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