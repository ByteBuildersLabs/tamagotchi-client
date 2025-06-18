import flappyGameIcon from "../../../../../assets/icons/games/flappy.png";
import platformGameIcon from "../../../../../assets/icons/games/platform.png";
import { MiniGame } from "../../../../types/play.types";

export const MINI_GAMES: MiniGame[] = [
  {
    id: "flappy",
    title: "Flappy Beast",
    icon: flappyGameIcon,
    route: "/play/flappy"
  },
  {
    id: "platform",
    title: "Platform Jump",
    icon: platformGameIcon,
    route: "/play/platform"
  }
];