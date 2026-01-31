import { api } from './api';

export const facturasService = {
    downloadFactura: async (saleId: number): Promise<Blob> => {
        const response = await api.get(`/facturas/download/${saleId}`, {
            responseType: 'blob',
        });
        return response.data;
    },

    generateFactura: async (saleId: number) => {
        const response = await api.post('/facturas/generate', { saleId });
        return response.data;
    },
};
