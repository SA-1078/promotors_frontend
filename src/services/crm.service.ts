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

    getLeads: async () => {
        const response = await api.get('/crm?limit=50');
        return response.data;
    }
};
