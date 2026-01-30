import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { salesService } from '../../services/sales.service';
import type { Sale } from '../../types';

export default function ClientDashboard() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Sale[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        loadOrderStats();
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

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <div className="mb-8 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-3 animate-fade-in">
                    Bienvenido, {user?.nombre}
                </h1>
                <p className="text-gray-400 text-lg">
                    Panel de Cliente
                </p>
            </div>

            {/* Statistics Cards */}
            {!loadingOrders && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-primary-900/50 to-dark-800 p-6 rounded-2xl border border-primary-500/20 shadow-xl">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-primary-300 text-sm uppercase tracking-wider font-bold">Total Pedidos</p>
                            <svg className="w-8 h-8 text-primary-400/30" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold text-white">{orders.length}</p>
                        <p className="text-primary-300/70 text-xs mt-1">{completedOrders} completados</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-900/50 to-dark-800 p-6 rounded-2xl border border-green-500/20 shadow-xl">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-green-300 text-sm uppercase tracking-wider font-bold">Total Gastado</p>
                            <svg className="w-8 h-8 text-green-400/30" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold text-white">${totalSpent.toLocaleString()}</p>
                        <p className="text-green-300/70 text-xs mt-1">En {orders.length || 0} compras</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-900/50 to-dark-800 p-6 rounded-2xl border border-blue-500/20 shadow-xl">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-blue-300 text-sm uppercase tracking-wider font-bold">Última Compra</p>
                            <svg className="w-8 h-8 text-blue-400/30" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-2xl font-bold text-white">
                            {orders.length > 0
                                ? new Date(orders[0].fecha_venta).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
                                : 'N/A'
                            }
                        </p>
                        <p className="text-blue-300/70 text-xs mt-1">
                            {orders.length > 0
                                ? new Date(orders[0].fecha_venta).toLocaleDateString('es-ES', { year: 'numeric' })
                                : 'Sin pedidos'
                            }
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Card */}
                <div className="bg-dark-800 p-8 rounded-2xl border border-dark-700 shadow-xl relative overflow-hidden group hover:border-primary-500/50 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                        <svg className="w-32 h-32 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-6">Mi Perfil</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-500 text-sm uppercase tracking-wider font-bold">Email</label>
                                <p className="text-xl text-white font-medium">{user?.email}</p>
                            </div>
                            <div>
                                <label className="text-gray-500 text-sm uppercase tracking-wider font-bold">Nombre</label>
                                <p className="text-xl text-white font-medium capitalize">{user?.nombre}</p>
                            </div>
                            <div className="pt-4">
                                <span className="inline-block px-3 py-1 bg-primary-900/50 text-primary-400 rounded-full text-sm font-bold border border-primary-500/20">
                                    Cliente Registrado
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History & Actions Card */}
                <div className="space-y-6">
                    <Link to="/client/orders" className="block group">
                        <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 shadow-xl hover:bg-dark-750 transition-all duration-300 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">Mis Pedidos</h2>
                                <p className="text-gray-400 text-sm">Ver historial de compras</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {!loadingOrders && orders.length > 0 && (
                                    <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {orders.length}
                                    </span>
                                )}
                                <div className="w-12 h-12 bg-dark-700 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link to="/client/history" className="block group">
                        <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 shadow-xl hover:bg-dark-750 transition-all duration-300 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">Mi Actividad</h2>
                                <p className="text-gray-400 text-sm">Motos vistas y búsquedas</p>
                            </div>
                            <div className="w-12 h-12 bg-dark-700 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link to="/" className="block group">
                        <div className="bg-gradient-to-r from-primary-900/50 to-dark-800 p-6 rounded-2xl border border-primary-500/20 shadow-xl hover:border-primary-500/40 transition-all duration-300 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Explorar Catálogo</h2>
                                <p className="text-primary-200/70 text-sm">Buscar nuevas motocicletas</p>
                            </div>
                            <div className="w-12 h-12 bg-primary-600/20 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                                <svg className="w-6 h-6 text-primary-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
