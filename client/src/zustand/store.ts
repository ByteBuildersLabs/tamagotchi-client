import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Import types from generated bindings
import { 
  Player, 
  Beast, 
  BeastStatus, 
  Food, 
  HighestScore 
} from '../dojo/models.gen';

// 🔥 NEW: Simplified Beast State - only what we actually need
interface LiveBeastData {
  beast: Beast | null;
  status: BeastStatus | null;
  isAlive: boolean;
}

// App State Interface
interface AppStore {
  // Player state
  player: Player | null;
  
  // 🔥 OPTIMIZED: Single live beast data instead of arrays
  liveBeast: LiveBeastData;
  
  // 🔥 DEPRECATED: Remove these arrays - we only need the live beast
  // beasts: Beast[];
  // currentBeast: Beast | null;
  // beastStatuses: BeastStatus[];
  // currentBeastStatus: BeastStatus | null;
  
  // Food state
  foods: Food[];
  
  // Scores state
  highestScores: HighestScore[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  gameStarted: boolean;
  
  // Player actions
  setPlayer: (player: Player | null) => void;
  updatePlayerStreak: (daily_streak: number) => void;
  updatePlayerPoints: (total_points: number) => void;
  updateCurrentBeastId: (current_beast_id: number) => void;
  
  // 🔥 NEW: Simplified beast actions for live beast only
  setLiveBeast: (beast: Beast | null, status: BeastStatus | null) => void;
  updateLiveBeastStatus: (statusUpdate: Partial<BeastStatus>) => void;
  clearLiveBeast: () => void;
  
  // 🔥 DEPRECATED: Remove old beast array actions
  // setBeasts: (beasts: Beast[]) => void;
  // addBeast: (beast: Beast) => void;
  // setCurrentBeast: (beast: Beast | null) => void;
  // setBeastStatuses: (beastStatuses: BeastStatus[]) => void;
  // setCurrentBeastStatus: (beastStatus: BeastStatus | null) => void;
  // updateBeastStatus: (player: string, beast_id: number, statusUpdate: Partial<BeastStatus>) => void;
  
  // Food actions
  setFoods: (foods: Food[]) => void;
  updateFoodAmount: (player: string, id: number, amount: number) => void;
  addFood: (food: Food) => void;
  
  // Score actions
  setHighestScores: (scores: HighestScore[]) => void;
  updateHighestScore: (minigameId: number, score: number) => void;
  
  // UI actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setConnected: (isConnected: boolean) => void;
  startGame: () => void;
  endGame: () => void;
  
  // Utility actions
  resetStore: () => void;
  
  // 🔥 NEW: Convenience getters
  hasLiveBeast: () => boolean;
  getCurrentBeastId: () => number | null;
}

// Initial state
const initialState = {
  player: null,
  liveBeast: {
    beast: null,
    status: null,
    isAlive: false
  },
  foods: [],
  highestScores: [],
  isLoading: false,
  error: null,
  isConnected: false,
  gameStarted: false,
};

// Create the store
const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Player actions
      setPlayer: (player) => set({ player }),
      
      updatePlayerStreak: (daily_streak) => set((state) => ({
        player: state.player ? { ...state.player, daily_streak } : null
      })),
      
      updatePlayerPoints: (total_points) => set((state) => ({
        player: state.player ? { ...state.player, total_points } : null
      })),
      
      updateCurrentBeastId: (current_beast_id) => set((state) => ({
        player: state.player ? { ...state.player, current_beast_id } : null
      })),
      
      // 🔥 NEW: Simplified live beast actions
      setLiveBeast: (beast, status) => set({
        liveBeast: {
          beast,
          status,
          isAlive: status?.is_alive || false
        }
      }),
      
      updateLiveBeastStatus: (statusUpdate) => set((state) => ({
        liveBeast: {
          ...state.liveBeast,
          status: state.liveBeast.status 
            ? { ...state.liveBeast.status, ...statusUpdate }
            : null,
          isAlive: statusUpdate.is_alive !== undefined 
            ? statusUpdate.is_alive 
            : state.liveBeast.isAlive
        }
      })),
      
      clearLiveBeast: () => set({
        liveBeast: {
          beast: null,
          status: null,
          isAlive: false
        }
      }),
      
      // Food actions
      setFoods: (foods) => set({ foods }),
      
      updateFoodAmount: (player, id, amount) => set((state) => ({
        foods: state.foods.map(food => 
          food.player === player && food.id === id ? { ...food, amount } : food
        )
      })),
      
      addFood: (food) => set((state) => ({
        foods: [...state.foods, food]
      })),
      
      // Score actions
      setHighestScores: (highestScores) => set({ highestScores }),
      
      updateHighestScore: (minigameId, score) => set((state) => {
        const existingIndex = state.highestScores.findIndex(
          s => s.minigame_id === minigameId && s.player === state.player?.address
        );
        
        if (existingIndex !== -1) {
          // Update existing score
          const newScores = [...state.highestScores];
          newScores[existingIndex] = { ...newScores[existingIndex], score };
          return { highestScores: newScores };
        } else {
          // Add new score
          const newScore: HighestScore = {
            minigame_id: minigameId,
            player: state.player?.address || '',
            score
          };
          return { highestScores: [...state.highestScores, newScore] };
        }
      }),
      
      // UI actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setConnected: (isConnected) => set({ isConnected }),
      startGame: () => set({ gameStarted: true }),
      endGame: () => set({ gameStarted: false }),
      
      // 🔥 NEW: Convenience getters
      hasLiveBeast: () => {
        const state = get();
        return state.liveBeast.isAlive && 
               state.liveBeast.beast !== null && 
               state.liveBeast.status !== null;
      },
      
      getCurrentBeastId: () => {
        const state = get();
        return state.liveBeast.beast?.beast_id || null;
      },
      
      // Utility actions
      resetStore: () => set(initialState),
    }),
    {
      name: 'tamagotchi-store', // localStorage key
      partialize: (state) => ({
        // Only persist certain parts of the state
        player: state.player,
        liveBeast: state.liveBeast, // 🔥 NEW: Only persist live beast data
        foods: state.foods,
        highestScores: state.highestScores,
        isConnected: state.isConnected,
      }),
    }
  )
);

export default useAppStore;