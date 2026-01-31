import { api } from './api';
import type { Sale } from '../types';

export const salesService = {
    getMyOrders: async (): Promise<Sale[]> => {
        const response = await api.get<{ success: boolean; data: Sale[] }>('/sales/my-orders');
        return response.data.data;
    },

    getSales: async (params?: { page?: number; limit?: number; search?: string }) => {
        try {
            const response = await api.get<{ success: boolean; data: { items: Sale[] } | Sale[] }>('/sales', { params });
            if (response.data && 'data' in response.data) {
                const data = response.data.data;
                if (Array.isArray(data)) return data;
                if (data && 'items' in data && Array.isArray(data.items)) return data.items;
            }
            return [];
        } catch (error) {
            console.error('Error fetching sales:', error);
            return [];
        }
    },

    getSaleById: async (id: number) => {
        const response = await api.get<{ success: boolean; data: Sale }>(`/sales/${id}`);
        return response.data.data;
    },

    updateSaleStatus: async (id: number, status: string) => {
        const response = await api.put(`/sales/${id}`, { estado: status });
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/sales/${id}`);
        return response.data;
    },

    /**
     * Create a direct sale (for cash/transfer payments)
     */
    createDirectSale: async (userId: number, cartItems: any[], paymentMethod: string, total: number) => {
        const payload = {
            id_usuario: userId,
            total,
            metodo_pago: paymentMethod,
            estado: 'Completado', // Direct sales are immediately completed
            detalles: cartItems.map(item => {
                const precio = Number(item.precio);
                const cantidad = item.quantity;
                return {
                    id_moto: item.id_moto,
                    cantidad,
                    precio_unitario: precio,
                    subtotal: precio * cantidad,
                };
            }),
        };

        const response = await api.post('/sales', payload);
        return response.data;
    },

    /**
     * Complete a sale (mark as Completado)
     */
    completeSale: async (saleId: number) => {
        const response = await api.post(`/sales/${saleId}/complete`);
        return response.data;
    },
};

