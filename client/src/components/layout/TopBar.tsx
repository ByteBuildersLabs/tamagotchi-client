import { motion } from "framer-motion";

// Assets - Coins and Gems
import coinIcon from "../../assets/icons/coins/icon-coin-single.webp";
import gemIcon from "../../assets/icons/gems/icon-gem-single.webp";

// Assets - Status Icons
import energyIcon from "../../assets/icons/tobBar/icon-energy.png";
import hungerIcon from "../../assets/icons/tobBar/icon-hungry.png";
import hygieneIcon from "../../assets/icons/tobBar/icon-clean.png";

// Assets - Happiness Icons (3 states)
import happyIcon from "../../assets/icons/tobBar/icon-happy.png";
import neutralIcon from "../../assets/icons/tobBar/icon-neutral.png";
import sadIcon from "../../assets/icons/tobBar/icon-sad.png";

// Internal components
import CircularProgressBar from "../utils/CircularProgressBar";

interface TamagotchiStatus {
    energy: number;    // 0-100
    hunger: number;    // 0-100  
    happiness: number; // 0-100
    hygiene: number;   // 0-100
}

interface TamagotchiTopBarProps {
    coins: number;
    gems: number;
    status: TamagotchiStatus;
}

export function TamagotchiTopBar({ coins, gems, status }: TamagotchiTopBarProps) {
    
    // Determine the happiness icon based on the value
    const getHappinessIcon = (happiness: number) => {
        if (happiness >= 70) return happyIcon;
        if (happiness >= 30) return neutralIcon;
        return sadIcon;
    };

    const statusItems = [
        { 
            icon: energyIcon, 
            value: status.energy, 
            label: "Energy",
            color: "#FFC107" // Golden yellow like lightning
        },
        { 
            icon: hungerIcon, 
            value: status.hunger, 
            label: "Hunger",
            color: "#E91E63" // Orange like fruit
        },
        { 
            icon: getHappinessIcon(status.happiness), 
            value: status.happiness, 
            label: "Happiness",
            color: "#FF8F00" // Pink/magenta for happiness
        },
        { 
            icon: hygieneIcon, 
            value: status.hygiene, 
            label: "Hygiene",
            color: "#0288D1" // Cyan blue like a water drop
        }
    ];

    return (
        <div className="relative z-10 w-full px-2 sm:px-4 py-2 sm:py-3">
            {/* First row: Coins and Gems */}
            <div className="flex items-center justify-between gap-2 sm:gap-4 mb-2 sm:mb-3">
                
                {/* Left Section - Coins */}
                <motion.div
                    className="flex items-center bg-gold-gradient px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-lg border-2 border-gold backdrop-blur-sm min-w-0 flex-shrink-0"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <img
                        src={coinIcon}
                        alt="Coins"
                        className="h-8 w-8 sm:h-8 sm:w-8 mr-1 sm:mr-2 flex-shrink-0"
                    />
                    <span className="text-white font-bold text-sm sm:text-lg truncate drop-shadow-md">
                        {coins >= 1000 ? `${(coins / 1000).toFixed(1)}k` : coins.toLocaleString()}
                    </span>
                </motion.div>

                {/* Right Section - Gems */}
                <motion.div
                    className="flex items-center bg-emerald-gradient px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-lg border-2 border-emerald backdrop-blur-sm min-w-0 flex-shrink-0"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <img
                        src={gemIcon}
                        alt="Gems"
                        className="h-8 w-8 sm:h-8 sm:w-8 mr-1 sm:mr-2 flex-shrink-0"
                    />
                    <span className="text-white font-bold text-sm sm:text-lg truncate drop-shadow-md">
                        {gems >= 1000 ? `${(gems / 1000).toFixed(1)}k` : gems.toLocaleString()}
                    </span>
                </motion.div>
            </div>

            {/* Second row: Tamagotchi Status - Centered */}
            <motion.div
                className="flex items-center justify-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex items-center space-x-2 sm:space-x-2 bg-cyan-gradient backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-xl border-2 border-cyan">
                    {statusItems.map((item, index) => (
                        <motion.div
                            key={item.label}
                            className="flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                        >
                            <div className="w-12 h-12 sm:w-12 sm:h-12">
                                <CircularProgressBar 
                                    progress={item.value} 
                                    pic={item.icon} 
                                    color={item.color} 
                                    name={item.label}
                                    size="lg"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}