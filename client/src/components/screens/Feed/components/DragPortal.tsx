import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { DragPortalProps } from '../../../types/feed.types';

export const DragPortal = ({
  isDragging,
  draggedFood,
  portalPosition,
  portalRoot
}: DragPortalProps) => {
  if (!isDragging || !draggedFood || !portalRoot) {
    return null;
  }

  return createPortal(
    <motion.img
      src={draggedFood.icon}
      alt={draggedFood.name}
      className="w-12 h-12 object-contain pointer-events-none"
      style={{
        position: "fixed",
        left: portalPosition.x,
        top: portalPosition.y,
        zIndex: 99999,
      }}
      initial={{ scale: 1 }}
      animate={{ scale: 1.3, rotate: 10 }}
      transition={{ type: "spring" as const, stiffness: 500, damping: 30 }}
    />,
    portalRoot
  );
};