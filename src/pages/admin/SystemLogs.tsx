import { useState, useEffect } from 'react';
import { systemLogsService } from '../../services/systemLogs.service';
import { getUsers } from '../../services/users.service';
import type { SystemLog, User } from '../../types';

export default function SystemLogs() {
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [users, setUsers] = useState<Record<number, User>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [logsData, usersData] = await Promise.all([
                systemLogsService.getAll(),
                getUsers().catch(err => {
                    console.error("Error getting users:", err);
                    return [];
                })
            ]);

            console.log("SystemLogs Data:", { logsData, usersData });

            // Safeguard usersMap creation
            const usersMap = Array.isArray(usersData) ? usersData.reduce((acc, user) => {
                acc[user.id_usuario] = user;
                return acc;
            }, {} as Record<number, User>) : {};

            setUsers(usersMap);
            setLogs(Array.isArray(logsData) ? logsData : []);

        } catch (error) {
            console.error("Error loading system logs page data", error);
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 animate-fade-in">
            <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                Logs del Sistema
            </h1>
            <p className="text-gray-400 mb-8">
                Historial de acciones y eventos de seguridad.
            </p>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <div className="bg-dark-800 rounded-xl overflow-hidden shadow-xl border border-dark-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-dark-900 border-b border-dark-700">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-400">Fecha</th>
                                    <th className="px-6 py-4 font-semibold text-gray-400">Usuario</th>
                                    <th className="px-6 py-4 font-semibold text-gray-400">Acción</th>
                                    <th className="px-6 py-4 font-semibold text-gray-400">Detalles</th>
                                    <th className="px-6 py-4 font-semibold text-gray-400">IP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {logs.map((log) => {
                                    const user = log.usuario_id ? users[log.usuario_id] : null;

                                    return (
                                        <tr key={log._id || Math.random()} className="hover:bg-dark-700/50 transition-colors">
                                            <td className="px-6 py-4 text-gray-400 text-sm whitespace-nowrap">
                                                {log.fecha ? new Date(log.fecha).toLocaleString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-white">
                                                {user ? (
                                                    <div className="flex flex-col">
                                                        <span>{user.nombre}</span>
                                                        <span className="text-xs text-gray-500">{user.email}</span>
                                                    </div>
                                                ) : `User #${log.usuario_id || '?'}`}
                                            </td>
                                            <td className="px-6 py-4 text-primary-400 font-medium">
                                                {log.accion}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                <code className="bg-dark-900 px-2 py-1 rounded text-xs text-gray-300">
                                                    {log.detalles ? JSON.stringify(log.detalles).slice(0, 50) + (JSON.stringify(log.detalles).length > 50 ? '...' : '') : '-'}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-xs font-mono">
                                                {log.ip || 'N/A'}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            No hay registros de sistema.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
