import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

interface Category {
    id_categoria: number;
    nombre: string;
    descripcion: string;
    fechaCreacion: string;
}

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.data.items);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 py-8 sm:py-12">
            <div className="container-custom">
                {/* Header with Gradient */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-orange-600 p-[2px] mb-12">
                    <div className="bg-dark-900 rounded-2xl p-6 md:p-8">
                        <div className="text-center">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-3">
                                <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-orange-500 bg-clip-text text-transparent">
                                    🏷️ Categorías de Motocicletas
                                </span>
                            </h1>
                            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                                Explora nuestras diferentes categorías y encuentra la motocicleta perfecta para tu estilo de conducción
                            </p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {categories.map((category, index) => {
                            const gradients = [
                                'from-blue-500 to-cyan-600',
                                'from-orange-500 to-red-600',
                                'from-blue-600 to-purple-600',
                                'from-amber-500 to-orange-600'
                            ];
                            const gradient = gradients[index % 4];

                            return (
                                <Link
                                    key={category.id_categoria}
                                    to={`/motorcycles?category=${category.id_categoria}`}
                                    className="group"
                                >
                                    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-[2px] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20`}>
                                        <div className="h-full bg-dark-900 rounded-2xl p-6">
                                            <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-bold mb-2">
                                                <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                                                    {category.nombre}
                                                </span>
                                            </h3>
                                            <p className="text-gray-400 mb-4">
                                                {category.descripcion}
                                            </p>
                                            <div className="flex items-center font-medium">
                                                <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>Ver motocicletas</span>
                                                <svg className="w-5 h-5 ml-2 text-blue-400 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {!loading && categories.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📂</div>
                        <p className="text-gray-400 text-lg">No hay categorías disponibles</p>
                    </div>
                )}
            </div>
        </div>
    );
}
