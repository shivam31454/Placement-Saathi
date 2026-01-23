import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className, disabled = false }) => {
    const baseStyles = "w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary hover:bg-indigo-700 text-white",
        secondary: "bg-secondary hover:bg-emerald-600 text-white",
        outline: "bg-transparent border border-primary text-primary hover:bg-primary hover:text-white",
        danger: "bg-red-500 hover:bg-red-700 text-white"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={twMerge(baseStyles, variants[variant], className)}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
