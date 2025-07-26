import { motion } from "framer-motion";
import { CampfireControllerProps } from "../../../types/sleep.types";

const campFireAnimation = {
  initial: { scale: 0.3, opacity: 0, rotate: -15 },
  animate: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10,
      delay: 0.6,
      opacity: { delay: 0.6, duration: 0.4 },
      rotate: { delay: 0.6, duration: 0.5 },
    },
  },
  whileHover: { scale: 1.03, rotate: 2 },
};

const trunkAnimation = {
  initial: { scale: 0.3, opacity: 0, rotate: -15 },
  animate: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10,
      delay: 0.6,
      scale: { delay: 0.6, duration: 0.5 },
      opacity: { delay: 0.6, duration: 0.4 },
    },
  },
  whileHover: { scale: 1.03, rotate: 2 },
};

export const CampfireController = ({
  isCampfireOn,
  onCampfireClick,
  litFrames,
  extinguishedFrames,
  litFrameIndex,
  extinguishedFrameIndex,
  trunkImage
}: CampfireControllerProps) => {
  return (
    <div className="relative h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px] pointer-events-auto flex flex-col items-center justify-end">
      {/* Trunk (base layer) */}
      <motion.img
        src={trunkImage}
        alt="Campfire Trunk"
        className="absolute bottom-0 h-1/2 w-2/3 sm:h-3/5 sm:w-3/4 md:h-2/3 md:w-4/5 lg:h-3/4 lg:w-5/6 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] z-10 cursor-pointer"
        initial={trunkAnimation.initial}
        animate={trunkAnimation.animate}
        whileHover={trunkAnimation.whileHover}
        whileTap={{ scale: 0.95 }}
        onClick={onCampfireClick}
      />

      {/* Fire/Smoke Animation (on top of trunk) */}
      <motion.img
        src={isCampfireOn ? litFrames[litFrameIndex] : extinguishedFrames[extinguishedFrameIndex]}
        alt="Camp Fire"
        className="absolute bottom-[20%] h-3/4 w-3/4 sm:h-4/5 sm:w-4/5 md:h-full md:w-full object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] z-20 cursor-pointer"
        initial={campFireAnimation.initial}
        animate={campFireAnimation.animate}
        whileHover={campFireAnimation.whileHover}
        whileTap={{ scale: 0.95 }}
        onClick={onCampfireClick}
      />
    </div>
  );
};