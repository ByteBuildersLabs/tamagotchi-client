import appleIcon from "../assets/Food/apple.svg";
import meatIcon from "../assets/Food/meat.svg";
import cherryIcon from "../assets/Food/cherry.svg";
import cakeIcon from "../assets/Food/cake.svg";
import potatoIcon from "../assets/Food/potato.svg";
import { FoodItem } from '../components/types/feed.types';

export const INITIAL_FOODS: FoodItem[] = [
  { id: "apple", name: "Apple", icon: appleIcon, count: 5, hungerRestore: 20, color: "#10B981" },
  { id: "meat", name: "Meat", icon: meatIcon, count: 3, hungerRestore: 40, color: "#EF4444" },
  { id: "cherry", name: "Cherry", icon: cherryIcon, count: 8, hungerRestore: 15, color: "#EC4899" },
  { id: "cake", name: "Cake", icon: cakeIcon, count: 2, hungerRestore: 60, color: "#F59E0B" },
  { id: "potato", name: "Potato", icon: potatoIcon, count: 4, hungerRestore: 25, color: "#8B5CF6" }
];

export const SLIDER_SETTINGS = {
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
};

export const DROP_TOLERANCE = 150;
export const BEAST_DROP_ZONE_ID = 'beast-drop-zone';

export const CAROUSEL_STYLES = `
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
`;