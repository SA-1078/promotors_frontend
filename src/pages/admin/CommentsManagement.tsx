import { useState, useEffect } from 'react';
import { commentsService } from '../../services/comments.service';
import { getUsers } from '../../services/users.service';
import { getMotorcycles } from '../../services/motorcycles.service';
import type { Comment, User, Motorcycle } from '../../types';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function CommentsManagement() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [users, setUsers] = useState<Record<number, User>>({});
    const [motorcycles, setMotorcycles] = useState<Record<number, Motorcycle>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [commentsData, usersData, motorcyclesData] = await Promise.all([
                commentsService.getAll(),
                getUsers(),
                getMotorcycles()
            ]);

            // Create search maps for O(1) access
            const usersMap = (usersData as User[]).reduce((acc, user) => {
                acc[user.id_usuario] = user;
                return acc;
            }, {} as Record<number, User>);

            const motorcyclesMap = (motorcyclesData as Motorcycle[]).reduce((acc, moto) => {
                acc[moto.id_moto] = moto;
                return acc;
            }, {} as Record<number, Motorcycle>);

            setUsers(usersMap);
            setMotorcycles(motorcyclesMap);
            setComments(commentsData);

        } catch (error) {
            console.error("Error loading comments data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este comentario?')) return;
        try {
            await commentsService.delete(id);
            setComments(comments.filter(c => c._id !== id));
        } catch (error) {
            console.error('Error deleting comment', error);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold gradient-text mb-2 animate-fade-in">
                    Gestión de Comentarios
                </h1>
                <p className="text-gray-400">
                    Modera las opiniones de los usuarios.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <Card variant="glass" className="overflow-hidden border-dark-700 shadow-xl">
                    <CardHeader className="flex justify-between items-center bg-dark-800/50">
                        <h3 className="text-lg font-semibold text-white">Comentarios Recientes</h3>
                        <Badge variant="primary" size="sm">{comments.length} Opiniones</Badge>
                    </CardHeader>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-dark-800/80 backdrop-blur-sm border-b border-dark-700">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Moto</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Comentario</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Calificación</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {comments.map((comment) => {
                                    const user = users[comment.usuario_id];
                                    const moto = motorcycles[comment.motocicleta_id];

                                    return (
                                        <tr key={comment._id} className="hover:bg-dark-700/30 transition-colors group">
                                            <td className="px-6 py-4 text-gray-400 text-sm whitespace-nowrap font-mono">
                                                {new Date(comment.fecha).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-white">
                                                {user ? user.nombre : `User #${comment.usuario_id}`}
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">
                                                {moto ? <span className="font-medium text-primary-400">{moto.marca} {moto.modelo}</span> : `Moto #${comment.motocicleta_id}`}
                                            </td>
                                            <td className="px-6 py-4 text-gray-300 max-w-xs truncate" title={comment.comentario}>
                                                "{comment.comentario}"
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex text-yellow-500 text-sm">
                                                    {'★'.repeat(comment.calificacion)}
                                                    <span className="text-dark-600">{'★'.repeat(5 - comment.calificacion)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    onClick={() => handleDelete(comment._id)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-10 w-10 p-0 rounded-full text-red-400 hover:text-white hover:bg-red-500/20 transition-all"
                                                    title="Eliminar Comentario"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {comments.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            No hay comentarios registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
}
