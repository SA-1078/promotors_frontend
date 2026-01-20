import { api } from './api';
import type { Category, CreateCategoryDto } from '../types';

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get<{ success: boolean; data: { items: Category[] } }>('/categories');
    return response.data.data.items; // Extract items from nested structure
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

export const deleteCategory = async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
};
