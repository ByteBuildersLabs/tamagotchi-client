import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import SleepIcon  from '../../assets/icons/navBar/icon-sleep.webp';
import FeedIcon    from '../../assets/icons/navBar/icon-feed.webp';
import HomeIcon from '../../assets/icons/navBar/icon-home.webp';
import CleanIcon from '../../assets/icons/navBar/icon-clean.webp';
import PlayIcon from '../../assets/icons/navBar/icon-play.webp';

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
    setActive(id);
    onNavigation?.(id);
  };

  return (
    <motion.nav
      className="
        fixed bottom-0 inset-x-0 h-16
        bg-cream shadow-lg
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
            transition-colors duration-200
            ${
              active === item.id
                ? 'bg-primary-hover text-surface'      
                : 'bg-transparent hover:bg-primary-hover/10 text-text-primary'
            }
          `}
          aria-label={item.label}
        >
          <img
            src={item.src}
            alt={item.label}
            className="w-12 h-12"
          />
          {active === item.id && (
            <span className="text-s font-luckiest text-dark">
              {item.label}
            </span>
          )}
        </motion.button>
      ))}
    </motion.nav>
  );
}
