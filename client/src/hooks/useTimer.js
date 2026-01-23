import { useState, useEffect, useRef } from 'react';

const useTimer = (initialMinutes, onTimeUp) => {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
    const timerRef = useRef(null);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [timeLeft, onTimeUp]);

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    return { timeLeft, formatTime };
};

export default useTimer;
