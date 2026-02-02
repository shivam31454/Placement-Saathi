import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Input = React.forwardRef(({ className, error, label, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={twMerge(
                    'w-full px-4 py-2.5 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg',
                    'text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500',
                    'transition-all duration-200',
                    'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400 ml-1 animate-pulse">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
