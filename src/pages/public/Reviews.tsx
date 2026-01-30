import { useState, useEffect } from 'react';
import { api } from '../../services/api';

interface Comment {
    _id: string;
    comentario: string;
    calificacion: number;
    fecha: string;
    usuario_id: number;
    motocicleta_id: number;
    nombre_usuario?: string;
    authorName?: string;
    motorcycleName?: string;
    nombre_moto?: string;
}

export default function Reviews() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await api.get('/comments');
            setComments(response.data.data);
        } catch (error) {
            console.error('Error loading reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-5 h-5 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                    </svg>
                ))}
            </div>
        );
    };

    const filteredComments = comments.filter(comment => {
        const term = searchTerm.toLowerCase();
        const motoName = (comment.motorcycleName || comment.nombre_moto || '').toLowerCase();
        return motoName.includes(term);
    });

    return (
        <div className="min-h-screen bg-dark-900 py-8 sm:py-12">
            <div className="container-custom">
                {/* Header with Gradient */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-orange-600 p-[2px] mb-12">
                    <div className="bg-dark-900 rounded-2xl p-6 md:p-8">
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/40 mb-4">
                                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                <span className="font-semibold text-yellow-400">Testimonios de Clientes</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-3">
                                <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-orange-500 bg-clip-text text-transparent">
                                    💬 Reseñas y Opiniones
                                </span>
                            </h1>
                            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                                Descubre lo que nuestros clientes piensan sobre sus motocicletas
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-10 relative">
                    <input
                        type="text"
                        placeholder="Buscar por moto (marca/modelo)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-dark-800 border-2 border-dark-700 text-white placeholder-gray-500 rounded-xl py-3 px-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-dark-600"
                    />
                    <svg
                        className="w-5 h-5 absolute left-4 top-3.5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <p className="text-gray-400 mt-4 animate-pulse">Cargando reseñas...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredComments.map((comment) => (
                                <div
                                    key={comment._id}
                                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-orange-500 p-[2px] hover:scale-105 transition-transform duration-300"
                                >
                                    <div className="h-full bg-dark-900 rounded-2xl p-6">
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                                                {(comment.authorName || comment.nombre_usuario || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-semibold truncate">
                                                    {comment.authorName || comment.nombre_usuario || 'Usuario MotorShop'}
                                                </p>
                                                <p className="text-sm font-medium truncate bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">
                                                    {comment.motorcycleName || comment.nombre_moto || 'Motocicleta General'}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {comment.fecha ? new Date(comment.fecha).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    }) : 'Fecha desconocida'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            {renderStars(comment.calificacion)}
                                        </div>
                                        <p className="text-gray-300 leading-relaxed">
                                            {comment.comentario}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredComments.length === 0 && (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">⭐</div>
                                <h3 className="text-2xl font-bold text-white mb-2">Sin resultados</h3>
                                <p className="text-gray-400 text-lg mb-6">
                                    {searchTerm ? 'No se encontraron reseñas que coincidan con tu búsqueda' : 'No hay reseñas disponibles'}
                                </p>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    >
                                        Limpiar búsqueda
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}

                {!loading && comments.length === 0 && (
                    <div className="bg-dark-800/50 border-2 border-dashed border-dark-700 rounded-2xl p-16 text-center">
                        <div className="text-6xl mb-4">⭐</div>
                        <h3 className="text-2xl font-bold text-white mb-2">Sin reseñas aún</h3>
                        <p className="text-gray-400 text-lg">Sé el primero en dejar una reseña</p>
                    </div>
                )}
            </div>
        </div>
    );
}
