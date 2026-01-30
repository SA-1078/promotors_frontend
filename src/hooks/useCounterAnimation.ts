import { useState, useEffect, useRef } from 'react';

interface UseCounterAnimationOptions {
    duration?: number;
    startOnMount?: boolean;
}

/**
 * Custom hook for animated number counting
 * @param end - Target number to count to
 * @param options - Animation options
 * @returns Current animated value
 */
export function useCounterAnimation(
    end: number,
    options: UseCounterAnimationOptions = {}
): number {
    const { duration = 2000, startOnMount = true } = options;
    const [count, setCount] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!startOnMount) return;

        const animate = (timestamp: number) => {
            if (!startTimeRef.current) {
                startTimeRef.current = timestamp;
            }

            const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuad = (t: number) => t * (2 - t);
            const easedProgress = easeOutQuad(progress);

            setCount(Math.floor(easedProgress * end));

            if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [end, duration, startOnMount]);

    return count;
}
