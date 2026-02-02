import { httpClient } from './http';
import type { AuthResponse, LoginRequest } from '../types/auth';

export const login = async (payload: LoginRequest) => {
    const { data } = await httpClient.post<AuthResponse>('/auth/login', payload);
    return data;
};
