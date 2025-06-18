import { useState } from "react";

export const usePlayerModal = () => {
  const [isPlayerInfoModalOpen, setIsPlayerInfoModalOpen] = useState(false);

  const openPlayerModal = () => {
    setIsPlayerInfoModalOpen(true);
  };

  const closePlayerModal = () => {
    setIsPlayerInfoModalOpen(false);
  };

  return {
    isPlayerInfoModalOpen,
    openPlayerModal,
    closePlayerModal
  };
};