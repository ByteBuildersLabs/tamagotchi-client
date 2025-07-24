import { useState } from 'react';
import { toast } from 'react-hot-toast';

// Types
import { GameResult } from '../../../../../types/play.types';
import { GAME_IDS } from '../../../../../types/game.types';

// Services
import CoinGemRewardService from '../../../../../utils/coinGemRewardService';
import { AccountInterface } from 'starknet';
import fetchStatus from '../../../../../../utils/fetchStatus';

// high score hook
import { useHighScore } from '../../../../../../dojo/hooks/useHighScore';

// player hook for refreshing player data
import { usePlayer } from '../../../../../../dojo/hooks/usePlayer';

// Constants
const ENERGY_REQUIREMENT = 20;

interface UseFlappyGameLogicProps {
  handleAction?: (actionName: string, actionFn: () => Promise<any>) => Promise<any>;
  client?: any;
  account?: AccountInterface;
}

interface UseFlappyGameLogicReturn {
  // Energy management
  checkEnergyRequirement: () => Promise<boolean>;
  consumeEnergy: () => Promise<boolean>;
  showEnergyToast: boolean;
  setShowEnergyToast: (show: boolean) => void;
  
  // Game completion
  handleGameCompletion: (finalScore: number) => Promise<GameResult>;
  
  // High score management
  isNewHighScore: boolean;
  currentHighScore: number;
  
  // Loading states
  isProcessingResults: boolean;
}

export const useFlappyGameLogic = ({ 
  handleAction, 
  client, 
  account 
}: UseFlappyGameLogicProps): UseFlappyGameLogicReturn => {
  // simple high score hook
  const {
    flappyBirdScore,
    refetch: refetchHighScores
  } = useHighScore();
  
  // player hook for refreshing player data after rewards
  const { refetch: refetchPlayer } = usePlayer();

  // State
  const [showEnergyToast, setShowEnergyToast] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isProcessingResults, setIsProcessingResults] = useState(false);

  // Get current high score for Flappy Bird
  const currentHighScore = flappyBirdScore;

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
      
      if (statusResponse === null) {
        console.error("Error fetching beast status");
        return false;
      }
      
      if (statusResponse === undefined) {
        console.info("No live beast found");
        return false;
      }
      
      const currentEnergy = statusResponse[5] || 0;
      console.info("Current energy level:", currentEnergy);
      
      // For development, bypass energy check
      const energyByPass = 100;
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
   * Save game results to blockchain
   */
  const saveGameResults = async (score: number, isNewHigh: boolean): Promise<void> => {
    try {
      if (!handleAction || !client || !account) {
        console.warn("Cannot save game results - missing required dependencies");
        return;
      }

      // Calculate rewards for the blockchain transactions
      const rewards = calculateRewards(score);
      
      await handleAction(
        "SaveGameResults",
        async () => {
          // Update total points
          await client.player.updatePlayerTotalPoints(account, score);
          
          // Update total coins
          await client.player.updatePlayerTotalCoins(account, rewards.coins);
          
          // Update total gems
          await client.player.updatePlayerTotalGems(account, rewards.gems);
          
          // Achievement for playing
          await client.achieve.achievePlayerNewTotalPoints(account);
          
          // Update high score
          await client.player.updatePlayerMinigameHighestScore(
            account, 
            score, 
            GAME_IDS.FLAPPY_BEASTS
          );
          
          // High score achievement
          if (isNewHigh) {
            await client.achieve.achieveFlappyBeastHighscore(account, score);
          }
        }
      );

      // Refresh high scores after saving
      await refetchHighScores();
      
      // Refresh player data to update coins/gems in UI
      await refetchPlayer();
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
   */
  const handleGameCompletion = async (finalScore: number): Promise<GameResult> => {
    setIsProcessingResults(true);

    try {
      // Calculate rewards
      const rewards = calculateRewards(finalScore);
      
      // Check if this is a new high score
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
    currentHighScore,
    
    // Loading states
    isProcessingResults,
  };
};