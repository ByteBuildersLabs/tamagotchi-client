import { useRef } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { FoodCarouselProps } from '../../../types/feed.types';
import { SLIDER_SETTINGS, CAROUSEL_STYLES } from '../../../../constants/feed.constants';
import { FoodItem } from './FoodItem';
import ArrowLeftIcon from '../../../../assets/icons/extras/icon-arrow-left.png';
import ArrowRightIcon from '../../../../assets/icons/extras/icon-arrow-right.png';

export const FoodCarousel = ({
  foods,
  isDragging,
  onDragStart,
  onDrag,
  onDragEnd
}: FoodCarouselProps) => {
  const sliderRef = useRef<Slider>(null);

  const sliderSettings = {
    ...SLIDER_SETTINGS,
    touchMove: !isDragging,
    swipe: !isDragging,
    draggable: !isDragging,
  };

  const goToPrevious = () => {
    sliderRef.current?.slickPrev();
  };

  const goToNext = () => {
    sliderRef.current?.slickNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="fixed bottom-[calc(theme(spacing.16)+0.5rem+env(safe-area-inset-bottom))] left-0 right-0 z-30"
    >
      <div className="flex items-center justify-center space-x-2 px-4">
        {/* Previous Button */}
        <motion.button
          onClick={goToPrevious}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 z-40 flex items-center justify-center"
        >
          <img 
            src={ArrowLeftIcon} 
            alt="Previous" 
            className="h-10 w-10"
          />
        </motion.button>

        {/* Carousel Container */}
        <div className="w-[22rem] h-28 max-w-[calc(100vw-120px)]">
          <Slider ref={sliderRef} {...sliderSettings}>
            {foods.map((food) => (
              <FoodItem
                key={food.id}
                food={food}
                isDragging={isDragging}
                draggedFood={null} // This should be passed from parent
                onDragStart={onDragStart}
                onDrag={onDrag}
                onDragEnd={onDragEnd}
              />
            ))}
          </Slider>
        </div>

        {/* Next Button */}
        <motion.button
          onClick={goToNext}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 z-40 flex items-center justify-center"
        >
          <img 
            src={ArrowRightIcon} 
            alt="Next" 
            className="h-10 w-10"
          />
        </motion.button>
      </div>

      {/* Custom Carousel Dots Styling */}
      <style>{CAROUSEL_STYLES}</style>
    </motion.div>
  );
};