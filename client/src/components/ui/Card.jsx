import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

export function Card({ className, children, hover = false, ...props }) {
    return (
        <motion.div
            whileHover={hover ? { y: -5 } : {}}
            className={twMerge(
                'glass-panel rounded-xl p-6 transition-all duration-300',
                hover && 'hover:shadow-2xl hover:bg-white/80 dark:hover:bg-slate-800/60',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export default Card;
