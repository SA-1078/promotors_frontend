import { api } from './api';
import type { Sale } from '../types';

export const salesService = {
    getMyOrders: async (): Promise<Sale[]> => {
        const response = await api.get<{ success: boolean; data: Sale[] }>('/sales/my-orders');
        return response.data.data;
    },

    getSales: async () => {
        try {
            const response = await api.get<{ success: boolean; data: Sale[] | { items: Sale[] } }>('/sales');
            // Handle potentially nested data structure similar to other endpoints
            if (response.data && 'data' in response.data) {
                const data = response.data.data;
                if (Array.isArray(data)) return data;
                if (data && 'items' in data && Array.isArray(data.items)) return data.items;
            }
            return []; // Fallback empty array
        } catch (error) {
            console.error('Error fetching sales:', error);
            return [];
        }
    },

    getSaleById: async (id: number) => {
        const response = await api.get<{ success: boolean; data: Sale }>(`/sales/${id}`);
        return response.data.data;
    },

    // Optional: Update status if supported by backend
    updateSaleStatus: async (id: number, status: string) => {
        const response = await api.put(`/sales/${id}`, { estado: status });
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/sales/${id}`);
        return response.data;
    }
};
