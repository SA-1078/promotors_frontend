import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';

interface InactivityWarningModalProps {
    isOpen: boolean;
    remainingSeconds: number;
    onStayLoggedIn: () => void;
    onLogoutNow: () => void;
}

export default function InactivityWarningModal({
    isOpen,
    remainingSeconds,
    onStayLoggedIn,
    onLogoutNow
}: InactivityWarningModalProps) {
    const [countdown, setCountdown] = useState(remainingSeconds);

    useEffect(() => {
        if (!isOpen) {
            setCountdown(remainingSeconds);
            return;
        }

        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setTimeout(() => onLogoutNow(), 100);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen, remainingSeconds, onLogoutNow]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Modal isOpen={isOpen} onClose={onStayLoggedIn} title="Inactividad Detectada">
            <div className="text-center py-4">
                <div className="w-20 h-20 mx-auto mb-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                    Tu sesión está por expirar
                </h3>
                <p className="text-gray-300 mb-4">
                    No hemos detectado actividad en un tiempo. Por tu seguridad, cerraremos tu sesión automáticamente.
                </p>

                <div className="mb-6">
                    <div className="text-5xl font-bold text-yellow-500 mb-2">
                        {formatTime(countdown)}
                    </div>
                    <p className="text-sm text-gray-400">
                        Tiempo restante hasta el cierre de sesión
                    </p>
                </div>

                <div className="w-full bg-dark-700 rounded-full h-2 mb-6">
                    <div
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(countdown / remainingSeconds) * 100}%` }}
                    ></div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onStayLoggedIn}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-orange text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg"
                    >
                        Continuar Sesión
                    </button>
                    <button
                        onClick={onLogoutNow}
                        className="flex-1 px-6 py-3 border-2 border-red-600 text-red-400 hover:bg-red-600 hover:text-white rounded-lg font-semibold transition-all"
                    >
                        Cerrar Sesión Ahora
                    </button>
                </div>
            </div>
        </Modal>
    );
}
