import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';

interface Category {
    id: number;
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
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 pt-24 pb-16">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-display font-bold gradient-text mb-4">
                        Categorías de Motocicletas
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Explora nuestras diferentes categorías y encuentra la motocicleta perfecta para tu estilo de conducción
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/motorcycles?category=${category.id}`}
                                className="group"
                            >
                                <Card className="h-full hover:border-primary-600/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
                                    <div className="p-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-orange rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-primary-600/50 transition-all">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                                            {category.nombre}
                                        </h3>
                                        <p className="text-gray-400 mb-4">
                                            {category.descripcion}
                                        </p>
                                        <div className="flex items-center text-primary-400 font-medium">
                                            <span>Ver motocicletas</span>
                                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
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
