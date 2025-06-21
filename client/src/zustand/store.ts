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

// App State Interface
interface AppStore {
  // Player state
  player: Player | null;
  
  // Beast state
  beasts: Beast[];
  currentBeast: Beast | null;
  
  // Beast status state (separate from Beast for live stats)
  beastStatuses: BeastStatus[];
  currentBeastStatus: BeastStatus | null;
  
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
  
  // Beast actions
  setBeasts: (beasts: Beast[]) => void;
  addBeast: (beast: Beast) => void;
  setCurrentBeast: (beast: Beast | null) => void;
  
  // Beast status actions
  setBeastStatuses: (beastStatuses: BeastStatus[]) => void;
  setCurrentBeastStatus: (beastStatus: BeastStatus | null) => void;
  updateBeastStatus: (player: string, beast_id: number, statusUpdate: Partial<BeastStatus>) => void;
  
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
}

// Initial state
const initialState = {
  player: null,
  beasts: [],
  currentBeast: null,
  beastStatuses: [],
  currentBeastStatus: null,
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
    (set) => ({
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
      
      // Beast actions
      setBeasts: (beasts) => set({ beasts }),
      
      addBeast: (beast) => set((state) => ({
        beasts: [...state.beasts, beast]
      })),
      
      setCurrentBeast: (beast) => set({ currentBeast: beast }),
      
      // Beast status actions (for live stats like hunger, energy, etc.)
      setBeastStatuses: (beastStatuses) => set({ beastStatuses }),
      
      setCurrentBeastStatus: (beastStatus) => set({ currentBeastStatus: beastStatus }),
      
      updateBeastStatus: (player, beast_id, statusUpdate) => set((state) => ({
        beastStatuses: state.beastStatuses.map(status => 
          status.player === player && status.beast_id === beast_id 
            ? { ...status, ...statusUpdate } 
            : status
        ),
        currentBeastStatus: 
          state.currentBeastStatus?.player === player && 
          state.currentBeastStatus?.beast_id === beast_id
            ? { ...state.currentBeastStatus, ...statusUpdate }
            : state.currentBeastStatus
      })),
      
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
      
      // Utility actions
      resetStore: () => set(initialState),
    }),
    {
      name: 'tamagotchi-store', // localStorage key
      partialize: (state) => ({
        // Only persist certain parts of the state
        player: state.player,
        beasts: state.beasts,
        currentBeast: state.currentBeast,
        beastStatuses: state.beastStatuses,
        currentBeastStatus: state.currentBeastStatus,
        foods: state.foods,
        highestScores: state.highestScores,
        isConnected: state.isConnected,
      }),
    }
  )
);

export default useAppStore;