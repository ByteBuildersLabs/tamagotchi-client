import { motion } from "framer-motion";
import { FoodItemProps } from '../../../types/feed.types';

export const FoodItem = ({
  food,
  isDragging,
  draggedFood,
  onDragStart,
  onDrag,
  onDragEnd
}: FoodItemProps) => {
  const isCurrentFoodDragged = isDragging && draggedFood?.id === food.id;

  return (
    <div className="px-0.5">
      <div className="flex flex-col items-center justify-center">
        <div className="relative flex flex-col items-center">
          {/* Draggable Food Item */}
          {!isCurrentFoodDragged && (
            <motion.img
              key={`${food.id}-${food.count}-drag`}
              src={food.icon}
              alt={food.name}
              drag={food.count > 0}
              dragConstraints={false}
              dragElastic={0}
              dragMomentum={false}
              dragSnapToOrigin={true}
              dragPropagation={false}
              onDragStart={(event) => {
                event.stopPropagation();
                onDragStart(food);
              }}
              onDrag={(event, info) => {
                event.stopPropagation();
                onDrag(event, info);
              }}
              onDragEnd={(event, info) => {
                event.stopPropagation();
                onDragEnd(event, info);
              }}
              className={`h-12 w-12 object-contain relative ${
                food.count > 0
                  ? 'cursor-grab active:cursor-grabbing'
                  : 'cursor-not-allowed opacity-50'
              }`}
              initial={{ scale: 0, rotate: -180, x: 0, y: 0 }}
              animate={{
                scale: 1,
                rotate: 0,
                x: 0,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1
                }
              }}
              whileHover={food.count > 0 ? { scale: 1.2, rotate: 5 } : {}}
              whileTap={food.count > 0 ? { scale: 0.9 } : {}}
              whileDrag={{ scale: 1.3, rotate: 10, zIndex: 99999 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
              style={{
                position: 'relative',
                zIndex: isCurrentFoodDragged ? 99999 : 'auto',
                pointerEvents: food.count > 0 ? 'auto' : 'none'
              }}
            />
          )}

          {/* Count Badge */}
          <div
            className="mt-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
            style={{ backgroundColor: food.color }}
          >
            {food.count}
          </div>
        </div>

        {/* Food Name */}
        <div className="mt-1 text-center pointer-events-none">
          <p className="text-xs font-rubik font-semibold text-cream drop-shadow-sm">
            {food.name}
          </p>
        </div>
      </div>
    </div>
  );
};