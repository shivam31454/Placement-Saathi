import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-dark-bg">
            <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                    {/* Outer ring */}
                    <div className="absolute inset-0 border-4 border-primary-200 dark:border-primary-900 rounded-full"></div>
                    {/* Spinning ring */}
                    <div className="absolute inset-0 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    {/* Inner pulse */}
                    <div className="absolute inset-3 bg-primary-500 rounded-full animate-pulse opacity-20"></div>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                    Loading...
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Please wait while we prepare your experience
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
