import { useState } from "react";

export const useCampfireState = () => {
  const [isCampfireOn, setIsCampfireOn] = useState(true);

  const toggleCampfire = () => {
    setIsCampfireOn(prev => !prev);
  };

  return {
    isCampfireOn,
    toggleCampfire
  };
};