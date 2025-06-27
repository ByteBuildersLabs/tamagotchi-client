import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import SleepIcon  from '../../assets/icons/navBar/icon-sleep.webp';
import FeedIcon    from '../../assets/icons/navBar/icon-feed.webp';
import HomeIcon from '../../assets/icons/navBar/icon-home.webp';
import CleanIcon from '../../assets/icons/navBar/icon-clean.webp';
import PlayIcon from '../../assets/icons/navBar/icon-play.webp';

// Real-time status integration
import { useUpdateBeast } from '../../dojo/hooks/useUpdateBeast';

type Screen = "login" | "cover" | "home" | "sleep" | "feed" | "clean" | "play";

interface NavBarProps {
  onNavigation?: (screen: Screen) => void;
  activeTab?: Screen;
}

export function NavBar({
  onNavigation,
  activeTab = 'home',
}: NavBarProps) {
  const [active, setActive] = useState<Screen>(activeTab);
  
  // Hook for background beast updates
  const { triggerUpdate, isUpdating } = useUpdateBeast();

  useEffect(() => {
    setActive(activeTab);
  }, [activeTab]);

  const navItems: { id: Screen; src: string; label: string }[] = [
    { id: 'sleep',  src: SleepIcon,  label: 'Sleep'  },
    { id: 'feed',    src: FeedIcon,    label: 'Feed'    },
    { id: 'home', src: HomeIcon, label: 'Home' },
    { id: 'clean', src: CleanIcon, label: 'Clean' },
    { id: 'play', src: PlayIcon, label: 'Play' },
  ];

  const handleClick = (id: Screen) => {
    console.log(`🧭 Navigating to ${id}`);
    
    // Set active immediately for instant UI feedback
    setActive(id);
    
    // Trigger navigation callback immediately (non-blocking)
    onNavigation?.(id);
    
    // Trigger background update_beast (fire-and-forget)
    triggerUpdate();
  };

  return (
    <motion.nav
      className="
        fixed bottom-0 inset-x-0 h-16
        bg-cream shadow-soft-lg
        flex divide-x divide-gray-500/20
        z-20
      "
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
    >
      {navItems.map(item => (
        <motion.button
          key={item.id}
          layout
          onClick={() => handleClick(item.id)}
          className={`
            flex-1 h-full
            flex flex-col items-center justify-center
            transition-all duration-300 ease-in-out
            ${
              active === item.id
                ? 'bg-gold-gradient text-screen shadow-soft-lg'      
                : 'bg-transparent hover:bg-gold/10 text-text-primary'
            }
            relative
          `}
          aria-label={item.label}
        >
          {/* Update indicator - subtle visual feedback */}
          {isUpdating && active === item.id && (
            <div className="absolute top-1 right-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          )}
          
          <img
            src={item.src}
            alt={item.label}
            className="w-14 h-14"
          />
          {active === item.id && (
            <span className="text-sm font-luckiest text-screen pb-1">
              {item.label}
            </span>
          )}
        </motion.button>
      ))}
    </motion.nav>
  );
}