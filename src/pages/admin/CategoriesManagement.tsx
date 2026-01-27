import { useState, useEffect } from 'react';
import { getCategories, deleteCategory, updateCategory, createCategory, restoreCategory } from '../../services/categories.service';
import { useAuth } from '../../context/AuthContext';
import type { Category } from '../../types';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

export default function CategoriesManagement() {
    const { user: currentUser } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showInactive, setShowInactive] = useState(false);

    // Edit modal state
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        nombre: '',
        descripcion: ''
    });

    // Create modal state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createForm, setCreateForm] = useState({
        nombre: '',
        descripcion: ''
    });

    // Delete modal state
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        loadCategories();
    }, [showInactive]);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories({ withDeleted: showInactive });
            setCategories(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar categorías');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDeleteModal = (category: Category) => {
        setDeletingCategory(category);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async (type: 'soft' | 'hard') => {
        if (!deletingCategory) return;

        try {
            await deleteCategory(deletingCategory.id_categoria, type);
            setIsDeleteModalOpen(false);
            setDeletingCategory(null);
            loadCategories();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Error al eliminar';
            alert(errorMsg);
        }
    };

    const handleRestore = async (id: number) => {
        if (!confirm('¿Restaurar esta categoría?')) return;

        try {
            await restoreCategory(id);
            loadCategories();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al restaurar');
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setEditForm({
            nombre: category.nombre,
            descripcion: category.descripcion || ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;

        try {
            await updateCategory(editingCategory.id_categoria, editForm);
            setIsEditModalOpen(false);
            setEditingCategory(null);
            loadCategories();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al actualizar categoría');
        }
    };

    const handleOpenCreateModal = () => {
        setCreateForm({
            nombre: '',
            descripcion: ''
        });
        setIsCreateModalOpen(true);
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createCategory(createForm);
            setIsCreateModalOpen(false);
            setCreateForm({
                nombre: '',
                descripcion: ''
            });
            loadCategories();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al crear categoría');
        }
    };

    return (
        <div className="p-3 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2 animate-fade-in">
                        Gestión de Categorías
                    </h1>
                    <p className="text-gray-400">
                        Administra las categorías de motocicletas
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
                    <Button
                        variant="primary"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        }
                        onClick={handleOpenCreateModal}
                    >
                        Nueva Categoría
                    </Button>
                </div>
            </div>

            {loading && (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                    <p className="text-gray-400 mt-4 animate-pulse">Cargando categorías...</p>
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
                        <h3 className="text-lg font-semibold text-white">Catálogo de Categorías</h3>
                        <Badge variant="primary" size="sm">{categories.length} Total</Badge>
                    </CardHeader>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-dark-800/80 backdrop-blur-sm border-b border-dark-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-300 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-300 uppercase tracking-wider">Nombre</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-300 uppercase tracking-wider">Descripción</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-300 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-primary-300 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {categories.map((category) => (
                                    <tr key={category.id_categoria} className={`transition-colors group ${(category as any).deletedAt ? 'bg-red-900/5 hover:bg-red-900/10' : 'hover:bg-dark-700/30'}`}>
                                        <td className="px-6 py-4 text-gray-400 font-mono text-xs">#{category.id_categoria}</td>
                                        <td className="px-6 py-4 text-white font-bold">{category.nombre}</td>
                                        <td className="px-6 py-4 text-gray-300 text-sm">{category.descripcion || <span className="text-gray-600 italic">Sin descripción</span>}</td>
                                        <td className="px-6 py-4">
                                            {(category as any).deletedAt ? (
                                                <Badge variant="danger" size="sm">Inactivo</Badge>
                                            ) : (
                                                <Badge variant="success" size="sm">Activo</Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {(category as any).deletedAt ? (
                                                    <Button
                                                        onClick={() => handleRestore(category.id_categoria)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-10 w-10 p-0 rounded-full text-green-400 hover:text-white hover:bg-green-500/20 transition-all"
                                                        title="Restaurar"
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                    </Button>
                                                ) : (
                                                    <>
                                                        {(currentUser?.rol === 'admin' || currentUser?.rol === 'empleado') && (
                                                            <Button
                                                                onClick={() => handleEdit(category)}
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-10 w-10 p-0 rounded-full text-blue-400 hover:text-white hover:bg-blue-500/20 transition-all"
                                                                title="Editar"
                                                            >
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                            </Button>
                                                        )}
                                                        {currentUser?.rol === 'admin' && (
                                                            <Button
                                                                onClick={() => handleOpenDeleteModal(category)}
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-10 w-10 p-0 rounded-full text-red-400 hover:text-white hover:bg-red-500/20 transition-all"
                                                                title="Eliminar"
                                                            >
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3 p-4">
                        {categories.map((category) => (
                            <div key={category.id_categoria} className="bg-dark-800/50 rounded-xl border border-dark-700 p-4 space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-500 text-xs font-mono">#{category.id_categoria}</p>
                                        <h3 className="text-white font-bold text-lg mt-1">{category.nombre}</h3>
                                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{category.descripcion || 'Sin descripción'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-dark-700">
                                    <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full text-blue-400 hover:text-white hover:bg-blue-500/20">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </Button>
                                    <Button
                                        onClick={() => handleOpenDeleteModal(category)}
                                        variant="ghost"
                                        size="sm"
                                        className="h-10 w-10 p-0 rounded-full text-red-400 hover:text-white hover:bg-red-500/20"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {categories.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-1">No hay categorías</h3>
                            <p className="text-gray-400 text-sm mb-4">Crea categorías para organizar tus productos</p>
                            <Button variant="secondary" size="sm">
                                Crear Primera Categoría
                            </Button>
                        </div>
                    )}
                </Card>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && editingCategory && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-dark-800 rounded-xl border border-dark-700 shadow-2xl max-w-md w-full">
                        <div className="border-b border-dark-700 p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">Editar Categoría</h3>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateCategory} className="p-6 space-y-4">
                            <Input
                                label="Nombre de la Categoría"
                                type="text"
                                value={editForm.nombre}
                                onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                                <textarea
                                    value={editForm.descripcion}
                                    onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })}
                                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                                    rows={3}
                                    placeholder="Descripción de la categoría (opcional)"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="flex-1"
                                >
                                    Guardar Cambios
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-dark-800 rounded-xl border border-dark-700 shadow-2xl max-w-md w-full">
                        <div className="border-b border-dark-700 p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">Nueva Categoría</h3>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
                            <Input
                                label="Nombre de la Categoría"
                                type="text"
                                value={createForm.nombre}
                                onChange={(e) => setCreateForm({ ...createForm, nombre: e.target.value })}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                                <textarea
                                    value={createForm.descripcion}
                                    onChange={(e) => setCreateForm({ ...createForm, descripcion: e.target.value })}
                                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                                    rows={3}
                                    placeholder="Descripción de la categoría (opcional)"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="flex-1"
                                >
                                    Crear Categoría
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && deletingCategory && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-dark-800 rounded-xl border border-dark-700 shadow-2xl max-w-md w-full">
                        <div className="border-b border-dark-700 p-6">
                            <h3 className="text-xl font-bold text-white">Eliminar Categoría</h3>
                            <p className="text-gray-400 mt-2">
                                ¿Qué deseas hacer con la categoría <span className="text-primary-400 font-bold">"{deletingCategory.nombre}"</span>?
                            </p>
                        </div>

                        <div className="p-6 space-y-3">
                            <button
                                onClick={() => handleDelete('soft')}
                                className="w-full p-4 bg-dark-700 hover:bg-dark-600 border border-dark-600 hover:border-primary-500/50 rounded-lg transition-all text-left group"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium group-hover:text-primary-400 transition-colors">Solo Ocultar</h4>
                                        <p className="text-gray-400 text-sm mt-1">Oculta del catálogo pero mantiene el historial.</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleDelete('hard')}
                                className="w-full p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-all text-left group"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium group-hover:text-red-400 transition-colors">Eliminar Definitivamente</h4>
                                        <p className="text-gray-400 text-sm mt-1">Borra TODO. Falla si hay motos asociadas.</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="w-full mt-4 p-3 text-gray-400 hover:text-white transition-colors"
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
