import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { salesService } from '../../services/sales.service';
import { StatCard } from '../../components/dashboard/StatCard';
import { QuickActionCard } from '../../components/dashboard/QuickActionCard';
import type { Sale } from '../../types';

export default function ClientDashboard() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Sale[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        loadOrderStats();

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const loadOrderStats = async () => {
        try {
            const data = await salesService.getMyOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error loading order stats:', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const totalSpent = orders.reduce((sum, order) => {
        const orderTotal = typeof order.total === 'string' ? parseFloat(order.total) : order.total;
        return sum + (orderTotal || 0);
    }, 0);

    const completedOrders = orders.filter(o =>
        o.estado.toLowerCase().includes('completad') || o.estado.toLowerCase().includes('pagad')
    ).length;

    const lastOrder = orders.length > 0 ? orders[0] : null;
    const lastOrderDate = lastOrder ? new Date(lastOrder.fecha_venta).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
    }) : 'N/A';

    const formatTime = () => {
        return currentTime.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loadingOrders) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-10 h-10 bg-primary-500/20 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <p className="text-gray-400 animate-pulse">Cargando información...</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 animate-fade-in">
            {/* Welcome Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 p-[2px]">
                <div className="bg-dark-900 rounded-2xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-2">
                                👋 Bienvenido, {user?.nombre}
                            </h1>
                            <p className="text-gray-400 text-sm sm:text-base">
                                Tu panel de compras y favoritos
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                            <div>
                                <p className="text-xs text-gray-500">Actualizado</p>
                                <p className="text-sm font-medium text-gray-300 capitalize">{formatTime()}</p>
                            </div>
                            <button
                                onClick={loadOrderStats}
                                className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 border border-dark-600 transition-colors"
                                title="Actualizar datos"
                            >
                                <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <StatCard
                    title="Mis Pedidos"
                    value={orders.length}
                    subtitle={`${completedOrders} completados`}
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    }
                    variant="orders"
                />

                <StatCard
                    title="Total Gastado"
                    value={totalSpent}
                    subtitle={`En ${orders.length} compras`}
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    variant="revenue"
                    isCurrency
                />

                <StatCard
                    title="Última Compra"
                    value={orders.length}
                    subtitle={lastOrder ? lastOrderDate : 'Sin compras'}
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    }
                    variant="users"
                />
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                    ⚡ Accesos Rápidos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <QuickActionCard
                        title="Ver Catálogo"
                        description="Explorar motos"
                        to="/motorcycles"
                        variant="primary"
                        icon={
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        }
                    />

                    <QuickActionCard
                        title="Mis Pedidos"
                        description="Ver historial"
                        to="/client/orders"
                        variant="secondary"
                        icon={
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        }
                    />

                    <QuickActionCard
                        title="Mi Perfil"
                        description="Ver mi información"
                        to="/client/profile"
                        variant="success"
                        icon={
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        }
                    />
                </div>
            </div>

            {}
            {orders.length > 0 && (
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                        📦 Pedidos Recientes
                    </h2>
                    <div className="space-y-3">
                        {orders.slice(0, 3).map((order) => (
                            <div
                                key={order.id_venta}
                                className="bg-dark-800 border border-dark-700 rounded-xl p-4 hover:border-primary-500/50 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <p className="font-semibold text-white">
                                                Pedido #{order.id_venta}
                                            </p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${order.estado.toLowerCase().includes('completad') || order.estado.toLowerCase().includes('pagad')
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : order.estado.toLowerCase().includes('pendiente')
                                                        ? 'bg-yellow-500/20 text-yellow-400'
                                                        : 'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {order.estado}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            {new Date(order.fecha_venta).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-white">
                                            ${typeof order.total === 'string' ? parseFloat(order.total).toLocaleString() : order.total.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {orders.length > 3 && (
                        <div className="mt-4 text-center">
                            <a
                                href="/client/orders"
                                className="inline-flex items-center text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
                            >
                                Ver todos los pedidos
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    )}
                </div>
            )}

            {}
            {orders.length === 0 && (
                <div className="bg-gradient-to-r from-primary-500/10 to-orange-500/10 border border-primary-500/30 rounded-xl p-8 text-center">
                    <svg className="w-16 h-16 text-primary-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="text-xl font-bold text-white mb-2">¡Aún no has realizado compras!</h3>
                    <p className="text-gray-400 mb-6">
                        Explora nuestro catálogo y encuentra la motocicleta perfecta para ti
                    </p>
                    <a
                        href="/motorcycles"
                        className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Ver Catálogo
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            )}
        </div>
    );
}
