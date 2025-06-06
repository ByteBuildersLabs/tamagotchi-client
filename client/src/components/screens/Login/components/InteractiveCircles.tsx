import type { CircleType } from '../../../types/login.types';
import { CIRCLES } from '../../../../constants/login.constants';

interface InteractiveCirclesProps {
  currentCircle: CircleType;
}

export const InteractiveCircles = ({ currentCircle }: InteractiveCirclesProps) => (
  <>
    {CIRCLES.map(({ cx, cy, text, gradient }) => (
      <g key={text} className="transition-opacity duration-700">
        {/* Base circle */}
        <circle 
          cx={cx} 
          cy={cy} 
          r="100" 
          className="fill-gray-600 opacity-30" 
        />
        
        {/* Gradient circle with glow effect */}
        <circle 
          cx={cx} 
          cy={cy} 
          r="100" 
          fill={`url(#${gradient})`}
          className={`transition-all duration-1000 ${
            currentCircle === text.toLowerCase() ? 'opacity-100' : 'opacity-0'
          }`}
          filter="url(#glow)" 
        />
        
        {/* Circle text */}
        <text 
          x={cx} 
          y={cy} 
          className="fill-text-primary text-lg sm:text-xl font-rubik font-bold"
          style={{ 
            textAnchor: 'middle',
            dominantBaseline: 'middle'
          }}
        >
          {text}
        </text>
      </g>
    ))}
  </>
);