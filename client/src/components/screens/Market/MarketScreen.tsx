import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

// Layout components
import { TamagotchiTopBar } from "../../layout/TopBar";

// Shared components
import BackButton from "../../shared/BackButton";

// Background components
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";

// Market components
import { FoodCategorySection } from "./components/FoodCategorySection";
import { FoodPurchaseAnimation } from "./components/FoodPurchaseAnimation";
import { FoodInsufficientBalanceAnimation } from "./components/FoodInsufficientBalanceAnimation";

// Constants and types
import { 
  FOOD_MARKET_DATA, 
  CATEGORY_DISPLAY_ORDER,
  MarketFoodItem,
  FoodCategory,
} from "../../../constants/foodMarket.constants";

// Assets
import sellertIcon from "../../../assets/icons/market/GolemSellerV2.webp"; 

// Screen props
import type { Screen } from "../../types/screens";

interface MarketScreenProps {
  onNavigation: (screen: Screen) => void;
}

// Helper function to truncate hash
const truncateHash = (hash: string, startLength = 6, endLength = 4) => {
  if (!hash) return '';
  if (hash.length <= startLength + endLength) return hash;
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
};

export function MarketScreen({onNavigation}: MarketScreenProps) {
  // Hardcoded balance for development
  const HARDCODED_BALANCE = 1000;
  
  // Market state
  const [selectedFood, setSelectedFood] = useState<MarketFoodItem | null>(null);
  const [showPurchaseAnimation, setShowPurchaseAnimation] = useState(false);
  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  
  // Transaction state (simulated)
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<'PENDING' | 'SUCCESS' | 'REJECTED' | null>(null);

  // Responsive design
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toast position based on screen size
  const position = isMobile ? 'bottom-center' : 'top-right';

  // Static food data - no inventory integration
  const marketFoods: MarketFoodItem[] = useMemo(() => {
    return Object.values(FOOD_MARKET_DATA).map(foodData => ({
      ...foodData,
      owned: false, // Always false since we're not checking inventory
      ownedAmount: 0 // Always 0
    }));
  }, []);

  // Group foods by category
  const foodsByCategory = useMemo(() => {
    const grouped: Record<FoodCategory, MarketFoodItem[]> = {
      fruits: [],
      vegetables: [],
      meats: [],
      sweets: [],
      fast_food: []
    };

    marketFoods.forEach(food => {
      grouped[food.category].push(food);
    });

    // Sort each category by price (ascending)
    Object.keys(grouped).forEach(category => {
      grouped[category as FoodCategory].sort((a, b) => a.price - b.price);
    });

    return grouped;
  }, [marketFoods]);

  // Handle food purchase - simplified
  const handlePurchase = async (food: MarketFoodItem) => {
    // Check hardcoded balance
    if (HARDCODED_BALANCE < food.price) {
      setSelectedFood(food);
      setShowInsufficientBalance(true);
      return;
    }

    // Simulate purchase process
    try {
      setIsProcessing(true);
      setTxStatus('PENDING');
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      setTxHash("0x" + Math.random().toString(16).substr(2, 8));
      setTxStatus('SUCCESS');
      
      // Show success animation
      setSelectedFood(food);
      setShowPurchaseAnimation(true);
      
      // Show success toast
      toast.success(`${food.name} purchased successfully!`, { position });
      
    } catch (error) {
      console.error("Purchase error:", error);
      setTxStatus('REJECTED');
      toast.error("Purchase failed", { position });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseAnimation = () => {
    setShowPurchaseAnimation(false);
    setShowInsufficientBalance(false);
    setSelectedFood(null);
  };

  // Transaction toast effects
  useEffect(() => {
    if (txHash) {
      toast(
        <span className="text-dark font-luckiest">
          Tx {txStatus}: {truncateHash(txHash)}
          <br />
          <a
            href={`https://sepolia.starkscan.co/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View on StarkScan
          </a>
        </span>,
        { id: 'tx-toast', position }
      );

      if (txStatus === 'SUCCESS') {
        toast.success('Purchase successful!', {
          id: 'success-toast',
          position,
          duration: 2000,
        });
      }

      if (txStatus === 'REJECTED') {
        toast.error('Transaction failed', {
          id: 'tx-error-toast',
          position,
          duration: 3000,
        });
      }
    }
  }, [txHash, txStatus, position]);

  return (
    <div className="relative h-screen w-full bg-screen overflow-hidden font-rubik">
      <MagicalSparkleParticles />

      {/* Back Button */}
      <BackButton onClick={() => onNavigation("home")} 
        className="top-12 right-4 left-auto"
      />
      
      {/* Top Bar */}
      <TamagotchiTopBar 
              coins={HARDCODED_BALANCE}
              onCoinsShopClick={() => console.log("Coins shop clicked")} gems={0}      />

      {/* Animated banner */}
      <motion.div
        className="relative mt-12 mb-3"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Animated Chef Icon */}
        <motion.div
          className="absolute -top-11 left-3 z-10 w-40 h-40"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          <img 
            src={sellertIcon}
            alt="Chef"
            className="object-contain"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement
              img.src = "/placeholder.svg?height=80&width=80"
            }}
          />
        </motion.div>

        {/* Banner */}
        <div className="bg-gold-gradient py-3 px-4 pl-40 relative rounded-[10px] mx-4 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <h2 className="font-luckiest text-cream text-xl drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] tracking-wide">
              🍽️ Food Market
            </h2>
            <p className="font-luckiest text-cream text-sm opacity-90 mt-1 sm:mt-0">
              Feed your Tamagotchi with delicious treats!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 h-[calc(100%-16rem)] overflow-y-auto pb-16">
        <div className="px-4 py-2">
          <div className="space-y-8">
            {CATEGORY_DISPLAY_ORDER.map(category => {
              const categoryFoods = foodsByCategory[category];
              if (categoryFoods.length === 0) return null;

              return (
                <FoodCategorySection
                  key={category}
                  category={category}
                  foods={categoryFoods}
                  onPurchase={handlePurchase}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Animations */}
      {selectedFood && (
        <>
          {showPurchaseAnimation && (
            <FoodPurchaseAnimation
              food={selectedFood}
              onClose={handleCloseAnimation}
            />
          )}
          {showInsufficientBalance && (
            <FoodInsufficientBalanceAnimation
              food={selectedFood}
              currentBalance={HARDCODED_BALANCE}
              onClose={handleCloseAnimation}
            />
          )}
        </>
      )}

      {/* Loading indicator for transaction */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-surface p-6 rounded-xl shadow-lg">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-luckiest text-text-primary">Processing Purchase...</p>
            </div>
          </div>
        </div>
      )}

      <Toaster
        position={position}
        toastOptions={{
          className: 'font-luckiest bg-cream text-dark border border-dark rounded-[5px] shadow-lg p-4',
          error: { duration: 3000 },
          success: { duration: 3000 }
        }}
      />
    </div>
  );
}

export default MarketScreen;