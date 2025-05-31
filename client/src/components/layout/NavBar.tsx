import React from "react";

interface NavBarProps {
  activeTab: "home" | "sleep" | "feed" | "clean" | "play";
  onNavigation: (screen: "home" | "sleep" | "feed" | "clean" | "play") => void;
}

export const NavBar: React.FC<NavBarProps> = ({ activeTab, onNavigation }) => {
  const navItems = [
    {
      id: "sleep" as const,
      icon: "😴",
      label: "Dormir",
      color: "text-blue-500",
      activeColor: "bg-blue-500 text-white",
    },
    {
      id: "feed" as const,
      icon: "🍎",
      label: "Alimentar",
      color: "text-green-500",
      activeColor: "bg-green-500 text-white",
    },
    {
      id: "home" as const,
      icon: "🏠",
      label: "Home",
      color: "text-purple-500",
      activeColor: "bg-purple-500 text-white",
    },
    {
      id: "clean" as const,
      icon: "🧼",
      label: "Limpiar",
      color: "text-yellow-500",
      activeColor: "bg-yellow-500 text-white",
    },
    {
      id: "play" as const,
      icon: "🎮",
      label: "Jugar",
      color: "text-pink-500",
      activeColor: "bg-pink-500 text-white",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigation(item.id)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200
                ${isActive 
                  ? `${item.activeColor} shadow-lg scale-110` 
                  : `${item.color} hover:bg-gray-100`
                }
              `}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};