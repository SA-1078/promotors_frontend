import { useState, useEffect } from 'react';
import { inventoryService } from '../../services/inventory.service';
import type { Inventory } from '../../types';
import { formatCurrency } from '../../utils/format';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

export default function InventoryManagement() {
    const [inventory, setInventory] = useState<Inventory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
    const [newStock, setNewStock] = useState<number>(0);
    const [newUbicacion, setNewUbicacion] = useState<string>('');

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {
            setLoading(true);
            const data = await inventoryService.getInventory();
            if (Array.isArray(data)) {
                setInventory(data);

            } else {
                setInventory([]);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;

        try {
            if (selectedItem.id_inventario && selectedItem.id_inventario > 0) {
                // Update existing inventory
                await inventoryService.updateStock(selectedItem.id_inventario, {
                    stock_actual: newStock,
                    ubicacion: newUbicacion
                });
            } else {
                // Create new inventory record
                await inventoryService.createInventory({
                    id_moto: selectedItem.id_moto,
                    stock_actual: newStock,
                    ubicacion: newUbicacion
                });
            }

            await loadInventory();
            setIsEditModalOpen(false);
            setSelectedItem(null);
        } catch (error) {
            console.error('Error updating stock:', error);
            alert('Error al actualizar el stock');
        }
    };

    const openEditModal = (item: Inventory) => {
        setSelectedItem(item);
        setNewStock(item.stock_actual || 0);
        setNewUbicacion(item.ubicacion || 'Bodega Principal');
        setIsEditModalOpen(true);
    };

    const filteredInventory = inventory.filter(item =>
        item.motocicleta?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.motocicleta?.marca.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2 animate-fade-in">
                        Gestión de Inventario
                    </h1>
                    <p className="text-gray-400">
                        Controla el stock de tus motocicletas
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Input
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 text-white"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <Card variant="glass" className="overflow-hidden border-dark-700 shadow-xl">
                    <CardHeader className="flex justify-between items-center bg-dark-800/50">
                        <h3 className="text-lg font-semibold text-white">Estado del Inventario</h3>
                        <Badge variant="primary" size="sm">{filteredInventory.length} Items</Badge>
                    </CardHeader>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-dark-800/80 backdrop-blur-sm border-b border-dark-700">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Motocicleta</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Precio</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Stock Actual</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Ubicación</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {filteredInventory.map((item) => (
                                    <tr key={item.id_inventario} className={`hover:bg-dark-700/30 transition-colors group ${item.motocicleta?.deletedAt ? 'bg-red-900/5 hover:bg-red-900/10' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-lg overflow-hidden bg-dark-900 flex-shrink-0 relative border border-dark-700 ${item.motocicleta?.deletedAt ? 'grayscale' : ''}`}>
                                                    {item.motocicleta?.deletedAt && (
                                                        <div className="absolute inset-0 bg-red-500/20 z-10 flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    {item.motocicleta?.imagen_url ? (
                                                        <img
                                                            src={item.motocicleta.imagen_url}
                                                            alt={item.motocicleta.nombre}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className={`font-bold ${item.motocicleta?.deletedAt ? 'text-red-400' : 'text-white'}`}>
                                                            {item.motocicleta?.nombre}
                                                        </p>
                                                        {item.motocicleta?.deletedAt && (
                                                            <Badge variant="danger" size="sm">Inactivo</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-400">{item.motocicleta?.marca}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-primary-400 font-bold font-mono">
                                            {formatCurrency(Number(item.motocicleta?.precio || 0))}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-mono font-bold text-lg ${item.stock_actual < 5 ? 'text-red-500' : 'text-white'}`}>
                                                {item.stock_actual}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-300 text-sm">{item.ubicacion}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.motocicleta?.deletedAt ? (
                                                <Badge variant="dark" size="sm">Archivado</Badge>
                                            ) : item.stock_actual === 0 ? (
                                                <Badge variant="danger" size="sm">Agotado</Badge>
                                            ) : item.stock_actual < 5 ? (
                                                <Badge variant="warning" size="sm">Bajo Stock</Badge>
                                            ) : (
                                                <Badge variant="success" size="sm">Disponible</Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                onClick={() => openEditModal(item)}
                                                variant="ghost"
                                                size="sm"
                                                className="h-10 w-10 p-0 rounded-full text-primary-400 hover:text-white hover:bg-primary-500/20 transition-all"
                                                title="Actualizar Stock"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredInventory.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            No se encontraron productos en el inventario.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Edit Stock Modal */}
            {isEditModalOpen && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsEditModalOpen(false)}
                    />
                    <div className="relative bg-dark-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-dark-700 animate-scale-in">
                        <h2 className="text-2xl font-bold text-white mb-2">Actualizar Stock</h2>
                        <p className="text-gray-400 mb-6">
                            {selectedItem.motocicleta?.nombre}
                        </p>

                        <form onSubmit={handleUpdateStock}>
                            <div className="mb-6">
                                <label className="block text-gray-400 text-sm font-bold mb-2">
                                    Cantidad Disponible
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={newStock}
                                    onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors font-mono text-lg"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-400 text-sm font-bold mb-2">
                                    Ubicación
                                </label>
                                <input
                                    type="text"
                                    value={newUbicacion}
                                    onChange={(e) => setNewUbicacion(e.target.value)}
                                    placeholder="Ej: Bodega Principal, Sucursal A"
                                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-xl border border-dark-600 text-gray-300 font-bold hover:bg-dark-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn-primary"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
