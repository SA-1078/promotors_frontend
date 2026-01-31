import { api } from './api';
import type { Lead } from '../types';

export interface CreateLeadDto {
    nombre: string;
    email: string;
    telefono: string;
    mensaje: string;
    estado?: string;
}

export const crmService = {
    createLead: async (data: CreateLeadDto) => {
        const response = await api.post<{ success: boolean; data: Lead }>('/crm', {
            ...data,
            estado: 'Nuevo' // Default status
        });
        return response.data;
    },

    getLeads: async (params?: { page?: number; limit?: number }) => {
        const response = await api.get('/crm', { params });
        return response.data;
    },

    updateLead: async (id: number, data: Partial<CreateLeadDto>) => {
        const response = await api.put<{ success: boolean; data: Lead }>(`/crm/${id}`, data);
        return response.data;
    },

    deleteLead: async (id: number) => {
        const response = await api.delete<{ success: boolean }>(`/crm/${id}`);
        return response.data;
    }
};
