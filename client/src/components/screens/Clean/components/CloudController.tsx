import { motion } from "framer-motion";
import { CloudControllerProps } from "../../../types/clean.types";

const cloudAnimation = {
  initial: { scale: 0.3, opacity: 0, rotate: -15 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: 1,
    rotate: 0,
    transition: {
      scale: {
        repeat: Infinity,
        repeatType: "loop" as const,
        duration: 1.5,
        ease: "easeInOut" as const,
        delay: 0.6,
      },
      opacity: { delay: 0.6, duration: 0.4 },
      rotate: { delay: 0.6, duration: 0.5 },
    },
  },
  whileHover: { scale: 1.03, rotate: 2 },
  whileTap: { scale: 0.95 },
};

export const CloudController = ({ 
  onCloudClick, 
  cloudFrames, 
  currentFrameIndex,
  disabled = false
}: CloudControllerProps) => {
  
  const handleClick = () => {
    if (!disabled) {
      onCloudClick();
    }
  };

  return (
    <motion.img
      src={cloudFrames[currentFrameIndex]}
      alt="Cloud Controller"
      className={`
        h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px] 
        object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] 
        pointer-events-auto transition-all duration-300
        ${disabled 
          ? 'cursor-not-allowed opacity-60 grayscale' 
          : 'cursor-pointer hover:brightness-110'
        }
      `}
      initial={cloudAnimation.initial}
      animate={{ 
        ...cloudAnimation.animate, 
        y: 10,
        // Add subtle disabled animation
        ...(disabled && {
          scale: 1,
          opacity: 0.6,
        })
      }}
      whileHover={disabled ? {} : cloudAnimation.whileHover}
      whileTap={disabled ? {} : cloudAnimation.whileTap}
      onClick={handleClick}
      style={{
        filter: disabled ? 'grayscale(0.5) brightness(0.8)' : 'none',
      }}
    />
  );
};