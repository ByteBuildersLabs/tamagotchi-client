// constants/foodMarket.constants.ts

// Import existing food assets from feed constants - NO DUPLICATES!
import { FOOD_ASSETS } from './feed.constants';

/**
 * Food categories for marketplace organization
 */
export type FoodCategory = 'fruits' | 'vegetables' | 'meats' | 'sweets' | 'fast_food';

/**
 * Market food item interface - extends base with market-specific data
 */
export interface MarketFoodItem {
  id: number;
  name: string;
  description: string;
  image: string;
  category: FoodCategory;
  price: number;
  healthiness: number; // 1-5 scale (1 = unhealthy/cheap, 5 = healthy/expensive)
  hungerRestore: number;
  owned: boolean; // Whether player has this food in inventory
  ownedAmount?: number; // How many player currently has
}

/**
 * Food market data - categorized and priced by healthiness
 * Pricing logic: Less healthy = cheaper, More healthy = expensive
 */
export const FOOD_MARKET_DATA: Record<number, Omit<MarketFoodItem, 'owned' | 'ownedAmount'>> = {
  // 🍎 FRUITS (Healthy = More Expensive)
  1: {
    id: 1,
    name: 'Apple',
    description: 'Fresh and crunchy, packed with vitamins and fiber',
    image: FOOD_ASSETS[1].img,
    category: 'fruits',
    healthiness: 5,
    hungerRestore: 25,
    price: 50, // Most expensive fruit
  },
  2: {
    id: 2,
    name: 'Banana',
    description: 'Rich in potassium and natural sugars for quick energy',
    image: FOOD_ASSETS[2].img,
    category: 'fruits',
    healthiness: 4,
    hungerRestore: 20,
    price: 40,
  },
  3: {
    id: 3,
    name: 'Cherry',
    description: 'Sweet and juicy, full of antioxidants',
    image: FOOD_ASSETS[3].img,
    category: 'fruits',
    healthiness: 4,
    hungerRestore: 15,
    price: 45,
  },
  12: {
    id: 12,
    name: 'Blueberry',
    description: 'Superfruit packed with antioxidants and vitamins',
    image: FOOD_ASSETS[12].img,
    category: 'fruits',
    healthiness: 5,
    hungerRestore: 20,
    price: 55, // Most expensive overall
  },

  // 🥬 VEGETABLES (Healthy = More Expensive)
  15: {
    id: 15,
    name: 'Corn',
    description: 'Sweet corn kernels, good source of fiber',
    image: FOOD_ASSETS[15].img,
    category: 'vegetables',
    healthiness: 4,
    hungerRestore: 30,
    price: 35,
  },
  16: {
    id: 16,
    name: 'Potato',
    description: 'Hearty and filling, rich in potassium',
    image: FOOD_ASSETS[16].img,
    category: 'vegetables',
    healthiness: 3,
    hungerRestore: 35,
    price: 25,
  },

  // 🥩 MEATS (Medium Health = Medium Price)
  8: {
    id: 8,
    name: 'Chicken',
    description: 'Lean protein, excellent for muscle development',
    image: FOOD_ASSETS[8].img,
    category: 'meats',
    healthiness: 4,
    hungerRestore: 45,
    price: 60,
  },
  10: {
    id: 10,
    name: 'Fish',
    description: 'Fresh catch, rich in omega-3 fatty acids',
    image: FOOD_ASSETS[10].img,
    category: 'meats',
    healthiness: 5,
    hungerRestore: 40,
    price: 70, // Most expensive meat
  },
  13: {
    id: 13,
    name: 'Beef',
    description: 'Premium red meat, high in protein and iron',
    image: FOOD_ASSETS[13].img,
    category: 'meats',
    healthiness: 3,
    hungerRestore: 50,
    price: 45,
  },
  9: {
    id: 9,
    name: 'Eggs',
    description: 'Farm fresh eggs, complete protein source',
    image: FOOD_ASSETS[9].img,
    category: 'meats',
    healthiness: 4,
    hungerRestore: 30,
    price: 30,
  },
  7: {
    id: 7,
    name: 'Cheese',
    description: 'Creamy cheese, good source of calcium',
    image: FOOD_ASSETS[7].img,
    category: 'meats', // Dairy fits here for simplicity
    healthiness: 3,
    hungerRestore: 25,
    price: 35,
  },

  // 🍰 SWEETS (Unhealthy = Cheaper)
  5: {
    id: 5,
    name: 'Chocolate Cake',
    description: 'Decadent chocolate treat, pure indulgence',
    image: FOOD_ASSETS[5].img,
    category: 'sweets',
    healthiness: 1,
    hungerRestore: 35,
    price: 15, // Cheapest sweet
  },
  6: {
    id: 6,
    name: 'Strawberry Cake',
    description: 'Sweet and fluffy, with strawberry flavor',
    image: FOOD_ASSETS[6].img,
    category: 'sweets',
    healthiness: 1,
    hungerRestore: 30,
    price: 18,
  },

  // 🍟 FAST FOOD (Unhealthy = Cheapest)
  4: {
    id: 4,
    name: 'Burger',
    description: 'Juicy burger, quick and satisfying',
    image: FOOD_ASSETS[4].img,
    category: 'fast_food',
    healthiness: 1,
    hungerRestore: 40,
    price: 10, // Cheapest overall
  },
  11: {
    id: 11,
    name: 'French Fries',
    description: 'Crispy golden fries, addictive and tasty',
    image: FOOD_ASSETS[11].img,
    category: 'fast_food',
    healthiness: 1,
    hungerRestore: 25,
    price: 12,
  },
  14: {
    id: 14,
    name: 'Pizza',
    description: 'Cheesy pizza slice, comfort food at its best',
    image: FOOD_ASSETS[14].img,
    category: 'fast_food',
    healthiness: 2,
    hungerRestore: 45,
    price: 20,
  },
};

/**
 * Category display configuration
 */
export const FOOD_CATEGORIES_CONFIG = {
  fruits: {
    name: 'Fruits',
    emoji: '🍎',
    description: 'Fresh and healthy, packed with vitamins',
    color: '#10B981', // Green
  },
  vegetables: {
    name: 'Vegetables',
    emoji: '🥬',
    description: 'Nutritious and wholesome',
    color: '#059669', // Dark green
  },
  meats: {
    name: 'Proteins',
    emoji: '🥩',
    description: 'High protein, builds strength',
    color: '#DC2626', // Red
  },
  sweets: {
    name: 'Sweets',
    emoji: '🍰',
    description: 'Indulgent treats for special occasions',
    color: '#EC4899', // Pink
  },
  fast_food: {
    name: 'Fast Food',
    emoji: '🍟',
    description: 'Quick and convenient, but not so healthy',
    color: '#F59E0B', // Orange
  },
} as const;

/**
 * Helper function to get foods by category
 */
export const getFoodsByCategory = (category: FoodCategory): Array<Omit<MarketFoodItem, 'owned' | 'ownedAmount'>> => {
  return Object.values(FOOD_MARKET_DATA).filter(food => food.category === category);
};

/**
 * Helper function to get food market data by ID
 */
export const getFoodMarketDataById = (id: number): Omit<MarketFoodItem, 'owned' | 'ownedAmount'> | undefined => {
  return FOOD_MARKET_DATA[id];
};

/**
 * Get category order for display (healthiest first)
 */
export const CATEGORY_DISPLAY_ORDER: FoodCategory[] = [
  'fruits',
  'vegetables', 
  'meats',
  'sweets',
  'fast_food'
];

export default FOOD_MARKET_DATA;