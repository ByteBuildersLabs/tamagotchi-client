import { motion } from "framer-motion"
import coinIcon from "../../../../assets/icons/coins/icon-coin-single.webp"

// Types
import { MarketFoodItem } from "../../../../constants/foodMarket.constants";

interface FoodCardProps {
  food: MarketFoodItem
  onPurchase: () => void
}

/**
 * Individual food card component for the marketplace
 * Displays food info, price, and purchase button
 * UPDATED: Uses correct coin icon path from your existing assets
 */
export function FoodCard({ food, onPurchase }: FoodCardProps) {
  // Healthiness level colors
  const healthinessColors: Record<number, string> = {
    1: "bg-red-500",      // Unhealthy
    2: "bg-orange-500",   // Poor
    3: "bg-yellow-500",   // Okay
    4: "bg-green-500",    // Good
    5: "bg-emerald-500",  // Excellent
  }
  const healthinessColor = healthinessColors[food.healthiness] || "bg-gray-500";

  // Healthiness level text
  const healthinessText: Record<number, string> = {
    1: "Unhealthy",
    2: "Poor",
    3: "Okay", 
    4: "Good",
    5: "Excellent",
  }
  const healthinessLabel = healthinessText[food.healthiness] || "Unknown";

  const item = {
    hidden: { y: 20, opacity: 0 },
    show:   { y: 0,  opacity: 1 },
  }

  return (
    <motion.div
      className="bg-surface p-4 rounded-xl shadow-md flex flex-col items-center"
      variants={item}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Food image - Using transform scale to enlarge it */}
      <div className="h-32 flex items-center justify-center mb-2 overflow-visible">
        <div className="transform scale-150">
          <img
            src={food.image || "/placeholder.svg"}
            alt={food.name}
            className="w-32 h-32 object-contain"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement
              img.src = "/placeholder.svg?height=128&width=128"
            }}
          />
        </div>
      </div>

      {/* Name */}
      <h3 className="font-luckiest text-lg text-primary mb-1 text-center">
        {food.name}
      </h3>

      {/* Healthiness badge */}
      <span
        className={`inline-block ${healthinessColor} text-white font-bold tracking-wide
          rounded-full px-2 py-0.5 text-sm mb-2`}
      >
        {healthinessLabel}
      </span>

      {/* Description */}
      <p className="font-luckiest text-sm text-text-primary mb-3 text-center h-12 overflow-hidden leading-tight">
        {food.description}
      </p>

      {/* Stats */}
      <div className="flex items-center justify-center gap-2 mb-3 text-xs">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-bold">
          +{food.hungerRestore} Hunger
        </span>
      </div>

      {/* Owned indicator or purchase button */}
      {food.owned && (food.ownedAmount || 0) > 0 ? (
        <div className="w-full">
          {/* Show owned amount */}
          <div className="bg-green-100 text-green-800 w-full flex items-center justify-center p-2 rounded-lg mb-2 font-bold">
            Owned: {food.ownedAmount}
          </div>
          {/* Still allow purchasing more */}
          <motion.button
            onClick={onPurchase}
            className="btn-cr-yellow w-full flex items-center justify-center gap-2"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <span>Buy More</span>
            <img src={coinIcon} alt="Coin" className="h-5 w-5" />
            <span>{food.price}</span>
          </motion.button>
        </div>
      ) : (
        <motion.button
          onClick={onPurchase}
          className="btn-cr-yellow w-full flex items-center justify-center gap-2"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <span>Buy</span>
          <img src={coinIcon} alt="Coin" className="h-5 w-5" />
          <span>{food.price}</span>
        </motion.button>
      )}
    </motion.div>
  )
}