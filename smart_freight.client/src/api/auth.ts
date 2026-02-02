import { httpClient } from './http';
import type { AuthResponse, LoginRequest } from '../types/auth';

export const login = async (payload: LoginRequest) => {
    const { data } = await httpClient.post<AuthResponse>('https://localhost:7276/auth/login', payload);
    return data;
};
