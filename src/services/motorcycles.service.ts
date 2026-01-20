import { api } from './api';
import type { Motorcycle, CreateMotorcycleDto } from '../types';

export const getMotorcycles = async (params?: {
    page?: number;
    limit?: number;
    categoria?: number;
    marca?: string;
    search?: string;
}): Promise<Motorcycle[]> => {
    const response = await api.get<{ success: boolean; data: { items: Motorcycle[] } }>('/motorcycles', { params });
    return response.data.data.items; // Extract items from nested structure
};

export const getMotorcycleById = async (id: number): Promise<Motorcycle> => {
    const response = await api.get<{ success: boolean; data: Motorcycle }>(`/motorcycles/${id}`);
    return response.data.data; // Extract data from nested structure
};

export const createMotorcycle = async (data: CreateMotorcycleDto): Promise<Motorcycle> => {
    const response = await api.post<Motorcycle>('/motorcycles', data);
    return response.data;
};

export const updateMotorcycle = async (id: number, data: Partial<CreateMotorcycleDto>): Promise<Motorcycle> => {
    const response = await api.put<Motorcycle>(`/motorcycles/${id}`, data);
    return response.data;
};

export const deleteMotorcycle = async (id: number): Promise<void> => {
    await api.delete(`/motorcycles/${id}`);
};
