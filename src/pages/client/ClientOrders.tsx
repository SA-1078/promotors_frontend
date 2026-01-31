import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { salesService } from '../../services/sales.service';
import { facturasService } from '../../services/facturas.service';
import type { Sale } from '../../types';
import { Card } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/format';

export default function ClientOrders() {
    const [orders, setOrders] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await salesService.getMyOrders();
            setOrders(data);
        } catch (err: any) {
            console.error('Error loading orders:', err);
            setError(err.response?.data?.message || 'Error al cargar tus pedidos');
        } finally {
            setLoading(false);
        }
    };

    const getTotalItems = (order: Sale) => {
        return order.detalles?.reduce((sum, detail) => sum + detail.cantidad, 0) || 0;
    };

    const handleDownloadInvoice = async (saleId: number) => {
        try {
            setDownloadingId(saleId);
            const blob = await facturasService.downloadFactura(saleId);

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `factura-${saleId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            alert('Error al descargar la factura');
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <Link to="/client" className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-3xl font-display font-bold gradient-text animate-fade-in">
                        Mis Pedidos
                    </h1>
                </div>
                <p className="text-gray-400 pl-9">
                    Historial completo de tus compras.
                </p>
            </div>

            {loading && (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            )}

            {error && (
                <Card variant="outline" className="p-6 border-accent-red/50 text-center mb-8 bg-accent-red/5">
                    <p className="text-accent-red font-medium">{error}</p>
                </Card>
            )}

            {!loading && !error && (
                <>
                    {orders.length === 0 ? (
                        <Card variant="glass" className="border-dark-700 shadow-xl">
                            <div className="p-12 text-center">
                                <div className="w-20 h-20 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No hay pedidos</h3>
                                <p className="text-gray-400 mb-6">Aún no has realizado ninguna compra.</p>
                                <Link to="/" className="btn-primary inline-block">
                                    Explorar Catálogo
                                </Link>
                            </div>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <Card key={order.id_venta} variant="glass" className="overflow-hidden border-dark-700 shadow-xl hover:border-primary-500/50 transition-all duration-300">
                                    {/* Header Section */}
                                    <div className="bg-gradient-to-r from-primary-600/10 to-primary-500/5 border-b border-dark-700 p-3 md:p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 md:gap-4">
                                            <div className="flex items-center gap-2 md:gap-4">
                                                <div className="bg-primary-500/20 rounded-lg p-2 md:p-3">
                                                    <svg className="w-5 h-5 md:w-6 md:h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg md:text-2xl font-bold text-white mb-0.5 md:mb-1">
                                                        Pedido #{String(order.id_venta).padStart(6, '0')}
                                                    </h3>
                                                    <p className="text-gray-400 text-xs md:text-sm flex items-center gap-1.5 md:gap-2">
                                                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {new Date(order.fecha_venta).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-3">
                                                <div className="text-left sm:text-right">
                                                    <p className="text-xs md:text-sm text-gray-500">Total</p>
                                                    <p className="text-xl md:text-3xl font-bold text-primary-400">
                                                        {formatCurrency(order.total)}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDownloadInvoice(order.id_venta)}
                                                    disabled={downloadingId === order.id_venta}
                                                    className={`btn-secondary px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm flex items-center gap-1.5 md:gap-2 whitespace-nowrap ${downloadingId === order.id_venta ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                >
                                                    {downloadingId === order.id_venta ? (
                                                        <>
                                                            <svg className="animate-spin h-3.5 w-3.5 md:h-4 md:w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            <span className="hidden sm:inline">Descargando...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span className="hidden sm:inline">Factura PDF</span>
                                                            <span className="sm:hidden">PDF</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6">
                                        {/* Order Info Cards */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                            <div className="bg-dark-800/50 rounded-lg p-4 border border-dark-700/50 hover:border-blue-500/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-blue-500/20 rounded-lg p-2.5 flex-shrink-0">
                                                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs text-gray-500 mb-0.5">Productos</p>
                                                        <p className="text-white font-bold text-lg">{getTotalItems(order)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-dark-800/50 rounded-lg p-4 border border-dark-700/50 hover:border-green-500/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-green-500/20 rounded-lg p-2.5 flex-shrink-0">
                                                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                        </svg>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs text-gray-500 mb-0.5">Pago</p>
                                                        <p className="text-white font-bold text-sm md:text-base truncate capitalize">{order.metodo_pago}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-dark-800/50 rounded-lg p-4 border border-dark-700/50 hover:border-orange-500/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-orange-500/20 rounded-lg p-2.5 flex-shrink-0">
                                                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs text-gray-500 mb-0.5">Estado</p>
                                                        <p className="text-white font-bold text-sm md:text-base truncate capitalize">{order.estado}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Products List */}
                                        {order.detalles && order.detalles.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                                    </svg>
                                                    Detalle del Pedido
                                                </h4>
                                                <div className="space-y-3">
                                                    {order.detalles.map((detail) => (
                                                        <div key={detail.id_detalle} className="flex items-center gap-4 bg-dark-800/30 p-3 rounded-lg border border-dark-700/50 hover:border-dark-600 transition-colors">
                                                            {detail.motocicleta?.imagen_url && (
                                                                <div className="w-16 h-14 bg-dark-700 rounded-lg overflow-hidden flex-shrink-0">
                                                                    <img
                                                                        src={detail.motocicleta.imagen_url}
                                                                        alt={detail.motocicleta.nombre}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-white font-semibold text-sm mb-1 truncate">
                                                                    {detail.motocicleta?.nombre || `Moto ID: ${detail.id_moto}`}
                                                                </p>
                                                                <p className="text-gray-400 text-xs">
                                                                    Cantidad: <span className="text-primary-400 font-medium">{detail.cantidad}</span> × {formatCurrency(detail.precio_unitario)}
                                                                </p>
                                                            </div>
                                                            <div className="text-right flex-shrink-0">
                                                                <p className="text-primary-400 font-bold text-base">
                                                                    {formatCurrency(detail.subtotal)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
