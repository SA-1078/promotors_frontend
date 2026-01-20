import { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../../services/users.service';
import type { User } from '../../types';

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
        const colors: Record<string, string> = {
            admin: 'bg-red-500/20 text-red-400',
            empleado: 'bg-blue-500/20 text-blue-400',
            cliente: 'bg-green-500/20 text-green-400',
        };
        return colors[rol] || 'bg-gray-500/20 text-gray-400';
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                        Gestión de Usuarios
                    </h1>
                    <p className="text-gray-400">
                        Administra los usuarios del sistema
                    </p>
                </div>
                <button className="btn-primary">
                    + Nuevo Usuario
                </button>
            </div>

            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                    <p className="text-gray-400 mt-4">Cargando...</p>
                </div>
            )}

            {error && (
                <div className="card p-6 bg-red-500/10 border-red-500">
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-dark-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Nombre</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Teléfono</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rol</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Fecha Registro</th>
                                    <th className="px-6 py-4 text-center text-sm font- semibold text-gray-300">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {users.map((user) => (
                                    <tr key={user.id_usuario} className="hover:bg-dark-700/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-400">{user.id_usuario}</td>
                                        <td className="px-6 py-4 text-white font-medium">{user.nombre}</td>
                                        <td className="px-6 py-4 text-gray-400">{user.email}</td>
                                        <td className="px-6 py-4 text-gray-400">{user.telefono}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.rol)}`}>
                                                {user.rol}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            {new Date(user.fecha_registro).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="text-primary-400 hover:text-primary-300 p-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id_usuario)}
                                                    className="text-red-400 hover:text-red-300 p-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No hay usuarios registrados</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
