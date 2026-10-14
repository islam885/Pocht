import React from 'react';

interface CarrierLogoProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CarrierLogo: React.FC<CarrierLogoProps> = ({ type, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-11 h-11 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
  }[size];

  switch (type) {
    case 'kazpost':
      return (
        <div className={`bg-white shadow-sm flex flex-col items-center justify-center p-1 overflow-hidden shrink-0 ${sizeClasses} ${className}`}>
          {/* Kazpost iconic blue eagle wings logo */}
          <svg viewBox="0 0 100 65" className="w-full h-auto" fill="none">
            <path
              d="M10 38C25 15 50 12 90 10C65 24 45 32 30 50C42 42 65 36 82 38C55 48 35 55 18 58C24 50 22 44 10 38Z"
              fill="#0054A6"
            />
            <path
              d="M24 24C38 10 65 8 92 6C70 17 52 23 38 36C48 30 68 25 84 27C60 35 44 42 30 46C34 38 31 31 24 24Z"
              fill="#0088CE"
            />
          </svg>
          <span className="text-[7px] font-extrabold tracking-tighter text-[#0054A6] leading-none mt-0.5 font-sans">
            KAZPOST
          </span>
        </div>
      );

    case 'dpd':
      return (
        <div className={`bg-white shadow-sm flex items-center justify-center p-1.5 shrink-0 ${sizeClasses} ${className}`}>
          <div className="flex items-center gap-0.5">
            <svg viewBox="0 0 32 32" className="w-5 h-5 text-[#DC0032] shrink-0" fill="currentColor">
              <path d="M16 2L2 10V22L16 30L30 22V10L16 2ZM16 5.2L26.3 11L16 16.8L5.7 11L16 5.2ZM4.5 12.8L14.5 18.5V26.8L4.5 21.1V12.8ZM17.5 26.8V18.5L27.5 12.8V21.1L17.5 26.8Z" />
            </svg>
            <span className="text-[10px] font-black text-[#DC0032] tracking-tighter">dpd</span>
          </div>
        </div>
      );

    case 'alfa':
      return (
        <div className={`bg-[#E65100] shadow-sm flex flex-col items-center justify-center p-1 text-white shrink-0 ${sizeClasses} ${className}`}>
          <span className="text-[8px] font-black tracking-wider leading-none">ADS</span>
          <svg viewBox="0 0 24 16" className="w-4 h-2.5 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M2 14L12 3L22 14H2Z" />
          </svg>
        </div>
      );

    case 'eagle':
      return (
        <div className={`bg-[#D32F2F] shadow-sm flex flex-col items-center justify-center p-0.5 text-white shrink-0 rounded-full ${sizeClasses} ${className}`}>
          <span className="text-[7px] font-black tracking-tight uppercase leading-none">EAGLE</span>
          <span className="text-[5px] font-medium tracking-tighter opacity-80 uppercase leading-none">COURIER</span>
        </div>
      );

    case 'jana':
      return (
        <div className={`bg-white shadow-sm flex flex-col items-center justify-center p-1 shrink-0 ${sizeClasses} ${className}`}>
          <span className="text-[9px] font-black text-[#10B981] tracking-tighter leading-none">JAŃA</span>
          <span className="text-[6px] font-bold text-slate-800 tracking-wider uppercase leading-none mt-0.5">POST</span>
        </div>
      );

    case 'jet':
      return (
        <div className={`bg-white shadow-sm flex flex-col items-center justify-center p-1 shrink-0 ${sizeClasses} ${className}`}>
          <div className="flex items-center gap-0.5">
            <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 text-[#06B6D4]" fill="currentColor">
              <path d="M10 2L18 10L10 18L13 10L10 2Z" />
            </svg>
            <span className="text-[7px] font-bold text-slate-800 leading-none">Jet</span>
          </div>
          <span className="text-[5px] text-[#06B6D4] font-medium leading-none">Logistic</span>
        </div>
      );

    case 'yto':
      return (
        <div className={`bg-[#6D28D9] shadow-sm flex items-center justify-center p-1 text-white shrink-0 ${sizeClasses} ${className}`}>
          <span className="text-[8px] font-black tracking-wider">YTO</span>
        </div>
      );

    case 'cdek':
      return (
        <div className={`bg-[#00A859] shadow-sm flex items-center justify-center p-1 text-white shrink-0 ${sizeClasses} ${className}`}>
          <span className="text-[8px] font-extrabold tracking-tight">CDEK</span>
        </div>
      );

    case 'dhl':
      return (
        <div className={`bg-[#FFCC00] shadow-sm flex items-center justify-center p-1 shrink-0 ${sizeClasses} ${className}`}>
          <span className="text-[10px] font-black text-[#D40511] tracking-tighter italic">DHL</span>
        </div>
      );

    case 'fedex':
      return (
        <div className={`bg-white shadow-sm flex items-center justify-center p-1 shrink-0 ${sizeClasses} ${className}`}>
          <span className="text-[9px] font-black text-[#4D148C]">Fed<span className="text-[#FF6600]">Ex</span></span>
        </div>
      );

    default:
      return (
        <div className={`bg-slate-700 shadow-sm flex items-center justify-center p-1 text-white shrink-0 ${sizeClasses} ${className}`}>
          <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      );
  }
};
