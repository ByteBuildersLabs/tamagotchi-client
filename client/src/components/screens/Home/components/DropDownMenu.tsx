import { useCallback, useState, useEffect, useRef } from "react";
// import { useAccount, useDisconnect } from "@starknet-react/core";

// // Components
import { ShareModal } from "./ShareModal";

// Assets
import menuIcon from "../../../../assets/icons/menu/icon-menu.webp";
import closeIcon from "../../../../assets/icons/extras/icon-close.png";
import profileIcon from "../../../../assets/icons/menu/svg/icon-profile.svg";
import shareIcon from "../../../../assets/icons/menu/svg/icon-share.svg";
import logoutIcon from "../../../../assets/icons/menu/svg/icon-logout.svg";

type DropdownMenuProps = {
  onNavigateLogin: () => void;
  selectedBeast?: {
    age: number; // in days
    energy: number;
    hunger: number;
    happiness: number;
    cleanliness: number;
  };  
};

export const DropdownMenu = ({ 
  onNavigateLogin,
  selectedBeast 
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // const { connector } = useAccount();
  // const { disconnect } = useDisconnect();

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // const handleProfile = useCallback(() => {
  //   if (!connector || !('controller' in connector)) {
  //     console.error("Connector not initialized");
  //     return;
  //   }
  //   if (connector.controller && typeof connector.controller === 'object' && 'openProfile' in connector.controller) {
  //     (connector.controller as { openProfile: (profile: string) => void }).openProfile("achievements");
  //   } else {
  //     console.error("Connector controller is not properly initialized");
  //   }
  // }, [connector]);

  const handleShareClick = useCallback(() => {
    setIsShareModalOpen(true);
    setIsOpen(false); // Close dropdown when opening share modal
  }, []);

  const handleDisconnect = useCallback(() => {
    // disconnect();
    setIsOpen(false);
    // Add a small delay to ensure the wallet modal is closed before navigation
    setTimeout(() => {
      onNavigateLogin();
    }, 100);
  }, [onNavigateLogin]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center z-50 hover:scale-105 transition-transform"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <img
          src={isOpen ? closeIcon : menuIcon}
          alt=""
          className={`${isOpen ? 'w-10 h-10' : 'w-10 h-10'}`}
        />
      </button>

      {/* Dropdown Overlay */}
      {isOpen && (
        <div 
          className="absolute top-0 right-0 mt-12 w-48 bg-cream rounded-xl shadow-lg px-4 py-3 space-y-3 z-50"
          role="menu"
          aria-orientation="vertical"
        >
          <button
            // onClick={handleProfile}
            className="flex items-center space-x-3 w-full hover:scale-105 transition-transform"
            role="menuitem"
            disabled
          >
            <img src={profileIcon} alt="" className="w-5 h-5" />
            <span className="text-dark font-luckiest">Profile</span>
          </button>

          <button
            onClick={handleShareClick}
            className="flex items-center space-x-3 w-full hover:scale-105 transition-transform"
            role="menuitem"
          >
            <img src={shareIcon} alt="" className="w-5 h-5" />
            <span className="text-dark font-luckiest">Share on X</span>
          </button>

          <button
            onClick={handleDisconnect}
            className="flex items-center space-x-3 w-full hover:scale-105 transition-transform"
            role="menuitem"
          >
            <img src={logoutIcon} alt="" className="w-5 h-5" />
            <span className="text-dark font-luckiest">Disconnect</span>
          </button>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        beastData={selectedBeast}
      />
    </div>
  );
};
