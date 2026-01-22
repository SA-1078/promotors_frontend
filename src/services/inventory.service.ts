import { api } from './api';
import type { UpdateInventoryDto } from '../types';

export const inventoryService = {
    getInventory: async (params?: { search?: string; withDeleted?: boolean }) => {
        try {
            const [inventoryResponse, motorcyclesResponse] = await Promise.all([
                api.get('/inventory', { params }),
                api.get<{ success: boolean; data: { items: any[] } }>('/motorcycles', { params })
            ]);

            const inventoryItems = (inventoryResponse.data && inventoryResponse.data.data && Array.isArray(inventoryResponse.data.data.items))
                ? inventoryResponse.data.data.items
                : [];

            const allMotorcycles = (motorcyclesResponse.data && motorcyclesResponse.data.data && Array.isArray(motorcyclesResponse.data.data.items))
                ? motorcyclesResponse.data.data.items
                : [];

            // Merge data: Use motorcycles as the base source of truth
            return allMotorcycles.map((moto: any) => {
                const inventoryItem = inventoryItems.find((inv: any) => inv.id_moto === moto.id_moto);

                return {
                    id_inventario: inventoryItem?.id_inventario || 0,
                    id_moto: moto.id_moto,
                    cantidad_stock: inventoryItem?.cantidad_stock ?? inventoryItem?.stock ?? inventoryItem?.stock_actual ?? 0,
                    fecha_actualizacion: inventoryItem?.fecha_actualizacion || new Date().toISOString(),
                    motocicleta: moto
                };
            });
        } catch (error) {
            return [];
        }
    },

    createInventory: async (data: any) => {
        const response = await api.post('/inventory', data);
        return response.data;
    },

    updateStock: async (id: number, data: UpdateInventoryDto) => {
        const response = await api.put(`/inventory/${id}`, data);
        return response.data;
    },

    getStockByMotoId: async (id: number) => {
        const response = await api.get(`/inventory/${id}`);
        return response.data;
    }
};
