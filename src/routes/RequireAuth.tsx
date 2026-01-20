import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

interface RequireAuthProps {
    children: ReactNode;
    requiredRole?: 'admin' | 'empleado' | 'cliente';
}

export default function RequireAuth({ children, requiredRole }: RequireAuthProps) {
    const { user, token } = useAuth();

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.rol !== requiredRole) {
        // User doesn't have required role
        if (user.rol === 'admin') {
            // Admin can access everything
            return <>{children}</>;
        }
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
