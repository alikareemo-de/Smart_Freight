import type { AuthState } from './types';

const storageKey = 'smartFreightAuth';

export const getAuthStorage = (): AuthState | null => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
        return null;
    }
    try {
        return JSON.parse(raw) as AuthState;
    } catch {
        return null;
    }
};

export const setAuthStorage = (state: AuthState) => {
    localStorage.setItem(storageKey, JSON.stringify(state));
};

export const clearAuthStorage = () => {
    localStorage.removeItem(storageKey);
};
