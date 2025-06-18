import { useRef } from "react";
import Slider from "react-slick";
import { MiniGame } from "../../../../types/play.types";
import { GAME_SLIDER_SETTINGS } from "../config/carousel.config";

export const useGameCarousel = (games: MiniGame[]) => {
  const sliderRef = useRef<Slider>(null);

  const sliderSettings = {
    ...GAME_SLIDER_SETTINGS,
    infinite: games.length > 1
  };

  const goToPrevious = () => {
    sliderRef.current?.slickPrev();
  };

  const goToNext = () => {
    sliderRef.current?.slickNext();
  };

  return {
    sliderRef,
    sliderSettings,
    goToPrevious,
    goToNext,
    hasMultipleGames: games.length > 1
  };
};