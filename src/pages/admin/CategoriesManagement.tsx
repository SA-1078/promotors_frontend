import { useState, useEffect } from 'react';
import { getCategories, deleteCategory } from '../../services/categories.service';
import type { Category } from '../../types';

export default function CategoriesManagement() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setCategories(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar categorías');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

        try {
            await deleteCategory(id);
            setCategories(categories.filter(c => c.id_categoria !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al eliminar');
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                        Gestión de Categorías
                    </h1>
                    <p className="text-gray-400">
                        Administra las categorías de motocicletas
                    </p>
                </div>
                <button className="btn-primary">
                    + Nueva Categoría
                </button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div key={category.id_categoria} className="card p-6">
                            <h3 className="text-xl font-bold text-white mb-2">
                                {category.nombre}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                {category.descripcion || 'Sin descripción'}
                            </p>
                            <div className="flex gap-2">
                                <button className="btn-secondary flex-1 text-sm py-2">
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id_categoria)}
                                    className="text-red-400 hover:text-red-300 px-4"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}

                    {categories.length === 0 && (
                        <div className="col-span-full card p-12 text-center">
                            <p className="text-gray-400">No hay categorías registradas</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
