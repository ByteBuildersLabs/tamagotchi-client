import type { Screen } from "../types/screens";

export interface FoodItem {
  id: string;
  name: string;
  icon: string;
  count: number;
  hungerRestore: number;
  color: string;
}

export interface FeedScreenProps {
  onNavigation: (screen: Screen) => void;
}

export interface DragState {
  isDragging: boolean;
  draggedFood: FoodItem | null;
  portalPosition: { x: number; y: number };
}

export interface BeastAnimationProps {
  isDragging: boolean;
}

export interface FoodCarouselProps {
  foods: FoodItem[];
  isDragging: boolean;
  onDragStart: (food: FoodItem) => void;
  onDrag: (event: any, info: any) => void;
  onDragEnd: (event: any, info: any) => void;
}

export interface FoodItemProps {
  food: FoodItem;
  isDragging: boolean;
  draggedFood: FoodItem | null;
  onDragStart: (food: FoodItem) => void;
  onDrag: (event: any, info: any) => void;
  onDragEnd: (event: any, info: any) => void;
}

export interface DragPortalProps {
  isDragging: boolean;
  draggedFood: FoodItem | null;
  portalPosition: { x: number; y: number };
  portalRoot: HTMLDivElement | null;
}