import { api } from './api';
import type { SystemLog } from '../types';

export const systemLogsService = {
    getAll: async () => {
        const response = await api.get('/system-logs');
        console.log('[SystemLogs] API Response:', response.data);
        if (Array.isArray(response.data)) {
            return response.data;
        }
        return response.data.data || [];
    },

    getByUser: async (userId: number) => {
        const response = await api.get<{ success: boolean; data: SystemLog[] }>(`/system-logs/user/${userId}`);
        return response.data.data;
    }
};
