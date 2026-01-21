import { api } from './api';
import type { Comment } from '../types';

export const commentsService = {
    getAll: async () => {
        const response = await api.get<{ success: boolean; data: Comment[] }>('/comments');
        return response.data.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<{ success: boolean; data: any }>(`/comments/${id}`);
        return response.data;
    }
};
