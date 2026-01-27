import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';

interface Comment {
    id: number;
    comentario: string;
    calificacion: number;
    fechaCreacion: string;
    idUsuario: number;
    idMotocicleta: number;
}

interface User {
    id: number;
    nombre: string;
}

export default function Reviews() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [commentsRes, usersRes] = await Promise.all([
                api.get('/comments'),
                api.get('/users')
            ]);
            setComments(commentsRes.data.data);
            setUsers(usersRes.data.data);
        } catch (error) {
            console.error('Error loading reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const getUserName = (userId: number) => {
        const user = users.find(u => u.id === userId);
        return user?.nombre || 'Usuario';
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-5 h-5 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                            }`}
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

    return (
        <div className="min-h-screen bg-dark-900 pt-24 pb-16">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 mb-4">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span className="font-semibold">Testimonios de Clientes</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold gradient-text mb-4">
                        Reseñas y Opiniones
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Descubre lo que nuestros clientes piensan sobre sus motocicletas
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {comments.map((comment) => (
                            <Card key={comment.id} className="hover:border-primary-600/50 transition-all">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-orange rounded-full flex items-center justify-center text-white font-bold">
                                                {getUserName(comment.idUsuario).charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold">{getUserName(comment.idUsuario)}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(comment.fechaCreacion).toLocaleDateString('es-ES')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        {renderStars(comment.calificacion)}
                                    </div>
                                    <p className="text-gray-300 leading-relaxed">
                                        {comment.comentario}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {!loading && comments.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">⭐</div>
                        <p className="text-gray-400 text-lg">No hay reseñas disponibles</p>
                    </div>
                )}
            </div>
        </div>
    );
}
