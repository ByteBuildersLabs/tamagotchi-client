import { useCallback, useState, useEffect, useRef } from "react";
import { useAccount, useDisconnect } from "@starknet-react/core";

// Components
import { ShareModal } from "./ShareModal";
import { ChatModal } from "../../../shared/ChatModal";

// Context
import { useMusic } from "../../../../context/MusicContext";

// Simple hook to check if user has a beast
import { useBeastDisplay } from "../../../../dojo/hooks/useBeastDisplay";

// Assets
import menuIcon from "../../../../assets/icons/menu/icon-menu.webp";
import chatIcon from "../../../../assets/icons/chat/chat.png";
import closeIcon from "../../../../assets/icons/extras/icon-close.png";
import profileIcon from "../../../../assets/icons/menu/svg/icon-profile.svg";
import shareIcon from "../../../../assets/icons/menu/svg/icon-share.svg";
import logoutIcon from "../../../../assets/icons/menu/svg/icon-logout.svg";
import soundOnIcon from "../../../../assets/icons/menu/svg/icon-sound-on.svg";
import soundOffIcon from "../../../../assets/icons/menu/svg/icon-sound-off.svg";

type DropdownMenuProps = {
  onNavigateLogin: () => void;
};

export const DropdownMenu = ({ onNavigateLogin }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { isMuted, toggleMute } = useMusic();

  // Only need to check if user has a beast (for disabling share button)
  const { hasLiveBeast } = useBeastDisplay();

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const toggleChat = useCallback(() => {
    setIsChatModalOpen(prev => !prev);
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

  const handleProfile = useCallback(() => {
    if (!connector || !('controller' in connector)) {
      console.error("Connector not initialized");
      return;
    }
    if (connector.controller && typeof connector.controller === 'object' && 'openProfile' in connector.controller) {
      (connector.controller as { openProfile: (profile: string) => void }).openProfile("achievements");
    } else {
      console.error("Connector controller is not properly initialized");
    }
  }, [connector]);

  const handleShareClick = useCallback(() => {
    setIsShareModalOpen(true);
    setIsOpen(false); // Close dropdown when opening share modal
  }, []);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setIsOpen(false);
    // Add a small delay to ensure the wallet modal is closed before navigation
    setTimeout(() => {
      onNavigateLogin();
    }, 100);
  }, [onNavigateLogin]);

  return (
    <div className="relative flex items-center gap-3" ref={dropdownRef}>
      {/* Chat Button - Duplicated element */}
      <button
        onClick={toggleChat}
        className="flex items-center justify-center z-50 hover:scale-105 transition-transform"
        aria-label="Open chat"
      >
        <img
          src={chatIcon}
          alt=""
          className="w-10 h-10 filter brightness-75 hover:brightness-100 transition-all"
        />
      </button>

      {/* Original Menu Toggle Button */}
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
            onClick={handleProfile}
            className="flex items-center space-x-3 w-full hover:scale-105 transition-transform"
            role="menuitem"
          >
            <img src={profileIcon} alt="" className="w-5 h-5" />
            <span className="text-dark font-luckiest">Profile</span>
          </button>

          <button
            onClick={handleShareClick}
            className="flex items-center space-x-3 w-full hover:scale-105 transition-transform"
            role="menuitem"
            disabled={!hasLiveBeast} // Disable if no beast exists
          >
            <img src={shareIcon} alt="" className="w-5 h-5" />
            <span className={`font-luckiest ${!hasLiveBeast ? 'text-gray-400' : 'text-dark'}`}>
              Share on X
            </span>
          </button>

          <button
            onClick={toggleMute}
            className="flex items-center space-x-3 w-full hover:scale-105 transition-transform"
            role="menuitem"
          >
            <img src={isMuted ? soundOffIcon : soundOnIcon} alt="" className="w-5 h-5" />
            <span className="text-dark font-luckiest">{isMuted ? "Unmute" : "Mute"}</span>
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
        type="beast"
      />

      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
      />
    </div>
  );
};