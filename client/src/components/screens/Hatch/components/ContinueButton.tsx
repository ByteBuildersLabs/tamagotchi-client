import { motion } from "framer-motion";

interface ContinueButtonProps {
  onContinue: () => void;
}

export const ContinueButton = ({ onContinue }: ContinueButtonProps) => {
  // Continue button animation
  const buttonAnimation = {
    initial: { opacity: 0, y: 50, scale: 0.8 },
    animate: {
      opacity: 1,
      y: [0, -5, 0],
      scale: 1,
      transition: {
        delay: 0.5,
        duration: 0.8,
        ease: "easeOut" as const,
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
        y: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut" as const
        }
      }
    }
  };

  const buttonInteractionProps = {
    whileHover: {
      scale: 1.1,
      y: -8,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 15
      }
    },
    whileTap: {
      scale: 0.95,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 20
      }
    },
  };

  return (
    <motion.button
      onClick={onContinue}
      className="btn-cr-yellow text-xl sm:text-2xl px-8 py-4 focus:outline-none active:scale-90"
      {...buttonAnimation}
      {...buttonInteractionProps}
      aria-label="Continue to meet your beast"
    >
      START ADVENTURE
    </motion.button>
  );
};