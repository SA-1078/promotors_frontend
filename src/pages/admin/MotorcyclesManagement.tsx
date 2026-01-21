import { useState, useEffect } from 'react';
import { getMotorcycles, deleteMotorcycle, createMotorcycle, updateMotorcycle, restoreMotorcycle } from '../../services/motorcycles.service';
import { getCategories } from '../../services/categories.service';
import type { Motorcycle, Category, CreateMotorcycleDto } from '../../types';

export default function MotorcyclesManagement() {
    const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showInactive, setShowInactive] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [formData, setFormData] = useState<CreateMotorcycleDto>({
        nombre: '',
        marca: '',
        modelo: '',
        anio: new Date().getFullYear(),
        precio: 0,
        descripcion: '',
        id_categoria: 1,
        imagen_url: '',
        stock: 0
    });

    useEffect(() => {
        loadData();
    }, [showInactive]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [motosData, catsData] = await Promise.all([
                getMotorcycles({ withDeleted: showInactive }),
                getCategories(),
            ]);
            setMotorcycles(motosData);
            setCategories(catsData);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Motorcycle | null>(null);

    const handleDelete = (moto: Motorcycle) => {
        setItemToDelete(moto);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async (type: 'soft' | 'hard') => {
        if (!itemToDelete) return;

        try {
            await deleteMotorcycle(itemToDelete.id_moto, type);
            // If hard, remove from list. If soft, only remove if we are not showing inactive.
            if (type === 'hard' || !showInactive) {
                setMotorcycles(motorcycles.filter(m => m.id_moto !== itemToDelete.id_moto));
            } else {
                loadData(); // Reload to show updated status if showing inactive
            }
            setDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al eliminar');
        }
    };

    const handleRestore = async (moto: Motorcycle) => {
        if (!confirm(`¿Restaurar motocicleta "${moto.nombre}"?`)) return;
        try {
            await restoreMotorcycle(moto.id_moto);
            loadData();
        } catch (err: any) {
            alert('Error al restaurar');
        }
    };

    const handleOpenCreate = () => {
        setIsEditing(false);
        setSelectedId(null);
        setFormData({
            nombre: '',
            marca: '',
            modelo: '',
            anio: new Date().getFullYear(),
            precio: 0,
            descripcion: '',
            id_categoria: categories[0]?.id_categoria || 1,
            imagen_url: '',
            stock: 0
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (moto: Motorcycle) => {
        setIsEditing(true);
        setSelectedId(moto.id_moto);
        setFormData({
            nombre: moto.nombre,
            marca: moto.marca,
            modelo: moto.modelo,
            anio: moto.anio,
            precio: moto.precio,
            descripcion: moto.descripcion,
            id_categoria: moto.id_categoria,
            imagen_url: moto.imagen_url
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                anio: Number(formData.anio),
                precio: Number(formData.precio),
                id_categoria: Number(formData.id_categoria)
            };

            if (isEditing && selectedId) {
                await updateMotorcycle(selectedId, payload);
            } else {
                await createMotorcycle(payload);
            }
            setIsModalOpen(false);
            loadData(); // Refresh list
        } catch (err: any) {
            console.error('Error submitting form:', err);
            alert(err.response?.data?.message || 'Error al guardar');
        }
    };

    const getCategoryName = (id: number) => {
        return categories.find(c => c.id_categoria === id)?.nombre || 'N/A';
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                        Gestión de Motocicletas
                    </h1>
                    <p className="text-gray-400">
                        Administra el catálogo de motocicletas
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showInactive}
                            onChange={(e) => setShowInactive(e.target.checked)}
                            className="form-checkbox text-primary-500 rounded bg-dark-700 border-dark-600 focus:ring-0"
                        />
                        <span className="text-sm text-gray-300">Mostrar Inactivos</span>
                    </label>
                    <button
                        onClick={handleOpenCreate}
                        className="btn-primary"
                    >
                        + Nueva Motocicleta
                    </button>
                </div>
            </div>

            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                    <p className="text-gray-400 mt-4">Cargando...</p>
                </div>
            )}

            {error && (
                <div className="card p-6 bg-red-500/10 border-red-500">
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-dark-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Imagen</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Nombre</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Marca/Modelo</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Año</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Precio</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Estado</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {motorcycles.map((moto) => (
                                    <tr key={moto.id_moto} className={`transition-colors ${moto.deletedAt ? 'bg-red-900/10' : 'hover:bg-dark-700/50'}`}>
                                        <td className="px-6 py-4">
                                            <img
                                                src={moto.imagen_url || 'https://via.placeholder.com/100'}
                                                alt={moto.nombre}
                                                className={`w-16 h-16 object-cover rounded ${moto.deletedAt ? 'grayscale' : ''}`}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-white font-medium">{moto.nombre}</td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {moto.marca} {moto.modelo}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{moto.anio}</td>
                                        <td className="px-6 py-4 text-primary-400 font-bold">
                                            ${moto.precio.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {moto.deletedAt ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Inactivo
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Activo
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {moto.deletedAt ? (
                                                    // Botón de Restaurar
                                                    <button
                                                        onClick={() => handleRestore(moto)}
                                                        className="text-green-400 hover:text-green-300 p-2"
                                                        title="Restaurar"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                    </button>
                                                ) : (
                                                    // Botón de Editar
                                                    <button
                                                        onClick={() => handleOpenEdit(moto)}
                                                        className="text-primary-400 hover:text-primary-300 p-2"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleDelete(moto)}
                                                    className="text-red-400 hover:text-red-300 p-2"
                                                    title={moto.deletedAt ? "Eliminar Definitivamente" : "Eliminar"}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {motorcycles.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No hay motocicletas {showInactive ? '' : 'activas'} registradas</p>
                        </div>
                    )}
                </div>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-dark-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-dark-600 shadow-xl">
                        <div className="p-6 border-b border-dark-600 sticky top-0 bg-dark-800 z-10 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">
                                {isEditing ? 'Editar Motocicleta' : 'Nueva Motocicleta'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Marca</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.marca}
                                        onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                                        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Modelo</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.modelo}
                                        onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                                        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Año</label>
                                    <input
                                        type="number"
                                        required
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        value={formData.anio}
                                        onChange={(e) => setFormData({ ...formData, anio: parseInt(e.target.value) })}
                                        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Precio</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.precio}
                                        onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                                        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Categoría</label>
                                    <select
                                        value={formData.id_categoria}
                                        onChange={(e) => setFormData({ ...formData, id_categoria: parseInt(e.target.value) })}
                                        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id_categoria} value={cat.id_categoria}>
                                                {cat.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Imagen URL</label>
                                <input
                                    type="url"
                                    value={formData.imagen_url}
                                    onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                                    placeholder="https://..."
                                />
                            </div>

                            {!isEditing && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Stock Inicial</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.stock || 0}
                                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                                        placeholder="0"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-dark-600">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    {isEditing ? 'Guardar Cambios' : 'Crear Motocicleta'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && itemToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-dark-800 rounded-2xl w-full max-w-md border border-dark-600 shadow-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-2">Eliminar Motocicleta</h3>
                        <p className="text-gray-400 mb-6">
                            ¿Qué deseas hacer con la motocicleta <span className="text-primary-400 font-medium">"{itemToDelete.nombre}"</span>?
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => confirmDelete('soft')}
                                className="w-full btn-secondary flex items-center justify-center gap-2"
                                disabled={!!itemToDelete.deletedAt}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                                <div>
                                    <span className="block font-bold">Solo Inactivar</span>
                                    <span className="text-xs text-gray-400 font-normal">
                                        {itemToDelete.deletedAt ? 'Ya está inactivo' : 'Ocultar del catálogo. Mantiene historial de ventas.'}
                                    </span>
                                </div>
                            </button>

                            <button
                                onClick={() => confirmDelete('hard')}
                                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <div>
                                    <span className="block font-bold">Eliminar Definitivamente</span>
                                    <span className="text-xs text-red-300/70 font-normal">Borra TODO. Fallará si hay ventas.</span>
                                </div>
                            </button>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="text-gray-400 hover:text-white px-4 py-2"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
