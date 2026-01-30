import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { salesService } from '../../services/sales.service';
import type { Sale } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/format';

export default function ClientOrders() {
    const [orders, setOrders] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const getStatusBadge = (estado: string) => {
        const normalizedStatus = estado.toLowerCase();
        if (normalizedStatus.includes('completad') || normalizedStatus.includes('pagad')) {
            return <Badge variant="success" size="sm">Completado</Badge>;
        }
        if (normalizedStatus.includes('pendiente')) {
            return <Badge variant="warning" size="sm">Pendiente</Badge>;
        }
        if (normalizedStatus.includes('cancelad')) {
            return <Badge variant="danger" size="sm">Cancelado</Badge>;
        }
        return <Badge variant="info" size="sm">{estado}</Badge>;
    };

    const getTotalItems = (order: Sale) => {
        return order.detalles?.reduce((sum, detail) => sum + detail.cantidad, 0) || 0;
    };

    return (
        <div className="p-4 sm:p-8 max-w-6xl mx-auto">
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
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <Card key={order.id_venta} variant="glass" className="overflow-hidden border-dark-700 shadow-xl hover:border-dark-600 transition-all duration-300">
                                    <div className="p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-white">
                                                        Pedido #{order.id_venta}
                                                    </h3>
                                                    {getStatusBadge(order.estado)}
                                                </div>
                                                <p className="text-gray-400 text-sm">
                                                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                            <div className="text-left sm:text-right">
                                                <p className="text-sm text-gray-500 mb-1">Total</p>
                                                <p className="text-2xl font-bold text-primary-400">
                                                    {formatCurrency(order.total)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="border-t border-dark-700 pt-4 mt-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Productos</p>
                                                    <p className="text-white font-medium">{getTotalItems(order)} items</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Método de Pago</p>
                                                    <p className="text-white font-medium capitalize">{order.metodo_pago}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Estado</p>
                                                    <p className="text-white font-medium capitalize">{order.estado}</p>
                                                </div>
                                            </div>

                                            {order.detalles && order.detalles.length > 0 && (
                                                <div className="mt-4">
                                                    <p className="text-xs text-gray-500 mb-3 font-bold uppercase tracking-wider">Productos</p>
                                                    <div className="space-y-2">
                                                        {order.detalles.map((detail) => (
                                                            <div key={detail.id_detalle} className="flex items-center gap-3 bg-dark-800/50 p-3 rounded-lg">
                                                                {detail.motocicleta?.imagen_url && (
                                                                    <div className="w-16 h-12 bg-dark-700 rounded overflow-hidden flex-shrink-0">
                                                                        <img
                                                                            src={detail.motocicleta.imagen_url}
                                                                            alt={detail.motocicleta.nombre}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                )}
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-white font-medium truncate">
                                                                        {detail.motocicleta?.nombre || `Moto ID: ${detail.id_moto}`}
                                                                    </p>
                                                                    <p className="text-gray-400 text-sm">
                                                                        {detail.cantidad} x {formatCurrency(detail.precio_unitario)}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-primary-400 font-bold">
                                                                        {formatCurrency(detail.subtotal)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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
