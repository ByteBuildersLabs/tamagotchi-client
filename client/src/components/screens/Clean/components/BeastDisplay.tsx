import { motion } from "framer-motion";
import { DragonDisplay } from "../../../shared/DragonDisplay";

const beastAnimation = {
  initial: { scale: 0.3, opacity: 0, rotate: -15 },
  animate: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      delay: 0.6,
      scale: { delay: 0.6, duration: 0.5 },
      opacity: { delay: 0.6, duration: 0.4 },
    },
  },
  whileHover: { scale: 1.03, rotate: 2 },
};

export const BeastDisplay = () => {
  return (
    <motion.div
      className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px] pointer-events-auto"
      initial={beastAnimation.initial}
      animate={beastAnimation.animate}
      whileHover={beastAnimation.whileHover}
    >
      <DragonDisplay 
        className="w-full h-full"
        scale={0.5}
        position={[0, 0, 0]}
        animationSpeed={1}
        autoRotateSpeed={0.3} // Slower rotation for calm cleaning environment
        lighting="dim" // Softer lighting for clean screen atmosphere
      />
    </motion.div>
  );
};