import { api } from './api';
import type { Category, CreateCategoryDto } from '../types';

export const getCategories = async (options?: { withDeleted?: boolean; page?: number }): Promise<Category[]> => {
    const params: any = {};
    if (options?.withDeleted) params.withDeleted = 'true';
    if (options?.page) params.page = options.page;
    const response = await api.get<{ success: boolean; data: { items: Category[] } }>('/categories', { params });
    return response.data.data.items;
};

export const getCategoryById = async (id: number): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
};

export const createCategory = async (data: CreateCategoryDto): Promise<Category> => {
    const response = await api.post<Category>('/categories', data);
    return response.data;
};

export const updateCategory = async (id: number, data: Partial<CreateCategoryDto>): Promise<Category> => {
    const response = await api.put<Category>(`/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id: number, type: 'soft' | 'hard' = 'soft'): Promise<void> => {
    await api.delete(`/categories/${id}`, { params: { type } });
};

export const restoreCategory = async (id: number): Promise<Category> => {
    const response = await api.post<Category>(`/categories/${id}/restore`);
    return response.data;
};
