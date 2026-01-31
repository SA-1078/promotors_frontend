import { api } from './api';
import type { User } from '../types';

export const getUsers = async (params?: { page?: number; limit?: number; search?: string }): Promise<User[]> => {
    const response = await api.get<{ success: boolean; data: { items: User[] } }>('/users', { params });
    return response.data.data.items;
};

export const getUserById = async (id: number): Promise<User> => {
    const response = await api.get<{ success: boolean; data: User }>(`/users/${id}`);
    return response.data.data;
};

export const createUser = async (data: {
    nombre: string;
    email: string;
    telefono: string;
    password: string;
    rol: string;
}): Promise<User> => {
    const response = await api.post<User>('/users', data);
    return response.data;
};

export const updateUser = async (
    id: number,
    data: Partial<{ nombre: string; email: string; telefono: string; rol: string }>
): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
};
