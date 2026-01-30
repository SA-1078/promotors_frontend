import { api } from './api';

export interface Faq {
    id_faq: number;
    pregunta: string;
    respuesta: string;
    categoria?: string;
    orden: number;
    activo: boolean;
    fechaCreacion: string;
    fechaActualizacion: string;
}

export interface CreateFaqDto {
    pregunta: string;
    respuesta: string;
    categoria?: string;
    orden?: number;
    activo?: boolean;
}

export interface UpdateFaqDto {
    pregunta?: string;
    respuesta?: string;
    categoria?: string;
    orden?: number;
    activo?: boolean;
}

// Public - Get all active FAQs
export const getPublicFaqs = async (): Promise<Faq[]> => {
    const response = await api.get('/faq');
    return response.data.data;
};

// Admin - Get all FAQs (with pagination)
export const getAllFaqs = async (page = 1, limit = 20, search = ''): Promise<any> => {
    const response = await api.get('/faq/admin', {
        params: { page, limit, search }
    });
    return response.data.data;
};

// Admin - Get single FAQ
export const getFaq = async (id: number): Promise<Faq> => {
    const response = await api.get(`/faq/${id}`);
    return response.data.data;
};

// Admin - Create FAQ
export const createFaq = async (data: CreateFaqDto): Promise<Faq> => {
    const response = await api.post('/faq', data);
    return response.data.data;
};

// Admin - Update FAQ
export const updateFaq = async (id: number, data: UpdateFaqDto): Promise<Faq> => {
    const response = await api.put(`/faq/${id}`, data);
    return response.data.data;
};

// Admin - Delete FAQ
export const deleteFaq = async (id: number): Promise<void> => {
    await api.delete(`/faq/${id}`);
};
