import { useState, useEffect } from 'react';
import { getMotorcycles, deleteMotorcycle } from '../../services/motorcycles.service';
import { getCategories } from '../../services/categories.service';
import type { Motorcycle, Category } from '../../types';

export default function MotorcyclesManagement() {
    const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [motosData, catsData] = await Promise.all([
                getMotorcycles(),
                getCategories(),
            ]);
            setMotorcycles(Array.isArray(motosData) ? motosData : motosData.items || []);
            setCategories(catsData);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta motocicleta?')) return;

        try {
            await deleteMotorcycle(id);
            setMotorcycles(motorcycles.filter(m => m.id_moto !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al eliminar');
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
                <button className="btn-primary">
                    + Nueva Motocicleta
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
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Categoría</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {motorcycles.map((moto) => (
                                    <tr key={moto.id_moto} className="hover:bg-dark-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <img
                                                src={moto.imagen_url || 'https://via.placeholder.com/100'}
                                                alt={moto.nombre}
                                                className="w-16 h-16 object-cover rounded"
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
                                        <td className="px-6 py-4 text-gray-400">
                                            {getCategoryName(moto.id_categoria)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="text-primary-400 hover:text-primary-300 p-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(moto.id_moto)}
                                                    className="text-red-400 hover:text-red-300 p-2"
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
                            <p className="text-gray-400">No hay motocicletas registradas</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
