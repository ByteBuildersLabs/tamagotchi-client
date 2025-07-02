import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { FoodItem, DragState } from '../../../../types/feed.types';
import initialFoodItems, { DROP_TOLERANCE, BEAST_DROP_ZONE_ID, FOOD_UI_CONFIG } from '../../../../../constants/feed.constants';

export const useFeedLogic = () => {
  const [foods, setFoods] = useState<FoodItem[]>(
    initialFoodItems.map(item => ({
      id: item.id,
      name: item.name,
      icon: item.img,  
      count: item.count,
      hungerRestore: 20,
      color: FOOD_UI_CONFIG.FOOD_COLORS[item.id] || '#6B7280'
    }))
);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedFood: null,
    portalPosition: { x: 0, y: 0 }
  });
  
  const draggedFoodRef = useRef<FoodItem | null>(null);

  const updateFoodCount = (foodId: number) => {
    setFoods(prevFoods =>
      prevFoods.map(food =>
        food.id === foodId && food.count > 0
          ? { ...food, count: food.count - 1 }
          : food
      )
    );
  };

  const handleDragStart = (food: FoodItem) => {
    if (food.count <= 0) return;
    
    setDragState(prev => ({
      ...prev,
      isDragging: true,
      draggedFood: food
    }));
    draggedFoodRef.current = food;
  };

  const handleDrag = (_: any, info: any) => {
    setDragState(prev => ({
      ...prev,
      portalPosition: { x: info.point.x - 24, y: info.point.y - 24 }
    }));
  };

  const handleDragEnd = (_event: any, info: any) => {
    setDragState(prev => ({ ...prev, isDragging: false }));

    const currentDraggedFood = draggedFoodRef.current;
    const beastElement = document.getElementById(BEAST_DROP_ZONE_ID);

    if (!beastElement || !currentDraggedFood) {
      resetDragState();
      return;
    }

    const beastRect = beastElement.getBoundingClientRect();
    const dropX = info.point.x;
    const dropY = info.point.y;
    const beastCenterX = beastRect.left + beastRect.width / 2;
    const beastCenterY = beastRect.top + beastRect.height / 2;

    const distance = Math.sqrt(
      Math.pow(dropX - beastCenterX, 2) + Math.pow(dropY - beastCenterY, 2)
    );

    if (distance < DROP_TOLERANCE && currentDraggedFood.count > 0) {
      handleSuccessfulFeed(currentDraggedFood);
    } else {
      handleFailedFeed();
    }

    resetDragState();
  };

  const handleSuccessfulFeed = (food: FoodItem) => {
    updateFoodCount(food.id);
    toast.success(`🎉 Beast fed with ${food.name}!`, {
      duration: 3000,
      position: 'top-center',
      style: {
        background: food.color,
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '16px',
        zIndex: 99999,
      },
      iconTheme: {
        primary: 'white',
        secondary: food.color,
      },
    });
  };

  const handleFailedFeed = () => {
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
  };

  const resetDragState = () => {
    setDragState(prev => ({ ...prev, draggedFood: null }));
    draggedFoodRef.current = null;
  };

  return {
    foods,
    dragState,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  };
};

// hooks/usePortal.ts
export const usePortal = () => {
  const portalRoot = useRef<HTMLDivElement | null>(null);

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

  return portalRoot;
};