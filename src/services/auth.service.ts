import { api } from './api';
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types';

export const loginApi = async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', payload);
    return response.data.data;
};

export const registerApi = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/register', payload);
    return response.data.data;
};
