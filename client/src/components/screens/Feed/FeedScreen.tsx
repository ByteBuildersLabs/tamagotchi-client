import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import toast, { Toaster } from "react-hot-toast";
import { createPortal } from "react-dom";
import { TamagotchiTopBar } from "../../layout/TopBar";
import MagicalSparkleParticles from "../../shared/MagicalSparkleParticles";

// Assets imports
import forestBackground from "../../../assets/backgrounds/bg-home.png";
import babyWolfBeast from "../../../assets/beasts/baby-wolf.png";
import appleIcon from "../../../assets/Food/apple.svg";
import meatIcon from "../../../assets/Food/meat.svg";
import cherryIcon from "../../../assets/Food/cherry.svg";
import cakeIcon from "../../../assets/Food/cake.svg";
import potatoIcon from "../../../assets/Food/potato.svg";

type Screen = "login" | "cover" | "home" | "sleep" | "feed" | "clean" | "play";

interface FeedScreenProps {
  onNavigation: (screen: Screen) => void;
}

interface FoodItem {
  id: string;
  name: string;
  icon: string;
  count: number;
  hungerRestore: number;
  color: string;
}

export const FeedScreen = ({ onNavigation: _ }: FeedScreenProps) => {
  // Food inventory state
  const [foods, setFoods] = useState<FoodItem[]>([
    { id: "apple", name: "Apple", icon: appleIcon, count: 5, hungerRestore: 20, color: "#10B981" },
    { id: "meat", name: "Meat", icon: meatIcon, count: 3, hungerRestore: 40, color: "#EF4444" },
    { id: "cherry", name: "Cherry", icon: cherryIcon, count: 8, hungerRestore: 15, color: "#EC4899" },
    { id: "cake", name: "Cake", icon: cakeIcon, count: 2, hungerRestore: 60, color: "#F59E0B" },
    { id: "potato", name: "Potato", icon: potatoIcon, count: 4, hungerRestore: 25, color: "#8B5CF6" }
  ]);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const [draggedFood, setDraggedFood] = useState<FoodItem | null>(null);
  const [portalPosition, setPortalPosition] = useState({ x: 0, y: 0 });

  // Refs
  const constraintsRef = useRef(null);
  const sliderRef = useRef<Slider>(null);
  const portalRoot = useRef<HTMLDivElement | null>(null);
  const draggedFoodRef = useRef<FoodItem | null>(null);

  // Create portal for dragged element with supreme z-index
  useEffect(() => {
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.top = "0";
    div.style.left = "0";
    div.style.pointerEvents = "none";
    div.style.zIndex = "99999";
    document.body.appendChild(div);
    portalRoot.current = div;

    return () => {
      if (portalRoot.current && document.body.contains(portalRoot.current)) {
        document.body.removeChild(portalRoot.current);
      }
    };
  }, []);

  // Carousel settings - always show 3 items, better spacing on larger screens
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    centerMode: false,
    centerPadding: "0px",
    arrows: false,
    autoplay: false,
    dotsClass: "slick-dots custom-dots",
    touchMove: !isDragging,
    swipe: !isDragging,
    draggable: !isDragging,
  };

  // Navigation functions
  const goToPrevious = () => {
    sliderRef.current?.slickPrev();
  };

  const goToNext = () => {
    sliderRef.current?.slickNext();
  };

  // Update food count when feeding beast
  const updateFoodCount = (foodId: string) => {
    setFoods(prevFoods =>
      prevFoods.map(food =>
        food.id === foodId && food.count > 0
          ? { ...food, count: food.count - 1 }
          : food
      )
    );
  };

  // Drag event handlers
  const handleDragStart = (food: FoodItem) => {
    if (food.count <= 0) return;
    setIsDragging(true);
    setDraggedFood(food);
    draggedFoodRef.current = food;
  };

  const handleDrag = (_: any, info: any) => {
    setPortalPosition({ x: info.point.x - 24, y: info.point.y - 24 });
  };

  const handleDragEnd = (_event: any, info: any) => {
    setIsDragging(false);

    const currentDraggedFood = draggedFoodRef.current;
    const beastElement = document.getElementById('beast-drop-zone');

    if (!beastElement || !currentDraggedFood) {
      setDraggedFood(null);
      draggedFoodRef.current = null;
      return;
    }

    const beastRect = beastElement.getBoundingClientRect();
    const dropX = info.point.x;
    const dropY = info.point.y;
    const tolerance = 150;
    const beastCenterX = beastRect.left + beastRect.width / 2;
    const beastCenterY = beastRect.top + beastRect.height / 2;

    const distance = Math.sqrt(
      Math.pow(dropX - beastCenterX, 2) + Math.pow(dropY - beastCenterY, 2)
    );

    if (distance < tolerance && currentDraggedFood.count > 0) {
      // Success! Feed the beast
      updateFoodCount(currentDraggedFood.id);

      toast.success(`🎉 Beast fed with ${currentDraggedFood.name}!`, {
        duration: 3000,
        position: 'top-center',
        style: {
          background: currentDraggedFood.color,
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '16px',
          zIndex: 99999,
        },
        iconTheme: {
          primary: 'white',
          secondary: currentDraggedFood.color,
        },
      });
    } else {
      // Failed to drop on beast
      toast.error(`Drop food on your beast to feed it! 🎯`, {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '16px',
          zIndex: 99999,
        },
      });
    }

    // Clean up
    setDraggedFood(null);
    draggedFoodRef.current = null;
  };

  // Beast animations
  const beastAnimation = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: isDragging ? 1.1 : 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 12,
      },
    },
    whileHover: { scale: isDragging ? 1.15 : 1.05 },
  };

  return (
    <div
      ref={constraintsRef}
      className="relative min-h-screen w-full flex flex-col items-center overflow-hidden font-rubik"
      style={{
        backgroundImage: `url(${forestBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Toast Container */}
      <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 100000 }}>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              zIndex: 100001,
              fontSize: '16px',
              fontWeight: 'bold',
            },
          }}
        />
      </div>

      {/* Magical Sparkle Particles */}
      <MagicalSparkleParticles />

      {/* Top Bar */}
      <TamagotchiTopBar
        coins={1250}
        gems={45}
        status={{ energy: 85, hunger: 60, happiness: 30, hygiene: 75 }}
      />

      {/* Feed Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-4 z-10"
      >
        <h1 className="text-2xl md:text-3xl font-luckiest text-cream drop-shadow-lg">
          Feed Your Beast
        </h1>
      </motion.div>

      {/* Beast (Drop Zone) */}
      <div className="flex-grow flex items-center justify-center w-full relative" style={{ zIndex: 5 }}>
        <motion.div
          id="beast-drop-zone"
          className="relative"
        >
          <motion.img
            src={babyWolfBeast}
            alt="Tamagotchi Beast"
            className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-[280px] lg:w-[280px] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] relative"
            style={{ zIndex: 7 }}
            initial={beastAnimation.initial}
            animate={beastAnimation.animate}
            whileHover={beastAnimation.whileHover}
          />
        </motion.div>
      </div>

      {/* Food Carousel */}
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
            className="p-2 bg-cream/90 rounded-full shadow-lg z-40"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </motion.button>

          {/* Carousel Container - Maximum width for 3 items */}
          <div className="w-[22rem] h-28 max-w-[calc(100vw-120px)]">
            <Slider ref={sliderRef} {...sliderSettings}>
              {foods.map((food) => (
                <div key={food.id} className="px-0.5">
                  <div className="flex flex-col items-center justify-center">
                    {/* Food Container */}
                    <div className="relative flex flex-col items-center">
                      {/* Draggable Food Item */}
                      {(!isDragging || draggedFood?.id !== food.id) && (
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
                            handleDragStart(food);
                          }}
                          onDrag={(event, info) => {
                            event.stopPropagation();
                            handleDrag(event, info);
                          }}
                          onDragEnd={(event, info) => {
                            event.stopPropagation();
                            handleDragEnd(event, info);
                          }}
                          className={`h-12 w-12 object-contain relative ${food.count > 0
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
                            zIndex: isDragging && draggedFood?.id === food.id ? 99999 : 'auto',
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
              ))}
            </Slider>
          </div>

          {/* Next Button */}
          <motion.button
            onClick={goToNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-cream/90 rounded-full shadow-lg z-40"
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </motion.button>
        </div>

        {/* Custom Carousel Dots Styling */}
        <style>{`
          .custom-dots {
            bottom: -25px !important;
          }
          .custom-dots li button:before {
            color: rgb(230, 220, 199) !important;
            opacity: 0.5 !important;
            font-size: 6px !important;
          }
          .custom-dots li.slick-active button:before {
            opacity: 1 !important;
            color: rgb(251, 191, 36) !important;
          }
        `}</style>
      </motion.div>

      {/* Portal for dragged element */}
      {isDragging && (draggedFood || draggedFoodRef.current) && portalRoot.current &&
        createPortal(
          <motion.img
            src={(draggedFood || draggedFoodRef.current)?.icon}
            alt={(draggedFood || draggedFoodRef.current)?.name}
            className="w-12 h-12 object-contain pointer-events-none"
            style={{
              position: "fixed",
              left: portalPosition.x,
              top: portalPosition.y,
              zIndex: 99999,
            }}
            initial={{ scale: 1 }}
            animate={{ scale: 1.3, rotate: 10 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />,
          portalRoot.current
        )
      }
    </div>
  );
};
