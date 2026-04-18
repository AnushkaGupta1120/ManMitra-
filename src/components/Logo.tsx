import React from 'react';

export const Logo = ({ className = "h-10" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/src/logo.png" 
        alt="ManMitra Logo" 
        className="h-full w-auto object-contain"
        onError={(e) => {
          // Fallback if logo.png is not found yet
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling?.classList.remove('hidden');
        }}
        referrerPolicy="no-referrer"
      />
      <div className="hidden flex items-center gap-2 h-full">
        <svg viewBox="0 0 100 100" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Teal Figure */}
          <circle cx="35" cy="30" r="12" fill="#43A089" />
          <path d="M15 80C15 60 25 50 35 50C45 50 55 60 55 80H15Z" fill="#43A089" />
          
          {/* Yellow Figure */}
          <circle cx="65" cy="30" r="12" fill="#F9B824" />
          <path d="M45 80C45 60 55 50 65 50C75 50 85 60 85 80H45Z" fill="#F9B824" />
          
          {/* Hugging Arms (simplified) */}
          <path d="M35 55C45 55 55 55 65 55" stroke="white" strokeWidth="4" strokeLinecap="round" />
          
          {/* Heart */}
          <path d="M50 65C50 65 46 61 44 59C42 57 42 54 44 52C46 50 49 50 50 52C51 50 54 50 56 52C58 54 58 57 56 59C54 61 50 65 50 65Z" fill="#F9B824" stroke="#43A089" strokeWidth="1" />
        </svg>
        <div className="flex flex-col leading-none">
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-manmitra-teal">Man</span>
            <span className="text-manmitra-yellow">Mitra</span>
          </span>
          <span className="text-[8px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">
            Kyunki har Mann ko ek dost chahiye
          </span>
        </div>
      </div>
    </div>
  );
};
