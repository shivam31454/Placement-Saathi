import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const variants = {
    primary: 'bg-primary-600 text-white shadow-lg hover:bg-primary-700 btn-hover-effect glass-button',
    secondary: 'bg-secondary-600 text-white shadow-lg hover:bg-secondary-700 btn-hover-effect',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 btn-hover-effect',
    ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 btn-hover-effect',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md btn-hover-effect',
};

const sizes = {
    sm: 'px-3 py-1.5 text-xs font-medium',
    md: 'px-4 py-2 text-sm font-medium',
    lg: 'px-6 py-3 text-base font-semibold',
    icon: 'p-2',
};

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon: Icon,
    children,
    disabled,
    ...props
}) {
    return (
        <motion.button
            whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
            disabled={disabled || isLoading}
            className={twMerge(
                'inline-flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {!isLoading && Icon && <Icon className={clsx("w-4 h-4", children ? "mr-2" : "")} />}
            {children}
        </motion.button>
    );
}

export default Button;
