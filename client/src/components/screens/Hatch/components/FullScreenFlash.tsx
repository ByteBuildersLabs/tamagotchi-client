import { motion } from "framer-motion";

export const FullScreenFlash = () => {
  // Full-Screen Flash Animation
  const fullScreenFlashAnimation = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 1, 1, 0],
      transition: {
        times: [0, 0.1, 0.9, 1], // Fast flash, hold, slow fade out
        duration: 2.5,
        ease: "easeInOut" as const
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className="absolute inset-0 z-40 pointer-events-none"
      style={{
        backgroundColor: 'rgba(255, 255, 240, 0.95)' // Bright blackout
      }}
      {...fullScreenFlashAnimation}
      key="mega-flash-effect"
    />
  );
};