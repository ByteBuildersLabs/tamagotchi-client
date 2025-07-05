import { motion } from "framer-motion";

// Assets - Coins and Gems
import coinIcon from "../../assets/icons/coins/icon-coin-single.webp";
import gemIcon from "../../assets/icons/gems/icon-gem-single.webp";

// Assets - Status Icons
import energyIcon from "../../assets/icons/tobBar/icon-energy.png";
import hungerIcon from "../../assets/icons/tobBar/icon-hungry.png";
import hygieneIcon from "../../assets/icons/tobBar/icon-clean.png";

// Assets - Plus Icon
import plusIcon from "../../assets/icons/tobBar/icon-plus.png";

// Assets - Happiness Icons (3 states)
import happyIcon from "../../assets/icons/tobBar/icon-happy.png";
import neutralIcon from "../../assets/icons/tobBar/icon-neutral.png";
import sadIcon from "../../assets/icons/tobBar/icon-sad.png";

// Internal components
import CircularProgressBar from "../utils/CircularProgressBar";

// Real-time status hook
import { useRealTimeStatus } from "../../dojo/hooks/useRealTimeStatus";

interface TamagotchiStatus {
  energy: number;    // 0-100
  hunger: number;    // 0-100  
  happiness: number; // 0-100
  hygiene: number;   // 0-100
}

interface TamagotchiTopBarProps {
  coins: number;
  gems: number;
  status?: TamagotchiStatus; 
  onCoinsShopClick?: () => void;
  onGemsShopClick?: () => void;
}

export function TamagotchiTopBar({ 
  coins, 
  gems, 
  status: fallbackStatus,
  onCoinsShopClick, 
  onGemsShopClick 
}: TamagotchiTopBarProps) {

  // Use real-time status hook
  const { statusForUI } = useRealTimeStatus();

  // Determine which status to use: real-time first, then fallback
  const currentStatus: TamagotchiStatus = statusForUI || fallbackStatus || {
    energy: 0,
    hunger: 0,
    happiness: 0,
    hygiene: 0,
  };

  const isAwake = statusForUI?.isAwake ?? true;

  // Determine happiness icon
  const getHappinessIcon = (happiness: number) => {
    if (happiness >= 70) return happyIcon;
    if (happiness >= 30) return neutralIcon;
    return sadIcon;
  };

  // 🆕 Color based on energy and sleep state
  const getEnergyColor = (energy: number, awake: boolean) => {
    if (!awake) return "#6B7280";           // Gray when sleeping
    if (energy >= 70) return "#FFC107";      // Yellow when high
    if (energy >= 30) return "#FF8F00";      // Orange medium
    return "#E91E63";                       // Red when low
  };

  const statusItems = [
    {
      icon: energyIcon,
      value: currentStatus.energy,
      label: "Energy",
      color: getEnergyColor(currentStatus.energy, isAwake),
    },
    {
      icon: hungerIcon,
      value: currentStatus.hunger,
      label: "Hunger",
      color: isAwake ? "#E91E63" : "#6B7280",
    },
    {
      icon: getHappinessIcon(currentStatus.happiness),
      value: currentStatus.happiness,
      label: "Happiness",
      color: isAwake ? "#FF8F00" : "#6B7280",
    },
    {
      icon: hygieneIcon,
      value: currentStatus.hygiene,
      label: "Hygiene",
      color: isAwake ? "#0288D1" : "#6B7280",
    }
  ];

  return (
    <div className="relative z-10 w-full px-2 py-2">
      <div className="flex items-center gap-1 sm:gap-2">

        {/* Left Section - Coins */}
        <motion.div
          className="flex items-center bg-black/50 pl-0.5 pr-0.5 py-1.5 rounded-lg shadow-md backdrop-blur-sm flex-shrink-0"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={onCoinsShopClick}
            className="mr-0.5 flex items-center justify-center rounded-full h-8 w-8 sm:h-6 sm:w-6 drop-shadow-sm transition-colors flex-shrink-0 p-0.5"
          >
            <img src={plusIcon} alt="Add coins" className="h-full w-full object-contain" />
          </button>
          <span className="text-white font-bold text-xs sm:text-sm truncate drop-shadow-md min-w-0 flex-1 text-center">
            {coins.toLocaleString()}
          </span>
          <img src={coinIcon} alt="Coins" className="h-8 w-8 sm:h-7 sm:w-7 ml-0.5 flex-shrink-0" />
        </motion.div>

        {/* Center Section - Status */}
        <motion.div
          className="flex items-center justify-center flex-1 min-w-0"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-center space-x-1 sm:space-x-1.5 bg-black/50 backdrop-blur-sm px-1.5 sm:px-2 py-1.5 rounded-lg shadow-md w-full max-w-[180px] sm:max-w-[220px] relative">
            {statusItems.map((item, idx) => (
              <motion.div
                key={item.label}
                className="flex items-center justify-center flex-shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8">
                  <CircularProgressBar
                    progress={item.value}
                    pic={item.icon}
                    color={item.color}
                    name={item.label}
                    size="sm"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Section - Gems */}
        <motion.div
          className="flex items-center bg-black/50 pl-0.5 pr-0.5 py-1.5 rounded-lg shadow-md backdrop-blur-sm flex-shrink-0"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={onGemsShopClick}
            className="mr-0.5 flex items-center justify-center rounded-full h-8 w-8 sm:h-6 sm:w-6 drop-shadow-sm transition-colors flex-shrink-0 p-0.5"
          >
            <img src={plusIcon} alt="Add gems" className="h-full w-full object-contain" />
          </button>
          <span className="text-white font-bold text-xs sm:text-sm truncate drop-shadow-md min-w-0 flex-1 text-center">
            {gems.toLocaleString()}
          </span>
          <img src={gemIcon} alt="Gems" className="h-8 w-8 sm:h-7 sm:w-7 ml-0.5 flex-shrink-0" />
        </motion.div>
      </div>
    </div>
  );
}
