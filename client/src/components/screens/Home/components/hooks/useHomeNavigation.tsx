import type { Screen } from "../../../../types/screens";

export const useHomeNavigation = (onNavigation: (screen: Screen) => void) => {
  const handleShopClick = () => {
    console.log("Shop clicked");
    onNavigation("market");
  };

  const handleDailyQuestsClick = () => {
    console.log("Daily Quests clicked");
    onNavigation("home");
  };

  const handleNavigateLogin = () => {
    console.log("Navigating to login");
    onNavigation("login");
  };

  return {
    handleShopClick,
    handleDailyQuestsClick,
    handleNavigateLogin
  };
};
