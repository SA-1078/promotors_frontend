import { api } from './api';
import type { Cart, AddToCartDto } from '../types';

export const getCart = async (userId: number): Promise<Cart | null> => {
    try {
        const response = await api.get<Cart>(`/carts/${userId}`);
        return response.data;
    } catch (error) {
        return null;
    }
};

export const addToCart = async (data: AddToCartDto): Promise<Cart> => {
    const response = await api.post<Cart>('/carts', data);
    return response.data;
};

export const updateCartItem = async (
    userId: number,
    motoId: number,
    cantidad: number
): Promise<Cart> => {
    const response = await api.put<Cart>(`/carts/${userId}/items/${motoId}`, { cantidad });
    return response.data;
};

export const removeFromCart = async (userId: number, motoId: number): Promise<Cart> => {
    const response = await api.delete<Cart>(`/carts/${userId}/items/${motoId}`);
    return response.data;
};

export const clearCart = async (userId: number): Promise<void> => {
    await api.delete(`/carts/${userId}`);
};
