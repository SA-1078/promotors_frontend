import { useState, useEffect } from 'react';
import { inventoryService } from '../../services/inventory.service';
import type { Inventory } from '../../types';
import { formatCurrency } from '../../utils/format';

export default function InventoryManagement() {
    const [inventory, setInventory] = useState<Inventory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showInactive, setShowInactive] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
    const [newStock, setNewStock] = useState<number>(0);

    useEffect(() => {
        loadInventory();
    }, [showInactive]);

    const loadInventory = async () => {
        try {
            setLoading(true);
            const data = await inventoryService.getInventory({ withDeleted: showInactive });
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
                    stock_actual: newStock
                });
            } else {
                // Create new inventory record
                await inventoryService.createInventory({
                    id_moto: selectedItem.id_moto,
                    stock_actual: newStock,
                    ubicacion: 'Bodega Principal'
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
        setNewStock(item.cantidad_stock);
        setIsEditModalOpen(true);
    };

    const filteredInventory = inventory.filter(item =>
        item.motocicleta?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.motocicleta?.marca.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 md:p-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text">
                        Gestión de Inventario
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Controla el stock de tus motocicletas
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showInactive}
                            onChange={(e) => setShowInactive(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-primary-500 rounded border-gray-600 bg-dark-800 focus:ring-primary-500 transition duration-150 ease-in-out"
                        />
                        <span className="text-gray-300 text-sm font-medium select-none">Mostrar Inactivos</span>
                    </label>

                    <div className="relative flex-1 md:w-64">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-primary-500 transition-colors text-white"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
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
                                    <th className="px-6 py-4 font-semibold text-gray-400">Motocicleta</th>
                                    <th className="px-6 py-4 font-semibold text-gray-400">Precio</th>
                                    <th className="px-6 py-4 font-semibold text-gray-400">Stock Actual</th>
                                    <th className="px-6 py-4 font-semibold text-gray-400">Estado</th>
                                    <th className="px-6 py-4 font-semibold text-gray-400">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {filteredInventory.map((item) => (
                                    <tr key={item.id_inventario} className={`hover:bg-dark-700/50 transition-colors ${item.motocicleta?.deletedAt ? 'bg-red-900/10' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-lg overflow-hidden bg-dark-900 flex-shrink-0 relative ${item.motocicleta?.deletedAt ? 'grayscale' : ''}`}>
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
                                                            <span className="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded border border-red-500/30">
                                                                Inactivo
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-400">{item.motocicleta?.marca}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {formatCurrency(Number(item.motocicleta?.precio || 0))}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-mono font-bold text-lg ${item.cantidad_stock < 5 ? 'text-red-500' : 'text-white'}`}>
                                                {item.cantidad_stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.motocicleta?.deletedAt ? (
                                                <span className="bg-gray-500/10 text-gray-400 px-3 py-1 rounded-full text-xs font-bold border border-gray-500/20">
                                                    Inactivo
                                                </span>
                                            ) : item.cantidad_stock === 0 ? (
                                                <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20">
                                                    Agotado
                                                </span>
                                            ) : item.cantidad_stock < 5 ? (
                                                <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
                                                    Bajo Stock
                                                </span>
                                            ) : (
                                                <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                                                    Disponible
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                                            >
                                                Actualizar
                                            </button>
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
                </div>
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
