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
      {/* Replace this with Yura's actual logo */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
      <div className="absolute inset-1 rounded-full bg-white" />
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
    </div>
  );
}