import { useState, useEffect } from 'react';
import { reportsService } from '../../services/reports.service';
import { StatCard } from '../../components/dashboard/StatCard';
import { QuickActionCard } from '../../components/dashboard/QuickActionCard';

interface DashboardStats {
    totalSales: number;
    salesCount: number;
    motorcyclesCount: number;
    lowStockCount: number;
}

export default function EmployeeDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalSales: 0,
        salesCount: 0,
        motorcyclesCount: 0,
        lowStockCount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        loadDashboardData();

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const data = await reportsService.getDashboardStats();

            setStats({
                totalSales: Number(data.totalRevenue),
                salesCount: Number(data.totalSalesCount),
                motorcyclesCount: Number(data.totalInventoryItems),
                lowStockCount: Number(data.lowStockItems),
            });
        } catch (error) {
            console.error("Error loading dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = () => {
        return currentTime.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-10 h-10 bg-primary-500/20 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <p className="text-gray-400 animate-pulse">Cargando dashboard...</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 animate-fade-in">
            {/* Welcome Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 p-[2px]">
                <div className="bg-dark-900 rounded-2xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-2">
                                🛠️ Panel de Empleado
                            </h1>
                            <p className="text-gray-400 text-sm sm:text-base">
                                Gestiona operaciones y catálogo
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                            <div>
                                <p className="text-xs text-gray-500">Actualizado</p>
                                <p className="text-sm font-medium text-gray-300 capitalize">{formatTime()}</p>
                            </div>
                            <button
                                onClick={loadDashboardData}
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
                    title="Ventas Totales"
                    value={stats.totalSales}
                    subtitle={`${stats.salesCount} órdenes completadas`}
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    variant="revenue"
                    isCurrency
                />

                <StatCard
                    title="Catálogo"
                    value={stats.motorcyclesCount}
                    subtitle="Motos disponibles"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                    }
                    variant="inventory"
                />

                <StatCard
                    title="Bajo Stock"
                    value={stats.lowStockCount}
                    subtitle={stats.lowStockCount === 0 ? 'Todo en orden' : 'Requieren atención'}
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
                        title="Nueva Moto"
                        description="Agregar al catálogo"
                        to="/employee/motorcycles"
                        variant="primary"
                        icon={
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        }
                    />

                    <QuickActionCard
                        title="Ver Pedidos"
                        description="Gestionar ventas"
                        to="/employee/sales"
                        variant="secondary"
                        icon={
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        }
                    />

                    <QuickActionCard
                        title="Inventario"
                        description="Ajustar stock"
                        to="/employee/inventory"
                        variant="success"
                        icon={
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* Low Stock Alert */}
            {stats.lowStockCount > 0 && (
                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-red-500/20 p-3 rounded-lg">
                            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1">⚠️ Alerta de Stock Bajo</h3>
                            <p className="text-sm text-gray-400 mb-3">
                                Hay {stats.lowStockCount} {stats.lowStockCount === 1 ? 'producto' : 'productos'} con stock bajo.
                            </p>
                            <a
                                href="/employee/inventory"
                                className="inline-flex items-center text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                            >
                                Ver inventario
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
