import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginApi, registerApi } from '../services/auth.service';
import type { User, LoginPayload, RegisterPayload } from '../types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => void;
    isAdmin: () => boolean;
    isEmployee: () => boolean;
    isClient: () => boolean;
}

interface JwtPayload {
    sub: number; // user id
    email: string;
    nombre: string;
    rol: string;
    telefono?: string;
    iat?: number;
    exp?: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const raw = localStorage.getItem('auth_user');
        return raw ? JSON.parse(raw) : null;
    });

    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('auth_token');
    });

    const login = async (payload: LoginPayload) => {
        const { access_token: token, user: apiUser } = await loginApi(payload);

        let userInfo: User;

        if (apiUser) {
            userInfo = apiUser;
        } else {
            // Fallback: Decode JWT if user object is not provided
            let decoded: JwtPayload;
            try {
                decoded = jwtDecode<JwtPayload>(token);
            } catch (error) {
                console.error('Error decoding token:', error);
                decoded = {
                    sub: 0,
                    email: payload.email,
                    nombre: payload.email.split('@')[0],
                    rol: 'cliente'
                };
            }

            userInfo = {
                id_usuario: decoded.sub,
                nombre: decoded.nombre,
                email: decoded.email,
                telefono: decoded.telefono || '',
                rol: decoded.rol as 'admin' | 'empleado' | 'cliente',
                fecha_registro: new Date().toISOString(),
            };
        }

        setToken(token);
        setUser(userInfo);

        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(userInfo));
    };

    const register = async (payload: RegisterPayload) => {
        const { access_token: token, user: apiUser } = await registerApi(payload);

        let userInfo: User;

        if (apiUser) {
            userInfo = apiUser;
        } else {
            // Fallback: Decode JWT
            const decoded = jwtDecode<JwtPayload>(token);
            userInfo = {
                id_usuario: decoded.sub,
                nombre: decoded.nombre,
                email: decoded.email,
                telefono: decoded.telefono || payload.telefono,
                rol: decoded.rol as 'admin' | 'empleado' | 'cliente',
                fecha_registro: new Date().toISOString(),
            };
        }

        setToken(token);
        setUser(userInfo);

        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(userInfo));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
    };

    const isAdmin = () => user?.rol === 'admin';
    const isEmployee = () => user?.rol === 'empleado';
    const isClient = () => user?.rol === 'cliente';

    const value = useMemo(
        () => ({
            user,
            token,
            login,
            register,
            logout,
            isAdmin,
            isEmployee,
            isClient,
        }),
        [user, token]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
