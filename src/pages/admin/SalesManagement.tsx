import { useState, useEffect } from 'react';
import { salesService } from '../../services/sales.service';
import type { Sale } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function SalesManagement() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editStatus, setEditStatus] = useState('');

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

    const openEditModal = (sale: Sale) => {
        setSelectedSale(sale);
        setEditStatus(sale.estado);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (sale: Sale) => {
        setSelectedSale(sale);
        setIsDeleteModalOpen(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedSale) return;
        try {
            await salesService.updateSaleStatus(selectedSale.id_venta, editStatus);
            setIsEditModalOpen(false);
            loadSales();
        } catch (error) {
            console.error('Error updating sale status:', error);
        }
    };

    const handleDelete = async () => {
        if (!selectedSale) return;
        try {
            await salesService.delete(selectedSale.id_venta);
            setIsDeleteModalOpen(false);
            loadSales();
        } catch (error) {
            console.error('Error deleting sale:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        const s = status.toLowerCase();
        if (['completado', 'completada'].includes(s)) return <Badge variant="success" size="sm">COMPLETADO</Badge>;
        if (['pendiente'].includes(s)) return <Badge variant="warning" size="sm">PENDIENTE</Badge>;
        return <Badge variant="danger" size="sm">{status.toUpperCase()}</Badge>;
    };

    return (
        <div className="p-3 sm:p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold gradient-text mb-2 animate-fade-in">
                    Gestión de Ventas
                </h1>
                <p className="text-gray-400">
                    Historial de órdenes y transacciones
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <Card variant="glass" className="overflow-hidden border-dark-700 shadow-xl">
                    <CardHeader className="flex justify-between items-center bg-dark-800/50">
                        <h3 className="text-lg font-semibold text-white">Últimas Ventas</h3>
                        <Badge variant="primary" size="sm">{sales.length} Registros</Badge>
                    </CardHeader>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-dark-800/80 backdrop-blur-sm border-b border-dark-700">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">ID Venta</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {sales.map((sale) => (
                                    <tr key={sale.id_venta} className="hover:bg-dark-700/30 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-gray-400 text-sm">#{sale.id_venta}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white text-sm">{sale.usuario?.nombre || `Usuario #${sale.id_usuario}`}</div>
                                            {sale.usuario?.email && <div className="text-xs text-gray-500">{sale.usuario.email}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 text-sm">
                                            {formatDate(sale.fecha_venta)}
                                        </td>
                                        <td className="px-6 py-4 text-primary-400 font-bold font-mono">
                                            {formatCurrency(Number(sale.total))}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(sale.estado)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    onClick={() => openDetailModal(sale)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-10 w-10 p-0 rounded-full text-blue-400 hover:text-white hover:bg-blue-500/20 transition-all"
                                                    title="Ver Detalles"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Button>
                                                <Button
                                                    onClick={() => openEditModal(sale)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-10 w-10 p-0 rounded-full text-yellow-400 hover:text-white hover:bg-yellow-500/20 transition-all"
                                                    title="Editar Estado"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Button>
                                                <Button
                                                    onClick={() => openDeleteModal(sale)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-10 w-10 p-0 rounded-full text-red-400 hover:text-white hover:bg-red-500/20 transition-all"
                                                    title="Eliminar Venta"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </Button>
                                            </div>
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

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3 p-4">
                        {sales.map((sale) => (
                            <div key={sale.id_venta} className="bg-dark-800/50 rounded-xl border border-dark-700 p-3 space-y-3">
                                {/* Header: ID y Estado */}
                                <div className="flex items-start justify-between">
                                    <p className="text-gray-500 text-xs font-mono">#{sale.id_venta}</p>
                                    {getStatusBadge(sale.estado)}
                                </div>

                                {/* Cliente */}
                                <div>
                                    <p className="text-white font-bold text-lg">{sale.usuario?.nombre || `Usuario #${sale.id_usuario}`}</p>
                                    {sale.usuario?.email && <p className="text-gray-500 text-xs mt-0.5">{sale.usuario.email}</p>}
                                </div>

                                {/* Total y Fecha */}
                                <div className="pt-2 border-t border-dark-700">
                                    <p className="text-gray-500 text-xs mb-1">Total</p>
                                    <p className="text-primary-400 font-bold font-mono text-xl">{formatCurrency(Number(sale.total))}</p>
                                    <p className="text-gray-500 text-xs mt-1.5">{formatDate(sale.fecha_venta)}</p>
                                </div>

                                {/* Acciones */}
                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-dark-700">
                                    <Button
                                        onClick={() => openDetailModal(sale)}
                                        variant="ghost"
                                        size="sm"
                                        className="h-9 w-9 p-0 rounded-full text-blue-400 hover:text-white hover:bg-blue-500/20"
                                        title="Ver Detalles"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </Button>
                                    <Button
                                        onClick={() => openEditModal(sale)}
                                        variant="ghost"
                                        size="sm"
                                        className="h-9 w-9 p-0 rounded-full text-yellow-400 hover:text-white hover:bg-yellow-500/20"
                                        title="Editar Estado"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </Button>
                                    <Button
                                        onClick={() => openDeleteModal(sale)}
                                        variant="ghost"
                                        size="sm"
                                        className="h-9 w-9 p-0 rounded-full text-red-400 hover:text-white hover:bg-red-500/20"
                                        title="Eliminar Venta"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {sales.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No hay ventas registradas.
                            </div>
                        )}
                    </div>
                </Card>
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

            {/* Edit Status Modal */}
            {isEditModalOpen && selectedSale && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsEditModalOpen(false)}
                    />
                    <div className="relative bg-dark-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-dark-700 animate-scale-in">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white">Editar Estado</h2>
                                <p className="text-gray-400 text-sm mt-1">Venta #{selectedSale.id_venta}</p>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Estado de la Venta
                            </label>
                            <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="pendiente">Pendiente</option>
                                <option value="completada">Completada</option>
                                <option value="cancelada">Cancelada</option>
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={() => setIsEditModalOpen(false)}
                                variant="secondary"
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleUpdateStatus}
                                variant="primary"
                                className="flex-1"
                            >
                                Guardar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && selectedSale && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsDeleteModalOpen(false)}
                    />
                    <div className="relative bg-dark-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-dark-700 animate-scale-in">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white">Confirmar Eliminación</h2>
                                <p className="text-gray-400 text-sm mt-1">Esta acción no se puede deshacer</p>
                            </div>
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                            <p className="text-white font-medium mb-2">
                                ¿Estás seguro de eliminar esta venta?
                            </p>
                            <p className="text-gray-400 text-sm">
                                Venta #{selectedSale.id_venta} - {formatCurrency(Number(selectedSale.total))}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={() => setIsDeleteModalOpen(false)}
                                variant="secondary"
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleDelete}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
