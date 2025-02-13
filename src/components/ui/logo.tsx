interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function Logo({ size = 'medium', className }: LogoProps) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  return (
    <div className={`${sizeClasses[size]} relative ${className || ''}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        {/* Main snowflake shape */}
        <g className="text-blue-600">
          {/* Center circle */}
          <circle cx="12" cy="12" r="2" className="fill-current" />

          {/* Main spokes */}
          {[0, 60, 120].map((rotation) => (
            <g key={rotation} transform={`rotate(${rotation} 12 12)`}>
              {/* Vertical line */}
              <path
                d="M12 4v16"
                className="stroke-current"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Top decorative elements */}
              <path
                d="M10 6l2-2 2 2M9 8l3-3 3 3"
                className="stroke-current"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Bottom decorative elements */}
              <path
                d="M10 18l2 2 2-2M9 16l3 3 3-3"
                className="stroke-current"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          ))}
        </g>
        
        {/* Outer ring - represents movement/skating */}
        <circle
          cx="12"
          cy="12"
          r="11"
          className="stroke-blue-400"
          strokeWidth="0.5"
          strokeDasharray="3 3"
        />
      </svg>
    </div>
  );
}