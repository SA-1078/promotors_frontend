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


export const getPublicFaqs = async (): Promise<Faq[]> => {
    const response = await api.get('/faq');
    return response.data.data;
};


export const getAllFaqs = async (page = 1, limit = 20, search = ''): Promise<any> => {
    const response = await api.get('/faq/admin', {
        params: { page, limit, search }
    });
    return response.data.data;
};


export const getFaq = async (id: number): Promise<Faq> => {
    const response = await api.get(`/faq/${id}`);
    return response.data.data;
};


export const createFaq = async (data: CreateFaqDto): Promise<Faq> => {
    const response = await api.post('/faq', data);
    return response.data.data;
};


export const updateFaq = async (id: number, data: UpdateFaqDto): Promise<Faq> => {
    const response = await api.put(`/faq/${id}`, data);
    return response.data.data;
};


export const deleteFaq = async (id: number): Promise<void> => {
    await api.delete(`/faq/${id}`);
};
