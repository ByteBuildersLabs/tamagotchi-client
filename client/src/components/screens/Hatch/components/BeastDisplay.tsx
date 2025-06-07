import { motion } from "framer-motion";

interface BeastDisplayProps {
  beastAsset: string;
  beastType: string;
}

export const BeastDisplay = ({ beastAsset, beastType }: BeastDisplayProps) => {
  // Beast animation
  const beastAnimation = {
    initial: { scale: 0.3, opacity: 0, rotate: -10, y: 30 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2,
        duration: 0.8
      }
    },
    whileInView: {
      scale: [1, 1.02, 1],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="relative"
      {...beastAnimation}
    >
      <img
        src={beastAsset}
        alt={`Baby ${beastType}`}
        className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)] select-none"
      />

      {/* Magical aura around the beast */}
      <div className="absolute inset-0 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full bg-emerald/30 animate-pulse blur-xl -z-10" />
      <div className="absolute inset-0 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full bg-gold/20 animate-pulse blur-2xl -z-10" />
    </motion.div>
  );
};