import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { paypalService } from '../../services/paypal.service';
import { useCart } from '../../context/CartContext';

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigated = useNavigate();
    const { clearCart } = useCart();

    const token = searchParams.get('token'); // PayPal Order ID
    const internalSaleId = searchParams.get('internalSaleId'); // Our Sale ID

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        if (!token || !internalSaleId) {
            setStatus('error');
            return;
        }

        const capturePayment = async () => {
            try {
                const response = await paypalService.capturePayPalOrder(token, Number(internalSaleId));
                if (response.success && response.status === 'COMPLETED') {
                    setStatus('success');
                    clearCart();
                } else {
                    setStatus('error');
                }
            } catch (error) {
                console.error('Payment capture failed', error);
                setStatus('error');
            }
        };

        capturePayment();
    }, [token, internalSaleId]);

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
            <div className="card max-w-lg w-full p-8 text-center">
                {status === 'loading' && (
                    <div className="py-12">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mb-6"></div>
                        <h2 className="text-2xl font-bold text-white mb-2">Procesando tu pago...</h2>
                        <p className="text-gray-400">Por favor, no cierres esta ventana.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="py-8 animate-fade-in">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold gradient-text mb-4">¡Pago Exitoso!</h1>
                        <p className="text-gray-300 text-lg mb-8">
                            Tu compra ha sido confirmada. Hemos enviado los detalles a tu correo electrónico.
                        </p>

                        <div className="bg-dark-800 rounded-lg p-4 mb-8 text-left border border-dark-700">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Referencia de Orden:</span>
                                <span className="text-white font-mono">{internalSaleId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Referencia PayPal:</span>
                                <span className="text-white font-mono text-sm">{token}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Link to="/motorcycles" className="btn-primary w-full">
                                Seguir Comprando
                            </Link>
                            <Link to="/" className="btn-ghost w-full">
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="py-8 animate-fade-in">
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">Error en el Pago</h1>
                        <p className="text-gray-400 mb-8">
                            Hubo un problema al procesar tu pago. Por favor, intenta nuevamente o contacta a soporte.
                        </p>
                        <Link to="/cart" className="btn-secondary">
                            Volver al Carrito
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
