import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMotorcycleById } from '../../services/motorcycles.service';
import { commentsService } from '../../services/comments.service';
import { getUsers } from '../../services/users.service';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import type { Motorcycle, Comment, User } from '../../types';

export default function MotorcycleDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Comments state
    const [comments, setComments] = useState<Comment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [newComment, setNewComment] = useState({ comentario: '', calificacion: 5 });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingComment, setEditingComment] = useState<Comment | null>(null);
    const [editFormData, setEditFormData] = useState({ comentario: '', calificacion: 5 });

    useEffect(() => {
        if (id) {
            loadMotorcycle(Number(id));
            loadComments(Number(id));
            loadUsers();
        }
    }, [id]);

    const loadMotorcycle = async (motoId: number) => {
        try {
            setLoading(true);
            const data = await getMotorcycleById(motoId);
            setMotorcycle(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar la motocicleta');
        } finally {
            setLoading(false);
        }
    };

    const loadComments = async (motoId: number) => {
        try {
            const allComments = await commentsService.getAll();
            const filtered = allComments.filter((c: Comment) => c.motocicleta_id === motoId);
            setComments(filtered);
        } catch (err) {
            console.error('Error loading comments:', err);
        }
    };

    const loadUsers = async () => {
        try {
            const usersData = await getUsers();
            setUsers(usersData);
        } catch (err) {
            console.error('Error loading users:', err);
        }
    };

    const getUserName = (userId: number): string => {
        const foundUser = users.find(u => u.id_usuario === userId);
        return foundUser ? foundUser.nombre : `Usuario #${userId}`;
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        if (!newComment.comentario.trim()) {
            alert('Por favor escribe un comentario');
            return;
        }

        try {
            console.log('Submitting comment:', {
                usuario_id: user.id_usuario,
                motocicleta_id: Number(id),
                comentario: newComment.comentario,
                calificacion: newComment.calificacion
            });

            await commentsService.create({
                usuario_id: user.id_usuario,
                motocicleta_id: Number(id),
                comentario: newComment.comentario,
                calificacion: newComment.calificacion
            });

            setNewComment({ comentario: '', calificacion: 5 });
            loadComments(Number(id));
            alert('¡Reseña publicada exitosamente!');
        } catch (err: any) {
            console.error('Error submitting comment:', err);
            console.error('Error response:', err.response?.data);
            alert(`Error al publicar la reseña: ${err.response?.data?.message || err.message || 'Error desconocido'}`);
        }
    };

    const handleEditComment = (comment: Comment) => {
        setEditingComment(comment);
        setEditFormData({
            comentario: comment.comentario,
            calificacion: comment.calificacion
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingComment) return;
        try {
            await commentsService.update(editingComment._id, editFormData);
            setIsEditModalOpen(false);
            loadComments(Number(id));
        } catch (err) {
            console.error('Error updating comment:', err);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!window.confirm('¿Estás seguro de eliminar esta reseña?')) return;
        try {
            await commentsService.delete(commentId);
            loadComments(Number(id));
        } catch (err) {
            console.error('Error deleting comment:', err);
            alert('Error al eliminar la reseña');
        }
    };

    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (motorcycle) {
            addToCart(motorcycle);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        }
    };

    const renderStars = (rating: number, interactive: boolean = false, onChange?: (rating: number) => void) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => interactive && onChange?.(star)}
                        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
                        disabled={!interactive}
                    >
                        <svg
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
                    </button>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                    <p className="text-gray-400 mt-4">Cargando...</p>
                </div>
            </div>
        );
    }

    if (error || !motorcycle) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="card p-8 max-w-md text-center">
                    <p className="text-red-400 mb-4">{error || 'Motocicleta no encontrada'}</p>
                    <button onClick={() => navigate('/motorcycles')} className="btn-primary">
                        Volver al catálogo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-900 py-12">
            <div className="container-custom">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/motorcycles')}
                    className="flex items-center text-gray-400 hover:text-primary-400 mb-8 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver al catálogo
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Section */}
                    <div>
                        <div className="card overflow-hidden mb-4">
                            <img
                                src={motorcycle.imagen_url || 'https://via.placeholder.com/800x600?text=Moto'}
                                alt={motorcycle.nombre}
                                className="w-full h-64 sm:h-80 lg:h-96 object-contain bg-white"
                            />
                        </div>
                    </div>

                    {/* Details Section */}
                    <div>
                        <div className="mb-6">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-3">
                                {motorcycle.nombre}
                            </h1>
                            {motorcycle.categoria && (
                                <span className="inline-block bg-primary-600/20 text-primary-400 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                                    {motorcycle.categoria.nombre}
                                </span>
                            )}
                        </div>

                        {/* Specs */}
                        <div className="card p-4 sm:p-6 mb-6">
                            <h3 className="text-base sm:text-lg font-bold text-white mb-4">Especificaciones</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center border-b border-dark-700 pb-3">
                                    <span className="text-gray-400 text-sm sm:text-base">Marca</span>
                                    <span className="text-white font-medium text-sm sm:text-base">{motorcycle.marca}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-dark-700 pb-3">
                                    <span className="text-gray-400 text-sm sm:text-base">Modelo</span>
                                    <span className="text-white font-medium text-sm sm:text-base">{motorcycle.modelo}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-dark-700 pb-3">
                                    <span className="text-gray-400 text-sm sm:text-base">Año</span>
                                    <span className="text-white font-medium text-sm sm:text-base">{motorcycle.anio}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm sm:text-base">Precio</span>
                                    <span className="text-xl sm:text-2xl font-bold gradient-text">
                                        ${motorcycle.precio.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="card p-4 sm:p-6 mb-6">
                            <h3 className="text-base sm:text-lg font-bold text-white mb-3">Descripción</h3>
                            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{motorcycle.descripcion}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <button
                                onClick={handleAddToCart}
                                className={`btn-primary flex-1 transition-colors text-sm sm:text-base py-3 ${added ? 'bg-green-600 hover:bg-green-700' : ''}`}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {added ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    )}
                                </svg>
                                {added ? 'Agregado al Carrito' : 'Agregar al Carrito'}
                            </button>
                            <button onClick={() => navigate('/contact')} className="btn-outline flex-1 text-sm sm:text-base py-3">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Contactar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-12 sm:mt-16">
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-6 sm:mb-8">Reseñas de Clientes</h2>

                    {/* Add Comment Form */}
                    {user ? (
                        <div className="card p-4 sm:p-6 mb-6 sm:mb-8">
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Deja tu opinión</h3>
                            <form onSubmit={handleSubmitComment}>
                                <div className="mb-4">
                                    <label className="block text-gray-300 mb-2 text-sm sm:text-base">Calificación</label>
                                    {renderStars(newComment.calificacion, true, (rating) => setNewComment({ ...newComment, calificacion: rating }))}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-300 mb-2 text-sm sm:text-base">Comentario</label>
                                    <textarea
                                        value={newComment.comentario}
                                        onChange={(e) => setNewComment({ ...newComment, comentario: e.target.value })}
                                        className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-primary-500"
                                        rows={4}
                                        placeholder="Comparte tu experiencia con esta motocicleta..."
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn-primary w-full sm:w-auto text-sm sm:text-base">
                                    Publicar Reseña
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="card p-4 sm:p-6 mb-6 sm:mb-8 text-center">
                            <p className="text-gray-400 mb-4 text-sm sm:text-base">Inicia sesión para dejar una reseña</p>
                            <button onClick={() => navigate('/login')} className="btn-primary text-sm sm:text-base">
                                Iniciar Sesión
                            </button>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-3 sm:space-y-4">
                        {comments.length === 0 ? (
                            <div className="card p-6 sm:p-8 text-center">
                                <p className="text-gray-400 text-sm sm:text-base">Aún no hay reseñas. ¡Sé el primero en opinar!</p>
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment._id} className="card p-4 sm:p-6">
                                    <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-bold text-base sm:text-lg truncate">{getUserName(comment.usuario_id)}</p>
                                            <p className="text-gray-500 text-xs sm:text-sm">{new Date(comment.fecha).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {user && user.id_usuario === comment.usuario_id && (
                                                <div className="flex gap-1.5 sm:gap-2">
                                                    <button
                                                        onClick={() => handleEditComment(comment)}
                                                        className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-full text-blue-400 hover:text-white hover:bg-blue-500/20 transition-all flex items-center justify-center"
                                                        title="Editar reseña"
                                                    >
                                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                        className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-full text-red-400 hover:text-white hover:bg-red-500/20 transition-all flex items-center justify-center"
                                                        title="Eliminar reseña"
                                                    >
                                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                            <div className="flex gap-0.5">{renderStars(comment.calificacion)}</div>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{comment.comentario}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Edit Modal */}
                {isEditModalOpen && editingComment && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="card p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold text-white mb-4">Editar Reseña</h3>
                            <form onSubmit={handleUpdateComment}>
                                <div className="mb-4">
                                    <label className="block text-gray-300 mb-2">Calificación</label>
                                    {renderStars(editFormData.calificacion, true, (rating) => setEditFormData({ ...editFormData, calificacion: rating }))}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-300 mb-2">Comentario</label>
                                    <textarea
                                        value={editFormData.comentario}
                                        onChange={(e) => setEditFormData({ ...editFormData, comentario: e.target.value })}
                                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                                        rows={4}
                                        required
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button type="submit" className="btn-primary flex-1">
                                        Guardar Cambios
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="btn-outline flex-1"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
