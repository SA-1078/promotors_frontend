import { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../../services/users.service';
import type { User } from '../../types';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function UsersManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

        try {
            await deleteUser(id);
            setUsers(users.filter(u => u.id_usuario !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al eliminar');
        }
    };

    const getRoleBadge = (rol: string) => {
        switch (rol) {
            case 'admin': return <Badge variant="danger" size="sm">Admin</Badge>;
            case 'empleado': return <Badge variant="info" size="sm">Empleado</Badge>;
            case 'cliente': return <Badge variant="success" size="sm">Cliente</Badge>;
            default: return <Badge variant="dark" size="sm">{rol}</Badge>;
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2 animate-fade-in">
                        Gestión de Usuarios
                    </h1>
                    <p className="text-gray-400">
                        Administra los roles y accesos del sistema
                    </p>
                </div>
                <Button variant="primary" icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                }>
                    Nuevo Usuario
                </Button>
            </div>

            {loading && (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                    <p className="text-gray-400 mt-4 animate-pulse">Cargando base de datos...</p>
                </div>
            )}

            {error && (
                <Card variant="outline" className="p-6 border-accent-red/50 text-center mb-8 bg-accent-red/5">
                    <p className="text-accent-red font-medium">{error}</p>
                    <Button onClick={loadUsers} variant="ghost" className="mt-4 text-accent-red hover:bg-accent-red/10">
                        Reintentar
                    </Button>
                </Card>
            )}

            {!loading && !error && (
                <Card variant="glass" className="overflow-hidden border-dark-700 shadow-2xl">
                    <CardHeader className="flex justify-between items-center bg-dark-800/50">
                        <h3 className="text-lg font-semibold text-white">Lista de Usuarios Registrados</h3>
                        <Badge variant="primary" size="sm">{users.length} Total</Badge>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-dark-800/80 backdrop-blur-sm border-b border-dark-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-300 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-300 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-300 uppercase tracking-wider">Contacto</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-300 uppercase tracking-wider">Rol</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-300 uppercase tracking-wider">Registro</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-primary-300 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {users.map((user) => (
                                    <tr key={user.id_usuario} className="hover:bg-dark-700/30 transition-colors group">
                                        <td className="px-6 py-4 text-gray-400 font-mono text-xs">#{user.id_usuario}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-dark-700 to-dark-600 flex items-center justify-center text-primary-500 font-bold text-sm ring-2 ring-transparent group-hover:ring-primary-500/30 transition-all">
                                                    {user.nombre.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-bold text-white">{user.nombre}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 text-sm">
                                            {user.telefono || <span className="text-gray-600 italic">Sin teléfono</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getRoleBadge(user.rol)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            {new Date(user.fecha_registro).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full text-blue-400 hover:text-white hover:bg-blue-500/20 transition-all">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(user.id_usuario)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-10 w-10 p-0 rounded-full text-red-400 hover:text-white hover:bg-red-500/20 transition-all"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-1">No hay usuarios</h3>
                            <p className="text-gray-400 text-sm mb-4">Comienza agregando un nuevo usuario al sistema</p>
                            <Button variant="secondary" size="sm">
                                Crear Primer Usuario
                            </Button>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
}
