import React from 'react';

interface BrandProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showDashPrefix?: boolean;
  className?: string;
}

export const Brand: React.FC<BrandProps> = ({
  size = 'md',
  showSubtitle = false,
  showDashPrefix = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl sm:text-4xl',
    lg: 'text-4xl sm:text-5xl',
    xl: 'text-5xl sm:text-6xl',
  };

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className="flex items-center gap-2">
        {showDashPrefix && (
          <span className="w-5 h-[1.5px] bg-[#659287]/60 inline-block rounded-full mr-0.5" />
        )}
        <span
          className={`font-cursive tracking-normal text-[#1b3832] ${sizeClasses[size]} font-bold leading-none`}
          style={{ letterSpacing: '0.01em' }}
        >
          Presently
        </span>
      </div>
      {showSubtitle && (
        <span className="text-[11px] font-medium tracking-widest uppercase text-[#659287] mt-0.5">
          Ideas in Motion
        </span>
      )}
    </div>
  );
};
