import { api } from './api';
import type { CartItem } from '../types';

export const paypalService = {
    /**
     * Creates a PayPal order corresponding to the cart items.
     * This creates a Pending Sale in the backend and returns the PayPal approval URL.
     */
    createPayPalOrder: async (cartItems: CartItem[], userId: number, total: number) => {
        // Construct the Sale data expected by CreateSaleDto
        const saleData = {
            id_usuario: userId,
            total: total,
            metodo_pago: 'PayPal',
            estado: 'PENDIENTE',
            detalles: cartItems.map(item => ({
                id_moto: item.id_moto,
                cantidad: item.quantity,
                precio_unitario: item.precio
            }))
        };

        const returnUrl = `${window.location.origin}/pago-exitoso`;
        const cancelUrl = `${window.location.origin}/pago-cancelado`;

        const response = await api.post<{ saleId: number; paypalOrderId: string; approvalUrl: string }>(
            '/paypal/create-order',
            {
                saleData,
                returnUrl,
                cancelUrl
            }
        );

        return response.data;
    },

    /**
     * Captures the PayPal order after the user returns from PayPal.
     */
    capturePayPalOrder: async (paypalOrderId: string, internalSaleId: number) => {
        const response = await api.post<{ success: boolean; status: string; saleId: number }>(
            '/paypal/capture-order',
            {
                paypalOrderId,
                internalSaleId
            }
        );
        return response.data;
    }
};
