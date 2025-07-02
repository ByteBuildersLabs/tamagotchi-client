import { motion } from "framer-motion";
import { FOOD_UI_CONFIG } from '../../../../constants/feed.constants';

// Fallback image for when beast image is not available
import babyWolfBeast from "../../../../assets/beasts/baby-wolf.png";

// Props interface for Beast component
interface BeastAnimationProps {
  isDragging: boolean;
  beastImage?: string;
  beastName?: string;
}

/**
 * Beast component that displays the player's beast and acts as a drop zone for food items
 * Receives beast data as props to avoid multiple hook consumptions
 */
export const Beast = ({ isDragging, beastImage, beastName }: BeastAnimationProps) => {
  // Animation configuration for the beast
  const beastAnimation = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: isDragging ? 1.1 : 1, // Scale up when food is being dragged
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 12,
      },
    },
    whileHover: { scale: isDragging ? 1.15 : 1.05 }, // Slight scale on hover
  };

  // Use provided beast image or fallback to default
  const finalBeastImage = beastImage || babyWolfBeast;
  const finalBeastAltText = beastName || "Tamagotchi Beast";

  return (
    <div className="flex-grow flex items-center justify-center w-full relative" style={{ zIndex: 5 }}>
      <motion.div
        id={FOOD_UI_CONFIG.BEAST_DROP_ZONE_ID} // ID used for drop detection in feeding logic
        className="relative"
      >
        <motion.img
          src={finalBeastImage}
          alt={finalBeastAltText}
          className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] relative"
          style={{ zIndex: 7 }}
          initial={beastAnimation.initial}
          animate={beastAnimation.animate}
          whileHover={beastAnimation.whileHover}
        />
      </motion.div>
    </div>
  );
};