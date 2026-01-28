import { useState, useEffect } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { getCategories, createCategory, updateCategory } from '../../services/categories.service';
import type { Category } from '../../types';

interface EmployeeCategory extends Category {
    activa?: boolean;
    deletedAt?: string | null;
}

export default function CategoriesManagement() {
    const [categories, setCategories] = useState<EmployeeCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<EmployeeCategory | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setCategories(data as EmployeeCategory[]);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCategory(formData);
            setIsFormOpen(false);
            resetForm();
            loadCategories();
        } catch (error) {
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategory) return;
        try {
            await updateCategory(selectedCategory.id_categoria, formData);
            setIsFormOpen(false);
            resetForm();
            loadCategories();
        } catch (error) {
        }
    };

    const openEditModal = (category: EmployeeCategory) => {
        setSelectedCategory(category);
        setFormData({
            nombre: category.nombre,
            descripcion: category.descripcion || ''
        });
        setIsFormOpen(true);
    };

    const resetForm = () => {
        setSelectedCategory(null);
        setFormData({
            nombre: '',
            descripcion: ''
        });
    };

    const filteredCategories = categories.filter(category =>
        category.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2 animate-fade-in">
                        Gestión de Categorías
                    </h1>
                    <p className="text-gray-400">
                        Administra las categorías de productos (Solo visualización y edición).
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => {
                        resetForm();
                        setIsFormOpen(true);
                    }}
                    className="shadow-lg shadow-primary-600/20"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nueva Categoría
                </Button>
            </div>

            <Card variant="glass" className="overflow-hidden border-dark-700 shadow-xl">
                <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-dark-800/50">
                    <div className="relative w-full sm:w-72">
                        <Input
                            placeholder="Buscar categorías..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-dark-900/50 border-dark-600 focus:border-primary-500"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </CardHeader>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-dark-800/80 text-xs text-gray-400 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold">Nombre</th>
                                <th className="px-6 py-4 text-left font-semibold">Descripción</th>
                                <th className="px-6 py-4 text-center font-semibold">Estado</th>
                                <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex justify-center items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                                            Cargando categorías...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No se encontraron categorías
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((category) => (
                                    <tr
                                        key={category.id_categoria}
                                        className="hover:bg-dark-700/30 transition-colors group"
                                    >
                                        <td className="px-6 py-4 text-sm text-white font-medium">
                                            {category.nombre}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {category.descripcion}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge
                                                variant={category.deletedAt ? 'danger' : 'success'}
                                                size="sm"
                                            >
                                                {category.deletedAt ? 'Inactiva' : 'Activa'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => openEditModal(category)}
                                                className="text-primary-400 hover:text-white p-2 hover:bg-primary-600/20 rounded-lg transition-all"
                                                title="Editar"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Modal de Crear/Editar */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md shadow-2xl transform transition-all animate-fade-in-up">
                        <div className="p-6 border-b border-dark-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">
                                {selectedCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                            </h3>
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={selectedCategory ? handleUpdate : handleCreate} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Nombre</label>
                                <Input
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    placeholder="Ej. Deportivas"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Descripción</label>
                                <textarea
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    className="w-full bg-dark-900/50 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none h-24"
                                    placeholder="Descripción corta de la categoría..."
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => setIsFormOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full"
                                >
                                    {selectedCategory ? 'Guardar Cambios' : 'Crear Categoría'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
