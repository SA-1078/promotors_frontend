import { useState, useEffect } from 'react';
import { salesService } from '../../services/sales.service';
import type { Sale } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';

export default function SalesManagement() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = async () => {
        try {
            setLoading(true);
            const data = await salesService.getSales();
            if (Array.isArray(data)) {
                setSales(data);
            }
        } catch (error) {
            console.error('Error loading sales:', error);
        } finally {
            setLoading(false);
        }
    };

    const openDetailModal = (sale: Sale) => {
        setSelectedSale(sale);
        setIsDetailModalOpen(true);
    };

    return (
        <div className="p-6 md:p-8 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold gradient-text">
                    Gestión de Ventas
                </h1>
                <p className="text-gray-400 mt-2">
                    Historial de órdenes y transacciones
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <div className="bg-dark-800 rounded-xl overflow-hidden shadow-xl border border-dark-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-dark-900 border-b border-dark-700">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-400">ID Venta</th>
                                    <th className="px-6 py-4 font-semibold text-gray-400">Cliente</th>
                                    <th className="px-6 py-4 font-semibold text-gray-400">Fecha</th>
                                    <th className="px-6 py-4 font-semibold text-gray-400">Total</th>
                                    <th className="px-6 py-4 font-semibold text-gray-400">Estado</th>
                                    <th className="px-6 py-4 font-semibold text-gray-400">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {sales.map((sale) => (
                                    <tr key={sale.id_venta} className="hover:bg-dark-700/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-gray-400">#{sale.id_venta}</td>
                                        <td className="px-6 py-4 text-white">
                                            {sale.usuario?.nombre || `Usuario #${sale.id_usuario}`}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {formatDate(sale.fecha_venta)}
                                        </td>
                                        <td className="px-6 py-4 text-primary-400 font-bold">
                                            {formatCurrency(Number(sale.total))}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${['completado', 'completada'].includes(sale.estado.toLowerCase()) ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    sale.estado.toLowerCase() === 'pendiente' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                        'bg-red-500/10 text-red-500 border-red-500/20'
                                                }`}>
                                                {sale.estado.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => openDetailModal(sale)}
                                                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                                            >
                                                Ver Detalles
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {sales.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            No hay ventas registradas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Sale Detail Modal */}
            {isDetailModalOpen && selectedSale && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsDetailModalOpen(false)}
                    />
                    <div className="relative bg-dark-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-dark-700 animate-scale-in max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Detalles de Venta</h2>
                                <p className="text-primary-400 font-mono text-lg">#{selectedSale.id_venta}</p>
                            </div>
                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-dark-900/50 p-4 rounded-xl border border-dark-700">
                                <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Cliente</h3>
                                <p className="text-white font-medium">{selectedSale.usuario?.nombre || 'N/A'}</p>
                                <p className="text-gray-400 text-sm">{selectedSale.usuario?.email || 'N/A'}</p>
                            </div>
                            <div className="bg-dark-900/50 p-4 rounded-xl border border-dark-700">
                                <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Información de Pago</h3>
                                <p className="text-white font-medium capitalize">{selectedSale.metodo_pago}</p>
                                <p className="text-gray-400 text-sm">{formatDate(selectedSale.fecha_venta)}</p>
                            </div>
                        </div>

                        <h3 className="text-white font-bold mb-4">Productos Comprados</h3>
                        <div className="space-y-4 mb-8">
                            {selectedSale.detalles?.map((detalle, index) => (
                                <div key={index} className="flex items-center gap-4 bg-dark-900 p-4 rounded-xl border border-dark-700">
                                    <div className="w-16 h-16 bg-dark-800 rounded-lg overflow-hidden flex-shrink-0">
                                        {detalle.motocicleta?.imagen_url ? (
                                            <img src={detalle.motocicleta.imagen_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-bold">{detalle.motocicleta?.nombre || `Moto #${detalle.id_moto}`}</p>
                                        <p className="text-gray-400 text-sm">Cantidad: {detalle.cantidad}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-bold">{formatCurrency(Number(detalle.subtotal))}</p>
                                        <p className="text-gray-500 text-xs">{formatCurrency(Number(detalle.precio_unitario))} c/u</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-6 border-t border-dark-700">
                            <div className="text-right">
                                <p className="text-gray-400 mb-1">Total Pagado</p>
                                <p className="text-3xl font-display font-bold text-primary-400">{formatCurrency(Number(selectedSale.total))}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
