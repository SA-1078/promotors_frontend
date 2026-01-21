import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/format';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { paypalService } from '../../services/paypal.service';

export default function CartDrawer() {
    const { items, removeFromCart, updateQuantity, total, isCartOpen, setIsCartOpen } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isCartOpen) return null;

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            setIsCartOpen(false);
            return;
        }

        try {
            setIsProcessing(true);
            const response = await paypalService.createPayPalOrder(items, user.id_usuario, total);

            // Redirect to PayPal
            window.location.href = response.approvalUrl;
        } catch (error) {
            console.error('Checkout failed', error);
            alert('Error al iniciar el pago con PayPal');
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
                <div className="flex-1 flex flex-col bg-dark-900 shadow-2xl border-l border-dark-700 animate-slide-in-right">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-dark-700">
                        <h2 className="text-xl font-display font-bold text-white">Tu Carrito</h2>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {items.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p className="text-gray-400">Tu carrito está vacío</p>
                                <Link
                                    to="/motorcycles"
                                    onClick={() => setIsCartOpen(false)}
                                    className="btn-secondary mt-4 w-full block text-center py-2"
                                >
                                    Ver Catálogo
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.id_moto} className="flex gap-4">
                                        <div className="w-24 h-24 bg-dark-800 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.imagen_url ? (
                                                <img
                                                    src={item.imagen_url}
                                                    alt={item.nombre}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-white mb-1">{item.nombre}</h3>
                                            <p className="text-primary-400 font-medium mb-2">
                                                {formatCurrency(Number(item.precio))}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 border border-dark-700 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id_moto, item.quantity - 1)}
                                                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id_moto, item.quantity + 1)}
                                                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id_moto)}
                                                    className="text-red-400 hover:text-red-300 text-sm"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="p-6 border-t border-dark-700 bg-dark-800">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-400">Total</span>
                                <span className="text-2xl font-bold gradient-text">
                                    {formatCurrency(total)}
                                </span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className={`w-full btn-primary mb-3 flex items-center justify-center ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Procesando con PayPal...
                                    </>
                                ) : (
                                    <>
                                        <span className="mr-2">Pagar con</span>
                                        <svg className="h-6" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.936 10.278H18.528C21.492 10.278 23.364 11.754 23.952 14.73C24.186 15.936 23.97 17.16 23.238 18.156C22.254 19.536 20.61 20.352 18.912 20.352H15.198L14.28 26.136L14.124 27.132C14.076 27.42 13.842 27.636 13.56 27.636H9.378C9.096 27.636 8.88 27.384 8.928 27.096L10.602 16.518L11.538 10.614C11.586 10.374 11.79 10.206 12.03 10.206L12.936 10.278Z" fill="white" />
                                            <path d="M40.936 10.278H46.528C49.492 10.278 51.364 11.754 51.952 14.73C52.186 15.936 51.97 17.16 51.238 18.156C50.254 19.536 48.61 20.352 46.912 20.352H43.198L42.28 26.136L42.124 27.132C42.076 27.42 41.842 27.636 41.56 27.636H37.378C37.096 27.636 36.88 27.384 36.928 27.096L38.602 16.518L39.538 10.614C39.586 10.374 39.79 10.206 40.03 10.206L40.936 10.278Z" fill="white" />
                                        </svg>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="w-full btn-ghost text-sm"
                            >
                                Seguir Comprando
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
