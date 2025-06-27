import { motion } from "framer-motion";
import { BeastAnimationProps } from '../../../types/feed.types';
import { BEAST_DROP_ZONE_ID } from '../../../../constants/feed.constants';

// Universal hook for beast display
import { useBeastDisplay } from "../../../../dojo/hooks/useBeastDisplay";

// Fallback image
import babyWolfBeast from "../../../../assets/beasts/baby-wolf.png";

export const Beast = ({ isDragging }: BeastAnimationProps) => {
  // Universal hook to get the current beast
  const { currentBeastDisplay } = useBeastDisplay();

  const beastAnimation = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: isDragging ? 1.1 : 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 12,
      },
    },
    whileHover: { scale: isDragging ? 1.15 : 1.05 },
  };

  // Use the actual beast image or fallback
  const beastImage = currentBeastDisplay?.asset || babyWolfBeast;
  const beastAltText = currentBeastDisplay?.displayName || "Tamagotchi Beast";

  return (
    <div className="flex-grow flex items-center justify-center w-full relative" style={{ zIndex: 5 }}>
      <motion.div
        id={BEAST_DROP_ZONE_ID}
        className="relative"
      >
        <motion.img
          src={beastImage}
          alt={beastAltText}
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