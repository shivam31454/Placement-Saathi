import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check } from 'lucide-react';
import Button from '../ui/Button';

const steps = [
    {
        target: 'body', // General welcome
        title: "Welcome to Placement Saathi! 🎓",
        content: "Let's take a quick tour to help you get started with your placement preparation.",
        position: 'center'
    },
    {
        target: 'a[href="/mock-interview"]', // Should match the link to mock interview
        title: "AI Mock Interviews 🤖",
        content: "Practice with our realistic 3D AI interviewer here. Get instant feedback on your answers.",
        position: 'bottom'
    },
    {
        target: 'a[href="/practice"]', // Recommended tests view all link
        title: "Mock Tests & Practice 📝",
        content: "Take time-bound tests and practice coding problems to build your confidence.",
        position: 'left' // Adjust based on layout
    },
    {
        target: 'a[href="/scan-resume"]', // Resume scanner card
        title: "ATS Resume Scanner 📄",
        content: "Check if your resume is ATS-friendly and get improvement tips instantly.",
        position: 'top'
    },
    {
        target: 'button:has(.bell)', // Notification bell (approximation)
        title: "Stay Updated 🔔",
        content: "Check here for new tests, results, and study reminders.",
        position: 'bottom-right'
    }
];

const OnboardingTour = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [targetRect, setTargetRect] = useState(null);

    useEffect(() => {
        const step = steps[currentStep];
        if (step.target === 'body') {
            setTargetRect(null);
            return;
        }

        // Find target element
        const element = document.querySelector(step.target);
        if (element) {
            const rect = element.getBoundingClientRect();
            setTargetRect({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height,
            });
            // Scroll to element
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // If element not found, skip step (fallback)
            // setTimeout(() => handleNext(), 100); 
            // Better behavior: Just show centered if element missing
            setTargetRect(null);
        }
    }, [currentStep]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        localStorage.setItem('onboarding_completed', 'true');
        if (onComplete) onComplete();
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] overflow-hidden"
            >
                {/* Backdrop with cutout effect using SVG mask or simple overlay */}
                {/* Simple overlay approach for ease */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

                {/* Spotlight Highlight */}
                {targetRect && (
                    <motion.div
                        layoutId="spotlight"
                        initial={false}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'absolute',
                            top: targetRect.top - 4,
                            left: targetRect.left - 4,
                            width: targetRect.width + 8,
                            height: targetRect.height + 8,
                            borderRadius: '12px',
                            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
                            zIndex: 10
                        }}
                        className="pointer-events-none border-2 border-primary-500 animate-pulse"
                    />
                )}

                {/* Dialog Box */}
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        position: 'absolute',
                        ...(targetRect
                            ? {
                                top: Math.min(window.innerHeight - 300, Math.max(20, targetRect.top + targetRect.height + 20)),
                                left: Math.max(20, Math.min(window.innerWidth - 340, targetRect.left))
                            }
                            : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
                        )
                    }}
                    className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl w-[320px] max-w-[90vw] z-50 border border-slate-200 dark:border-slate-700 ${!targetRect && '-translate-x-1/2 -translate-y-1/2'}`}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-2">
                            {/* Progress Dots */}
                            <div className="flex gap-1 mt-1">
                                {steps.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full transition-colors ${i === currentStep ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <button onClick={handleComplete} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {steps[currentStep].title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed">
                        {steps[currentStep].content}
                    </p>

                    <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400 font-medium">
                            Step {currentStep + 1} of {steps.length}
                        </span>
                        <Button onClick={handleNext} size="sm" className="shadow-lg shadow-primary-500/20">
                            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                            {currentStep === steps.length - 1 ? <Check className="ml-1 w-4 h-4" /> : <ArrowRight className="ml-1 w-4 h-4" />}
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OnboardingTour;
