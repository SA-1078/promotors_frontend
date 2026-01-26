import { useState, useEffect } from 'react';
import { systemLogsService } from '../../services/systemLogs.service';
import { getUsers } from '../../services/users.service';
import type { SystemLog, User } from '../../types';
import { Card, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

export default function SystemLogs() {
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [users, setUsers] = useState<Record<number, User>>({});
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);

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

    const getActionBadge = (action: string) => {
        const a = action.toUpperCase();
        if (a === 'LOGIN') return <Badge variant="success" size="sm">LOGIN</Badge>;
        if (a === 'LOGOUT') return <Badge variant="dark" size="sm">LOGOUT</Badge>;
        if (a === 'ERROR') return <Badge variant="danger" size="sm">ERROR</Badge>;
        if (a.includes('CREATE')) return <Badge variant="info" size="sm">{action}</Badge>;
        if (a.includes('UPDATE')) return <Badge variant="warning" size="sm">{action}</Badge>;
        if (a.includes('DELETE')) return <Badge variant="danger" size="sm">{action}</Badge>;
        return <Badge variant="dark" size="sm">{action}</Badge>;
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold gradient-text mb-2 animate-fade-in">
                    Logs del Sistema
                </h1>
                <p className="text-gray-400">
                    Historial de acciones y eventos de seguridad.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <Card variant="glass" className="overflow-hidden border-dark-700 shadow-xl">
                    <CardHeader className="flex justify-between items-center bg-dark-800/50">
                        <h3 className="text-lg font-semibold text-white">Actividad Reciente</h3>
                        <Badge variant="primary" size="sm">{logs.length} Eventos</Badge>
                    </CardHeader>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-dark-800/80 backdrop-blur-sm border-b border-dark-700">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Acción</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider text-right">Ver Detalles</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {logs.map((log) => {
                                    const user = log.usuario_id ? users[log.usuario_id] : null;

                                    return (
                                        <tr key={log._id || Math.random()} className="hover:bg-dark-700/30 transition-colors group">
                                            <td className="px-6 py-4 text-gray-400 text-sm whitespace-nowrap font-mono">
                                                {log.fecha ? new Date(log.fecha).toLocaleString('es-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit'
                                                }) : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-white text-sm">{user.nombre}</span>
                                                        <span className="text-xs text-gray-500">{user.email}</span>
                                                    </div>
                                                ) : <span className="text-gray-500 text-sm italic">User #{log.usuario_id || '?'}</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getActionBadge(log.accion)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    onClick={() => setSelectedLog(log)}
                                                    variant="secondary"
                                                    size="sm"
                                                    className="bg-dark-700/50 hover:bg-primary-600/20 text-gray-400 hover:text-primary-400 border-dark-600"
                                                >
                                                    Ver
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                            No hay registros de sistema.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3 p-4">
                        {logs.map((log) => {
                            const user = log.usuario_id ? users[log.usuario_id] : null;
                            return (
                                <div key={log._id || Math.random()} className="bg-dark-800/50 rounded-xl border border-dark-700 p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            {getActionBadge(log.accion)}
                                            <p className="text-gray-400 text-xs font-mono mt-2">
                                                {log.fecha ? new Date(log.fecha).toLocaleString('es-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) : 'N/A'}
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => setSelectedLog(log)}
                                            variant="secondary"
                                            size="sm"
                                            className="bg-dark-700/50 hover:bg-primary-600/20 text-gray-400 hover:text-primary-400 border-dark-600"
                                        >
                                            Ver
                                        </Button>
                                    </div>
                                    <div className="pt-2 border-t border-dark-700/50">
                                        {user ? (
                                            <div>
                                                <p className="text-white font-bold text-sm">{user.nombre}</p>
                                                <p className="text-gray-500 text-xs">{user.email}</p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm italic">User #{log.usuario_id || '?'}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {logs.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No hay registros de sistema.
                            </div>
                        )}
                    </div>
                </Card>
            )}

            {/* Detail Modal */}
            <Modal
                isOpen={!!selectedLog}
                onClose={() => setSelectedLog(null)}
                title="Detalle del Evento"
                size="md"
            >
                {selectedLog && (() => {
                    const user = selectedLog.usuario_id ? users[selectedLog.usuario_id] : null;
                    const details = selectedLog.detalles || {};
                    const browserInfo = details.browser || details.user_agent || 'Desconocido';
                    const cleanDetails = Object.entries(details).filter(([key]) =>
                        !['browser', 'user_agent', 'email', 'role', 'password'].includes(key) && !key.startsWith('_')
                    );

                    return (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-dark-900/50 p-4 rounded-xl border border-dark-700">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Acción</label>
                                    <div className="mt-1">{getActionBadge(selectedLog.accion)}</div>
                                </div>
                                <div className="bg-dark-900/50 p-4 rounded-xl border border-dark-700">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Fecha</label>
                                    <div className="text-white font-mono text-sm">
                                        {new Date(selectedLog.fecha).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-dark-700 pt-4">
                                <h4 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Usuario
                                </h4>
                                <div className="bg-dark-900 p-4 rounded-xl text-sm border border-dark-700">
                                    {user ? (
                                        <div className="space-y-1">
                                            <div className="text-white font-bold text-lg">{user.nombre}</div>
                                            <div className="text-primary-400">{user.email}</div>
                                            <div className="text-gray-500 text-xs uppercase tracking-wider font-bold mt-2">{user.rol}</div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-500 italic">Usuario ID: {selectedLog.usuario_id}</span>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-dark-700 pt-4">
                                <h4 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Datos Técnicos (Privado)
                                </h4>
                                <div className="bg-dark-900/50 p-4 rounded-xl text-sm border border-dark-700 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Dirección IP:</span>
                                        <span className="font-mono text-white bg-dark-800 px-2 py-1 rounded border border-dark-600">
                                            {selectedLog.ip === '::1' ? '127.0.0.1' : selectedLog.ip}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Navegador:</span>
                                        <span className="font-medium text-white flex items-center gap-2">
                                            {/* Browser Icon Logic */}
                                            {browserInfo.includes('Chrome') || browserInfo.includes('Brave') ? (
                                                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5c2.394 0 4.516.902 6.136 2.385l-1.928 3.336H8.208l-2.028-3.51C8.261 5.352 10.056 4.5 12 4.5zM4.5 12c0-1.874.708-3.597 1.868-4.915l3.522 6.101-1.928 3.339A7.458 7.458 0 014.5 12zm7.5 7.5c-2.485 0-4.664-.972-6.26-2.564l2.028-3.51h7.464l1.928 3.339A7.468 7.468 0 0112 19.5z" /></svg>
                                            ) : (
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                            )}
                                            {browserInfo.length > 50 ? 'Navegador Web' : browserInfo}
                                        </span>
                                    </div>

                                    {cleanDetails.length > 0 && (
                                        <div className="pt-2 border-t border-dark-700/50 mt-2">
                                            <p className="text-xs text-gray-500 mb-2">Otros Detalles:</p>
                                            <div className="grid grid-cols-1 gap-1">
                                                {cleanDetails.map(([key, value]) => (
                                                    <div key={key} className="flex justify-between text-xs">
                                                        <span className="text-gray-500">{key}:</span>
                                                        <span className="text-gray-300 font-mono text-right">{String(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })()}

                <div className="mt-8 flex justify-end">
                    <Button onClick={() => setSelectedLog(null)} variant="secondary">
                        Cerrar
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
