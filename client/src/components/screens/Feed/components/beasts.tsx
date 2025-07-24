import { motion } from "framer-motion";
import { FOOD_UI_CONFIG } from '../../../../constants/feed.constants';
import { DragonDisplay } from '../../../shared/DragonDisplay';

// Props interface for Beast component
interface BeastAnimationProps {
  isDragging: boolean;
  isFeeding?: boolean; 
  beastImage?: string;
  beastName?: string;
}

/**
 * Beast component that displays the player's dragon and acts as a drop zone for food items
 * Now using the reusable DragonDisplay component with feeding animations
 * Supports feeding animations and visual feedback
 */
export const Beast = ({ 
  isDragging, 
  isFeeding = false, // NEW: Default to false
  beastImage, 
  beastName 
}: BeastAnimationProps) => {
  
  // Enhanced animation configuration for the dragon container
  const dragonContainerAnimation = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: isDragging ? 1.1 : isFeeding ? 1.05 : 1, // Different scales for different states
      opacity: 1,
      rotate: isFeeding ? [0, -2, 2, -2, 0] : 0, // Gentle shake when feeding
      transition: {
        type: "spring",
        stiffness: isFeeding ? 200 : 150, // More responsive when feeding
        damping: isFeeding ? 15 : 12,
        rotate: isFeeding ? {
          repeat: Infinity,
          duration: 0.5,
          ease: "easeInOut"
        } : {}
      },
    },
    whileHover: { 
      scale: isDragging ? 1.15 : isFeeding ? 1.08 : 1.05 // Slight scale on hover
    },
  };

  return (
    <div className="flex-grow flex items-center justify-center w-full relative" style={{ zIndex: 5 }}>
      <motion.div
        id={FOOD_UI_CONFIG.BEAST_DROP_ZONE_ID} // ID used for drop detection in feeding logic
        className="relative"
        initial={dragonContainerAnimation.initial}
        animate={dragonContainerAnimation.animate}
        whileHover={dragonContainerAnimation.whileHover}
      >
        {/* Dragon Display with feeding effects */}
        <div className={`relative transition-all duration-300 ${
          isFeeding ? 'brightness-110 saturate-110' : '' // Brighten when feeding
        }`} style={{ zIndex: 7 }}>
          <DragonDisplay 
            className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px]"
            scale={0.5}
            position={[0, 0, 0]}
            animationSpeed={isFeeding ? 1.5 : 1} // Faster animation when feeding
            autoRotateSpeed={isFeeding ? 1.0 : 0.5} // Faster rotation when feeding
            lighting="bright"
            style={{
              filter: isFeeding ? 'brightness(1.3) saturate(1.1)' : 'brightness(1.2) saturate(1.05)',
              transition: 'filter 0.3s ease',
              overflow: 'visible'
            }}
          />
        </div>

        {/* Drag Target Indicator */}
        {isDragging && !isFeeding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 border-4 border-dashed border-yellow-400 rounded-full bg-yellow-400/10 backdrop-blur-sm flex items-center justify-center z-8"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-yellow-400 text-4xl font-bold drop-shadow-lg"
            >
              🎯
            </motion.div>
          </motion.div>
        )}

        {/* Feeding Effect Particles */}
        {isFeeding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-6"
          >
            {/* Happy feeding particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ 
                  x: "50%", 
                  y: "50%", 
                  scale: 0,
                  opacity: 0 
                }}
                animate={{ 
                  x: `${50 + (Math.random() - 0.5) * 100}%`, 
                  y: `${30 + (Math.random() - 0.5) * 60}%`,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                {['💖', '✨', '🍯', '😋', '💫', '🌟'][i]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};