interface CircularProgressBarProps {
  progress: number; // 0-100
  pic: string; // Icon URL
  color: string; // Hex color for the progress ring
  name: string; // Accessibility label
  size?: 'sm' | 'md' | 'lg';
  strokeWidth?: number;
}

export default function CircularProgressBar({
  progress,
  pic,
  color,
  name,
  size = 'md',
  strokeWidth = 3
}: CircularProgressBarProps) {
  
  // Size configurations
  const sizeConfig = {
    sm: { 
      containerSize: 32, // w-8 h-8
      iconSize: 20,
      fontSize: 'text-xs'
    },
    md: { 
      containerSize: 40, // w-10 h-10
      iconSize: 24,
      fontSize: 'text-sm'
    },
    lg: { 
      containerSize: 48, // w-12 h-12
      iconSize: 32,
      fontSize: 'text-base'
    }
  };

  const config = sizeConfig[size];
  const radius = (config.containerSize - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ 
        width: config.containerSize, 
        height: config.containerSize 
      }}
      aria-label={`${name}: ${progress}%`}
    >
      {/* Background Circle */}
      <svg
        className="absolute inset-0 transform -rotate-90"
        width={config.containerSize}
        height={config.containerSize}
      >
        {/* Background ring */}
        <circle
          cx={config.containerSize / 2}
          cy={config.containerSize / 2}
          r={radius}
          stroke="#374151" // gray-700
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />
        
        {/* Progress ring */}
        <circle
          cx={config.containerSize / 2}
          cy={config.containerSize / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
          style={{
            filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))'
          }}
        />
      </svg>

      {/* Center Icon */}
      <div className="relative z-10 flex items-center justify-center">
        <img
          src={pic}
          alt={name}
          className="object-contain"
          style={{ 
            width: config.iconSize, 
            height: config.iconSize 
          }}
        />
      </div>

      {/* Optional: Show percentage on hover (uncomment if needed) */}
      {/* 
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/50 rounded-full">
        <span className={`font-bold text-white ${config.fontSize}`}>
          {progress}%
        </span>
      </div>
      */}
    </div>
  );
}