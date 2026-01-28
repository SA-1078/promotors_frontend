import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportsService } from '../../services/reports.service';
import { formatCurrency } from '../../utils/format';

interface DashboardStats {
    totalSales: number;
    salesCount: number;
    //  usersCount: number; // Employees might not need this or shouldn't see it
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

    useEffect(() => {
        loadDashboardData();
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-6 animate-fade-in">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-display font-bold gradient-text">
                    Panel de Empleado
                </h1>
                <p className="text-gray-400 text-sm sm:text-base mt-2">
                    Resumen general operativa
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Sales Card */}
                <div className="bg-dark-800 p-4 sm:p-6 rounded-2xl border border-dark-700 shadow-lg relative overflow-hidden group hover:border-primary-500/50 transition-colors">
                    <div className="hidden sm:block absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-16 sm:w-24 h-16 sm:h-24 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-gray-400 text-sm sm:text-base font-medium mb-2">Ventas Totales</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{formatCurrency(stats.totalSales)}</p>
                    <p className="text-xs sm:text-sm text-primary-400 font-medium">{stats.salesCount} órdenes completadas</p>
                </div>

                {/* Motorcycles Card */}
                <div className="bg-dark-800 p-4 sm:p-6 rounded-2xl border border-dark-700 shadow-lg relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                    <div className="hidden sm:block absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-16 sm:w-24 h-16 sm:h-24 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V8a1 1 0 00-1-1h-5z" />
                        </svg>
                    </div>
                    <h3 className="text-gray-400 text-sm sm:text-base font-medium mb-2">Catálogo</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{stats.motorcyclesCount}</p>
                    <p className="text-xs sm:text-sm text-purple-400 font-medium">Motos disponibles</p>
                </div>

                {/* Inventory Alert Card */}
                <div className="bg-dark-800 p-4 sm:p-6 rounded-2xl border border-dark-700 shadow-lg relative overflow-hidden group hover:border-red-500/50 transition-colors">
                    <div className="hidden sm:block absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-16 sm:w-24 h-16 sm:h-24 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-gray-400 text-sm sm:text-base font-medium mb-2">Bajo Stock</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{stats.lowStockCount}</p>
                    <p className="text-xs sm:text-sm text-red-400 font-medium">{stats.lowStockCount === 0 ? 'Todo en orden' : 'Requieren atención'}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Accesos Rápidos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <Link to="/employee/motorcycles" className="bg-dark-900 hover:bg-dark-800 border border-dark-700 p-3 sm:p-4 rounded-xl flex items-center transition-all group">
                    <div className="bg-primary-500/20 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm sm:text-base">Nueva Moto</h4>
                        <p className="text-xs text-gray-400">Agregar al catálogo</p>
                    </div>
                </Link>

                <Link to="/employee/sales" className="bg-dark-900 hover:bg-dark-800 border border-dark-700 p-3 sm:p-4 rounded-xl flex items-center transition-all group">
                    <div className="bg-blue-500/20 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm sm:text-base">Ver Pedidos</h4>
                        <p className="text-xs text-gray-400">Gestionar ventas</p>
                    </div>
                </Link>

                <Link to="/employee/inventory" className="bg-dark-900 hover:bg-dark-800 border border-dark-700 p-3 sm:p-4 rounded-xl flex items-center transition-all group">
                    <div className="bg-purple-500/20 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm sm:text-base">Inventario</h4>
                        <p className="text-xs text-gray-400">Ajustar stock</p>
                    </div>
                </Link>
            </div>

        </div>
    );
}
