import { useState, useEffect } from 'react';
import { commentsService } from '../../services/comments.service';
import { getUsers } from '../../services/users.service';
import { getMotorcycles } from '../../services/motorcycles.service';
import type { Comment, User, Motorcycle } from '../../types';
import { Card, CardHeader } from '../../components/ui/Card';

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



    return (
        <div className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2 animate-fade-in">
                        Reseñas de Productos
                    </h1>
                    <p className="text-gray-400">
                        Modera las opiniones de los usuarios.
                    </p>
                </div>
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

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-dark-800/80 backdrop-blur-sm border-b border-dark-700">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Moto</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Comentario</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Calificación</th>

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

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4 p-4">
                        {comments.map((comment) => {
                            const user = users[comment.usuario_id];
                            const moto = motorcycles[comment.motocicleta_id];

                            return (
                                <div key={comment._id} className="bg-dark-800/50 rounded-xl border border-dark-700 p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-bold">{user ? user.nombre : `User #${comment.usuario_id}`}</p>
                                            <p className="text-primary-400 text-sm truncate">{moto ? `${moto.marca} ${moto.modelo}` : `Moto #${comment.motocicleta_id}`}</p>
                                        </div>
                                        <div className="flex text-yellow-500 text-lg">
                                            {'★'.repeat(comment.calificacion)}
                                            <span className="text-dark-600">{'★'.repeat(5 - comment.calificacion)}</span>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-dark-700">
                                        <p className="text-gray-300 text-sm italic">"{comment.comentario}"</p>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-dark-700">
                                        <p className="text-xs text-gray-500">{new Date(comment.fecha).toLocaleDateString()}</p>

                                    </div>
                                </div>
                            );
                        })}
                        {comments.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No hay comentarios registrados.
                            </div>
                        )}
                    </div>
                </Card>
            )}

            {/* Edit Modal */}

        </div>
    );
}
