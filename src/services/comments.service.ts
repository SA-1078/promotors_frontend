import { api } from './api';
import type { Comment } from '../types';

export const commentsService = {
    getAll: async () => {
        const response = await api.get<{ success: boolean; data: Comment[] }>('/comments');
        return response.data.data;
    },

    create: async (data: { usuario_id: number; motocicleta_id: number; comentario: string; calificacion: number }) => {
        const response = await api.post<{ success: boolean; data: any }>('/comments', data);
        return response.data;
    },

    update: async (id: string, data: { comentario: string; calificacion: number }) => {
        const response = await api.put<{ success: boolean; data: any }>(`/comments/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<{ success: boolean; data: any }>(`/comments/${id}`);
        return response.data;
    }
};
