import { useState, useEffect } from 'react';
import { getMotorcycles, deleteMotorcycle, createMotorcycle, updateMotorcycle, restoreMotorcycle } from '../../services/motorcycles.service';
import { getCategories } from '../../services/categories.service';
import type { Motorcycle, Category, CreateMotorcycleDto } from '../../types';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

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
      
            if (type === 'hard' || !showInactive) {
                setMotorcycles(motorcycles.filter(m => m.id_moto !== itemToDelete.id_moto));
            } else {
                loadData(); 
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
            loadData(); 
        } catch (err: any) {
            console.error('Error submitting form:', err);
            alert(err.response?.data?.message || 'Error al guardar');
        }
    };

    return (
        <div className="p-3 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2 animate-fade-in">
                        Gestión de Motocicletas
                    </h1>
                    <p className="text-gray-400">
                        Administra el catálogo de motocicletas
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer bg-dark-800 px-4 py-2 rounded-lg border border-dark-700 hover:border-dark-600 transition-colors">
                        <input
                            type="checkbox"
                            checked={showInactive}
                            onChange={(e) => setShowInactive(e.target.checked)}
                            className="form-checkbox text-primary-500 rounded bg-dark-900 border-dark-600 focus:ring-primary-500 focus:ring-offset-0"
                        />
                        <span className="text-sm text-gray-300 font-medium">Mostrar Inactivos</span>
                    </label>
                    <Button variant="primary" icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    } onClick={handleOpenCreate}>
                        Nueva Motocicleta
                    </Button>
                </div>
            </div>

            {loading && (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                    <p className="text-gray-400 mt-4 animate-pulse">Cargando inventario...</p>
                </div>
            )}

            {error && (
                <Card variant="outline" className="p-6 border-accent-red/50 text-center mb-8 bg-accent-red/5">
                    <p className="text-accent-red font-medium">{error}</p>
                </Card>
            )}

            {!loading && !error && (
                <Card variant="glass" className="overflow-hidden border-dark-700 shadow-xl">
                    <CardHeader className="flex justify-between items-center bg-dark-800/50">
                        <h3 className="text-lg font-semibold text-white">Catálogo de Productos</h3>
                        <Badge variant="primary" size="sm">{motorcycles.length} Total</Badge>
                    </CardHeader>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-dark-800/80 backdrop-blur-sm border-b border-dark-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-300 uppercase tracking-wider">Imagen</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-300 uppercase tracking-wider">Nombre</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-300 uppercase tracking-wider">Marca/Modelo</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-300 uppercase tracking-wider">Año</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-300 uppercase tracking-wider">Precio</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-300 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-primary-300 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {motorcycles.map((moto) => (
                                    <tr key={moto.id_moto} className={`transition-colors group ${moto.deletedAt ? 'bg-red-900/5 hover:bg-red-900/10' : 'hover:bg-dark-700/30'}`}>
                                        <td className="px-6 py-4">
                                            <div className="w-14 h-14 rounded-xl bg-dark-700 flex items-center justify-center overflow-hidden border border-dark-600 shadow-sm">
                                                {moto.imagen_url ? (
                                                    <img
                                                        src={moto.imagen_url}
                                                        alt={moto.nombre}
                                                        className={`w-full h-full object-cover ${moto.deletedAt ? 'grayscale opacity-60' : ''}`}
                                                    />
                                                ) : (
                                                    <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-white font-bold">{moto.nombre}</td>
                                        <td className="px-6 py-4 text-gray-300 text-sm">
                                            {moto.marca} <span className="text-gray-500">•</span> {moto.modelo}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm font-mono">{moto.anio}</td>
                                        <td className="px-6 py-4 text-primary-400 font-bold text-sm">
                                            ${moto.precio.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {moto.deletedAt ? (
                                                <Badge variant="danger" size="sm">Inactivo</Badge>
                                            ) : (
                                                <Badge variant="success" size="sm">Activo</Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {moto.deletedAt ? (
                                                    <Button
                                                        onClick={() => handleRestore(moto)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-10 w-10 p-0 rounded-full text-green-400 hover:text-white hover:bg-green-500/20 transition-all"
                                                        title="Restaurar"
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => handleOpenEdit(moto)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-10 w-10 p-0 rounded-full text-blue-400 hover:text-white hover:bg-blue-500/20 transition-all"
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Button>
                                                )}

                                                <Button
                                                    onClick={() => handleDelete(moto)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-10 w-10 p-0 rounded-full text-red-400 hover:text-white hover:bg-red-500/20 transition-all"
                                                    title={moto.deletedAt ? "Eliminar Definitivamente" : "Inactivar"}
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4 p-4">
                        {motorcycles.map((moto) => (
                            <div key={moto.id_moto} className={`rounded-xl border ${moto.deletedAt ? 'bg-red-900/5 border-red-900/20' : 'bg-dark-800/50 border-dark-700'} p-4 space-y-4`}>
                                <div className="flex items-start gap-4">
                                    <div className="w-20 h-20 flex-shrink-0 rounded-xl bg-dark-700 overflow-hidden border border-dark-600">
                                        {moto.imagen_url ? (
                                            <img src={moto.imagen_url} alt={moto.nombre} className={`w-full h-full object-cover ${moto.deletedAt ? 'grayscale opacity-60' : ''}`} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-bold text-lg truncate">{moto.nombre}</h3>
                                        <p className="text-gray-400 text-sm">{moto.marca} • {moto.modelo}</p>
                                        <p className="text-gray-500 text-xs font-mono">{moto.anio}</p>
                                    </div>
                                    <div className="text-right">
                                        {moto.deletedAt ? (
                                            <Badge variant="danger" size="sm">Inactivo</Badge>
                                        ) : (
                                            <Badge variant="success" size="sm">Activo</Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-dark-700">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Precio</p>
                                        <p className="text-primary-400 font-bold text-lg">${moto.precio.toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {moto.deletedAt ? (
                                            <Button
                                                onClick={() => handleRestore(moto)}
                                                variant="ghost"
                                                size="sm"
                                                className="h-10 w-10 p-0 rounded-full text-green-400 hover:text-white hover:bg-green-500/20"
                                                title="Restaurar"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => handleOpenEdit(moto)}
                                                variant="ghost"
                                                size="sm"
                                                className="h-10 w-10 p-0 rounded-full text-blue-400 hover:text-white hover:bg-blue-500/20"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => handleDelete(moto)}
                                            variant="ghost"
                                            size="sm"
                                            className="h-10 w-10 p-0 rounded-full text-red-400 hover:text-white hover:bg-red-500/20"
                                            title={moto.deletedAt ? "Eliminar Definitivamente" : "Inactivar"}
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {motorcycles.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-1">Inventario Vacío</h3>
                            <p className="text-gray-400 text-sm mb-4">No hay motocicletas {showInactive ? '' : 'activas'} para mostrar</p>
                            <Button variant="secondary" size="sm" onClick={handleOpenCreate}>
                                Agregar Motocicleta
                            </Button>
                        </div>
                    )}
                </Card>
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
                                        step="0.01"
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
