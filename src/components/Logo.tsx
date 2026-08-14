import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  lightText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true, lightText = false }) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizeMap = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${sizeMap[size]} flex-shrink-0 flex items-center justify-center`}>
        <img
          src="/nfis.svg"
          alt="NFIS Logo"
          className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            // Fallback to logo NFIS.png
            (e.target as HTMLImageElement).src = '/logo NFIS.png';
          }}
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-wider ${textSizeMap[size]} ${lightText ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
            WATICKET
          </span>
          <span className={`text-[10px] uppercase tracking-widest font-semibold ${lightText ? 'text-emerald-200' : 'text-emerald-600 dark:text-emerald-400'}`}>
            System Ticketing WhatsApp
          </span>
        </div>
      )}
    </div>
  );
};
