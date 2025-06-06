import { GRADIENTS, STARS, TWINKLES } from '../../../../constants/login.constants';

// SVG Definitions (gradients and filters)
export const SVGDefinitions = () => (
  <defs>
    {GRADIENTS.map(({ id, cx, cy, color }) => (
      <radialGradient 
        key={id} 
        id={id} 
        gradientUnits="userSpaceOnUse" 
        cx={cx} 
        cy={cy} 
        r="100" 
        fx={cx} 
        fy={cy}
      >
        <stop offset="0%" stopColor={color} stopOpacity="0.8" />
        <stop offset="60%" stopColor={color} stopOpacity="0.3" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </radialGradient>
    ))}
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

// Background stars and twinkles
export const BackgroundElements = () => (
  <g className="stars">
    {STARS.map((star, index) => (
      <circle 
        key={`star-${index}`}
        className="fill-magenta opacity-80 animate-subtleTwinkle" 
        {...star}
        style={{ animationDelay: `${index * 0.5}s` }}
      />
    ))}
    {TWINKLES.map((twinkle, index) => (
      <path 
        key={`twinkle-${index}`}
        className="fill-white opacity-90 animate-softGlow" 
        {...twinkle}
        style={{ animationDelay: `${index * 0.8}s` }}
      />
    ))}
  </g>
);