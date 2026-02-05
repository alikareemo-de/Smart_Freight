import { createContext, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { clearAuthStorage, getAuthStorage, setAuthStorage } from './authStorage';
import type { AuthState } from './types';
import { login as loginRequest } from '../api/auth';

type AuthContextValue = {
    auth: AuthState | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [auth, setAuth] = useState<AuthState | null>(() => getAuthStorage());

    const login = async (email: string, password: string) => {
        const response = await loginRequest({ email, password });
        const nextAuth: AuthState = {
            token: response.accessToken,
            email: response.email,
            role: response.role,
            expiresAt: response.expiresAt,
        };
        setAuth(nextAuth);
        setAuthStorage(nextAuth);
        enqueueSnackbar('Welcome back!', { variant: 'success' });
        navigate('/dashboard', { replace: true });
    };

    const logout = () => {
        setAuth(null);
        clearAuthStorage();
        enqueueSnackbar('You have been signed out.', { variant: 'info' });
        navigate('/login', { replace: true });
    };

    const value = useMemo(() => ({ auth, login, logout }), [auth]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return ctx;
};
