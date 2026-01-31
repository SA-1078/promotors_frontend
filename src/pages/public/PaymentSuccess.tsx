import { useEffect, useState } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { paypalService } from '../../services/paypal.service';
import { facturasService } from '../../services/facturas.service';
import { useCart } from '../../context/CartContext';

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const { clearCart } = useCart();

    const token = searchParams.get('token');
    const internalSaleId = searchParams.get('internalSaleId') || location.state?.saleId;
    const paymentMethod = location.state?.paymentMethod || 'PayPal';

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);

    useEffect(() => {
        if (token && internalSaleId) {
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
        } else if (internalSaleId) {
            setStatus('success');
        } else {
            setStatus('error');
        }
    }, [token, internalSaleId]);

    const handleDownloadInvoice = async () => {
        if (!internalSaleId) return;

        try {
            setIsDownloadingInvoice(true);
            const blob = await facturasService.downloadFactura(Number(internalSaleId));

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `factura-${internalSaleId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            alert('Error al descargar la factura');
        } finally {
            setIsDownloadingInvoice(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
            <div className="bg-dark-900 border border-dark-700 rounded-2xl max-w-lg w-full p-8 text-center">
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

                        <div className="bg-dark-800 rounded-lg p-4 mb-6 text-left border border-dark-700">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">N° de Orden:</span>
                                <span className="text-white font-mono">#{String(internalSaleId).padStart(6, '0')}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Método de Pago:</span>
                                <span className="text-white">{paymentMethod}</span>
                            </div>
                            {token && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Ref. PayPal:</span>
                                    <span className="text-white font-mono text-sm truncate max-w-[200px]">{token}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleDownloadInvoice}
                                disabled={isDownloadingInvoice}
                                className={`btn-primary w-full flex items-center justify-center gap-2 ${isDownloadingInvoice ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isDownloadingInvoice ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Descargando...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Descargar Factura PDF
                                    </>
                                )}
                            </button>
                            <Link to="/motorcycles" className="btn-secondary w-full">
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
                        <Link to="/motorcycles" className="btn-secondary">
                            Volver al Catálogo
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
