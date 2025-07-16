import { useMemo } from 'react';
import { useBeastDisplay } from './useBeastDisplay';
import { useRealTimeStatus } from './useRealTimeStatus';

/**
 * Simple hook to combine beast display data with real-time status
 * Returns data optimized for sharing
 */
export const useBeastShareData = () => {
  // Get existing hooks data
  const { currentBeastDisplay, hasLiveBeast, isLoading: beastLoading } = useBeastDisplay();
  const { statusForUI: realTimeStatus, isStatusLoading } = useRealTimeStatus();

  // Combine data for sharing
  const beastDataForShare = useMemo(() => {
    // If no beast, return undefined
    if (!hasLiveBeast || !currentBeastDisplay) {
      return undefined;
    }

    // Prioritize real-time status, fallback to zeros
    return {
      age: currentBeastDisplay.age || 0,
      energy: realTimeStatus?.energy || 0,
      hunger: realTimeStatus?.hunger || 0,
      happiness: realTimeStatus?.happiness || 0,
      cleanliness: realTimeStatus?.hygiene || 0, // Map hygiene -> cleanliness
    };
  }, [currentBeastDisplay, realTimeStatus, hasLiveBeast]);

  // Enhanced sharing metadata
  const shareMetadata = useMemo(() => {
    if (!beastDataForShare || !realTimeStatus) return null;

    const avgHealth = (beastDataForShare.energy + beastDataForShare.hunger + 
                      beastDataForShare.happiness + beastDataForShare.cleanliness) / 4;

    // Determine beast mood and status
    const getMoodData = () => {
      if (avgHealth >= 80) return { mood: "thriving", emoji: "🌟✨" };
      if (avgHealth >= 60) return { mood: "doing well", emoji: "😊🎮" };
      if (avgHealth >= 40) return { mood: "hanging in there", emoji: "😐💪" };
      return { mood: "needs some love", emoji: "😢🆘" };
    };

    // What needs attention
    const needsAttention = [];
    if (beastDataForShare.energy < 40) needsAttention.push("💤 needs rest");
    if (beastDataForShare.hunger < 40) needsAttention.push("🍖 is hungry");
    if (beastDataForShare.happiness < 40) needsAttention.push("🎾 wants to play");
    if (beastDataForShare.cleanliness < 40) needsAttention.push("🛁 needs cleaning");

    const moodData = getMoodData();
    
    return {
      isAwake: realTimeStatus.isAwake,
      hasValidData: avgHealth > 0,
      avgHealth,
      mood: moodData.mood,
      emoji: moodData.emoji,
      needsAttention,
    };
  }, [beastDataForShare, realTimeStatus]);

  return {
    beastDataForShare,
    shareMetadata,
    isLoading: beastLoading || isStatusLoading,
    hasLiveBeast,
  };
};