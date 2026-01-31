import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Motorcycle } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
    items: CartItem[];
    addToCart: (motorcycle: Motorcycle) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    total: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();

    // Generar clave de localStorage específica por usuario
    const getCartKey = () => {
        return user ? `cart_items_${user.id_usuario}` : 'cart_items_guest';
    };

    const [items, setItems] = useState<CartItem[]>(() => {
        const cartKey = user ? `cart_items_${user.id_usuario}` : 'cart_items_guest';
        const saved = localStorage.getItem(cartKey);
        return saved ? JSON.parse(saved) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // Guardar carrito en localStorage cuando cambie
    useEffect(() => {
        const cartKey = getCartKey();
        localStorage.setItem(cartKey, JSON.stringify(items));
    }, [items, user?.id_usuario]);

    // Cargar carrito correcto cuando cambie el usuario
    useEffect(() => {
        const cartKey = getCartKey();
        const saved = localStorage.getItem(cartKey);
        setItems(saved ? JSON.parse(saved) : []);
    }, [user?.id_usuario]);

    const addToCart = (motorcycle: Motorcycle) => {
        setItems(current => {
            const existing = current.find(item => item.id_moto === motorcycle.id_moto);
            if (existing) {
                return current.map(item =>
                    item.id_moto === motorcycle.id_moto
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...current, { ...motorcycle, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: number) => {
        setItems(current => current.filter(item => item.id_moto !== id));
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity < 1) return;
        setItems(current =>
            current.map(item =>
                item.id_moto === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce((sum, item) => sum + (Number(item.precio) * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isCartOpen,
            setIsCartOpen,
            total,
            itemCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
