import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/format';
import { salesService } from '../../services/sales.service';
import { paypalService } from '../../services/paypal.service';

type PaymentMethod = 'Efectivo' | 'PayPal' | 'Transferencia';
type PaymentMethodOption = { value: PaymentMethod; label: string; icon: React.ReactNode; description: string };

export default function PaymentSelection() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items, total, clearCart } = useCart();
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('Efectivo');
    const [isProcessing, setIsProcessing] = useState(false);

    const paymentMethods: PaymentMethodOption[] = [
        {
            value: 'Efectivo',
            label: 'Efectivo',
            description: 'Pago en efectivo al recibir tu motocicleta',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            value: 'PayPal',
            label: 'PayPal',
            description: 'Pago seguro con tu cuenta PayPal',
            icon: (
                <svg className="h-8" viewBox="0 0 50 32" fill="currentColor">
                    <path d="M12.936 10.278H18.528C21.492 10.278 23.364 11.754 23.952 14.73C24.186 15.936 23.97 17.16 23.238 18.156C22.254 19.536 20.61 20.352 18.912 20.352H15.198L14.28 26.136L14.124 27.132C14.076 27.42 13.842 27.636 13.56 27.636H9.378C9.096 27.636 8.88 27.384 8.928 27.096L10.602 16.518L11.538 10.614C11.586 10.374 11.79 10.206 12.03 10.206L12.936 10.278Z" />
                </svg>
            ),
        },
        {
            value: 'Transferencia',
            label: 'Transferencia Bancaria',
            description: 'Transferencia directa a nuestra cuenta',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
        },
    ];

    const handleConfirmPayment = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (items.length === 0) {
            alert('Tu carrito está vacío');
            navigate('/motorcycles');
            return;
        }

        setIsProcessing(true);

        try {
            if (selectedMethod === 'PayPal') {
                // Use PayPal flow
                const response = await paypalService.createPayPalOrder(items, user.id_usuario, total);
                window.location.href = response.approvalUrl;
            } else {
                // Create direct sale for cash/transfer
                const response = await salesService.createDirectSale(
                    user.id_usuario,
                    items,
                    selectedMethod,
                    total
                );

                // Clear cart
                clearCart();

                // Navigate to success page with sale info
                navigate('/payment-success', {
                    state: {
                        saleId: response.data.id_venta,
                        paymentMethod: selectedMethod,
                    },
                });
            }
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Error al procesar el pago. Por favor intenta de nuevo.');
            setIsProcessing(false);
        }
    };

    const subtotal = total;
    const tax = total * 0.12; // 12% IVA
    const totalWithTax = subtotal + tax;

    return (
        <div className="min-h-screen bg-dark-950 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2">Método de Pago</h1>
                    <p className="text-gray-400">Selecciona cómo deseas pagar tu pedido</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Method Selection */}
                    <div className="lg:col-span-2">
                        <div className="bg-dark-900 rounded-2xl p-6 border border-dark-700">
                            <h2 className="text-xl font-bold text-white mb-6">Selecciona Método</h2>

                            <div className="space-y-4">
                                {paymentMethods.map((method) => (
                                    <button
                                        key={method.value}
                                        onClick={() => setSelectedMethod(method.value)}
                                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${selectedMethod === method.value
                                            ? 'border-primary-500 bg-primary-500/10'
                                            : 'border-dark-700 bg-dark-800 hover:border-dark-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`flex-shrink-0 ${selectedMethod === method.value
                                                    ? 'text-primary-400'
                                                    : 'text-gray-400'
                                                    }`}
                                            >
                                                {method.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-white mb-1">{method.label}</h3>
                                                <p className="text-sm text-gray-400">{method.description}</p>
                                            </div>
                                            <div
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.value
                                                    ? 'border-primary-500'
                                                    : 'border-dark-600'
                                                    }`}
                                            >
                                                {selectedMethod === method.value && (
                                                    <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Bank Details for Transfer */}
                            {selectedMethod === 'Transferencia' && (
                                <div className="mt-6 p-4 bg-dark-800 rounded-xl border border-dark-700">
                                    <h4 className="font-bold text-white mb-3">Datos Bancarios</h4>
                                    <div className="space-y-2 text-sm">
                                        <p className="text-gray-400">
                                            <span className="text-white font-medium">Banco:</span> Banco Pichincha
                                        </p>
                                        <p className="text-gray-400">
                                            <span className="text-white font-medium">Cuenta:</span> 1234567890
                                        </p>
                                        <p className="text-gray-400">
                                            <span className="text-white font-medium">Beneficiario:</span> MotoRShop S.A.
                                        </p>
                                        <p className="text-gray-400">
                                            <span className="text-white font-medium">RUC:</span> 1234567890001
                                        </p>
                                    </div>
                                    <p className="text-xs text-yellow-400 mt-3">
                                        ⚠️ Por favor realiza la transferencia y envíanos el comprobante a nuestro WhatsApp
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-dark-900 rounded-2xl p-6 border border-dark-700 sticky top-4">
                            <h2 className="text-xl font-bold text-white mb-6">Resumen del Pedido</h2>

                            {/* Items */}
                            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.id_moto} className="flex gap-3">
                                        <div className="w-16 h-16 bg-dark-800 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.imagen_url ? (
                                                <img
                                                    src={item.imagen_url}
                                                    alt={item.nombre}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-white truncate">{item.nombre}</h4>
                                            <p className="text-xs text-gray-400">Cantidad: {item.quantity}</p>
                                            <p className="text-sm text-primary-400 font-medium">
                                                {formatCurrency(Number(item.precio) * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-dark-700 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-white">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">IVA (12%)</span>
                                    <span className="text-white">{formatCurrency(tax)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t border-dark-700 pt-2">
                                    <span className="gradient-text">Total</span>
                                    <span className="gradient-text">{formatCurrency(totalWithTax)}</span>
                                </div>
                            </div>

                            {/* Confirm Button */}
                            <button
                                onClick={handleConfirmPayment}
                                disabled={isProcessing}
                                className={`w-full btn-primary mt-6 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Procesando...
                                    </>
                                ) : (
                                    'Confirmar Pago'
                                )}
                            </button>

                            <button
                                onClick={() => navigate(-1)}
                                className="w-full btn-ghost mt-3"
                            >
                                Volver al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
