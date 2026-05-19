import React from 'react';
import { cn } from '@/lib/utils';

interface AuthButtonProps {
  loading?: boolean;
  variant?: 'primary' | 'outline';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export function AuthButton({
  loading,
  variant = 'primary',
  children,
  className,
  disabled,
  type = 'button',
  onClick,
}: AuthButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        'relative w-full h-12 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        variant === 'primary' && [
          'bg-manmitra-teal text-white shadow-lg shadow-manmitra-teal/25',
          'hover:bg-manmitra-teal/90 hover:shadow-xl hover:shadow-manmitra-teal/30',
          'active:scale-[0.98]',
        ],
        variant === 'outline' && [
          'bg-white text-slate-700 border-2 border-slate-200',
          'hover:border-slate-300 hover:bg-slate-50',
          'active:scale-[0.98]',
        ],
        className
      )}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Please wait...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
