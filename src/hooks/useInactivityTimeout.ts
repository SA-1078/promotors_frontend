import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

interface UseInactivityTimeoutProps {
    warningTime?: number;
    logoutTime?: number;
    onWarning?: () => void;
    onLogout?: () => void;
}

const DEFAULT_WARNING_TIME = 10 * 60 * 1000; // 10 minutes
const DEFAULT_LOGOUT_TIME = 15 * 60 * 1000;  // 15 minutes

export function useInactivityTimeout({
    warningTime = DEFAULT_WARNING_TIME,
    logoutTime = DEFAULT_LOGOUT_TIME,
    onWarning,
    onLogout
}: UseInactivityTimeoutProps = {}) {
    const { user, logout } = useAuth();
    const warningTimerRef = useRef<number | null>(null);
    const logoutTimerRef = useRef<number | null>(null);
    const lastActivityRef = useRef<number>(Date.now());

    const clearTimers = useCallback(() => {
        if (warningTimerRef.current) {
            clearTimeout(warningTimerRef.current);
            warningTimerRef.current = null;
        }
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
    }, []);

    const handleLogout = useCallback(() => {
        clearTimers();
        if (onLogout) {
            onLogout();
        }
        logout();
    }, [logout, onLogout, clearTimers]);

    const handleWarning = useCallback(() => {
        if (onWarning) {
            onWarning();
        }
    }, [onWarning]);

    const resetTimers = useCallback(() => {
        clearTimers();
        lastActivityRef.current = Date.now();

        // Set warning timer
        warningTimerRef.current = setTimeout(() => {
            handleWarning();
        }, warningTime);

        // Set logout timer
        logoutTimerRef.current = setTimeout(() => {
            handleLogout();
        }, logoutTime);
    }, [warningTime, logoutTime, handleWarning, handleLogout, clearTimers]);

    const handleActivity = useCallback(() => {
        const now = Date.now();
        const timeSinceLastActivity = now - lastActivityRef.current;

        // Only reset if it's been more than 1 second since last activity (debounce)
        if (timeSinceLastActivity > 1000) {
            resetTimers();
        }
    }, [resetTimers]);

    useEffect(() => {
        // Only activate for logged-in users
        if (!user) {
            clearTimers();
            return;
        }

        // Activity events to track
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

        // Start the timers initially
        resetTimers();

        // Attach event listeners
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Cleanup
        return () => {
            clearTimers();
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [user, handleActivity, resetTimers, clearTimers]);

    return {
        resetActivity: handleActivity,
        clearTimers
    };
}
