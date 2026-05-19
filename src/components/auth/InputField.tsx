import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface InputFieldProps {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  id: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  autoComplete?: string;
  maxLength?: number;
  disabled?: boolean;
}

export function InputField({
  label,
  error,
  icon,
  id,
  className,
  ...props
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-slate-700 font-medium text-sm">
        {label}
      </Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        <Input
          id={id}
          className={cn(
            'h-11 rounded-xl border-slate-200 bg-white px-4 text-base transition-all duration-200',
            'focus-visible:border-manmitra-teal focus-visible:ring-manmitra-teal/30',
            'placeholder:text-slate-400',
            icon && 'pl-10',
            error && 'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-200',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p
          id={`${id}-error`}
          className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1"
          role="alert"
        >
          <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
