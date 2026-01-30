import { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUser, createUser } from '../../services/users.service';
import { useAuth } from '../../context/AuthContext';
import type { User } from '../../types';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

export default function UsersManagement() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Edit modal state
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        nombre: '',
        email: '',
        telefono: '',
        rol: '',
        password: '' // Optional - if empty, password won't be updated
    });

    // Create modal state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createForm, setCreateForm] = useState({
        nombre: '',
        email: '',
        telefono: '',
        password: '',
        rol: 'cliente'
    });

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

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setEditForm({
            nombre: user.nombre,
            email: user.email,
            telefono: user.telefono,
            rol: user.rol,
            password: '' 
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            // Only send fields that have values
            const updateData: any = {};
            if (editForm.nombre.trim()) updateData.nombre = editForm.nombre.trim();
            if (editForm.email.trim()) updateData.email = editForm.email.trim();
            if (editForm.telefono.trim()) updateData.telefono = editForm.telefono.trim();
            if (editForm.rol) updateData.rol = editForm.rol;
            if (editForm.password && editForm.password.trim()) {
                updateData.password = editForm.password.trim();
            }

            await updateUser(editingUser.id_usuario, updateData);
            setIsEditModalOpen(false);
            setEditingUser(null);
            loadUsers();
            alert('Usuario actualizado exitosamente');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al actualizar usuario');
        }
    };

    const handleOpenCreateModal = () => {
        setCreateForm({
            nombre: '',
            email: '',
            telefono: '',
            password: '',
            rol: 'cliente'
        });
        setIsCreateModalOpen(true);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createUser(createForm);
            setIsCreateModalOpen(false);
            setCreateForm({
                nombre: '',
                email: '',
                telefono: '',
                password: '',
                rol: 'cliente'
            });
            loadUsers();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al crear usuario');
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
        <div className="p-3 sm:p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2 animate-fade-in">
                        Gestión de Usuarios
                    </h1>
                    <p className="text-gray-400">
                        Administra los roles y accesos del sistema
                    </p>
                </div>
                <Button
                    onClick={handleOpenCreateModal}
                    variant="primary"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    }
                >
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
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
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
                                                {currentUser?.rol === 'admin' && (
                                                    <Button
                                                        onClick={() => handleEdit(user)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-10 w-10 p-0 rounded-full text-blue-400 hover:text-white hover:bg-blue-500/20 transition-all"
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                    </Button>
                                                )}
                                                {currentUser?.rol === 'admin' && (
                                                    <Button
                                                        onClick={() => handleDelete(user.id_usuario)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-10 w-10 p-0 rounded-full text-red-400 hover:text-white hover:bg-red-500/20 transition-all"
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3 p-4">
                        {users.map((user) => (
                            <div key={user.id_usuario} className="bg-dark-800/50 rounded-xl border border-dark-700 p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-dark-700 to-dark-600 flex items-center justify-center text-primary-500 font-bold text-lg ring-2 ring-primary-500/30 flex-shrink-0">
                                        {user.nombre.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-bold truncate">{user.nombre}</p>
                                        <p className="text-gray-500 text-xs truncate">{user.email}</p>
                                        <p className="text-gray-400 text-xs mt-1">{user.telefono || 'Sin teléfono'}</p>
                                    </div>
                                    {getRoleBadge(user.rol)}
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-dark-700">
                                    <div>
                                        <p className="text-gray-500 text-xs">Registrado</p>
                                        <p className="text-gray-400 text-sm">{new Date(user.fecha_registro).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {currentUser?.rol === 'admin' && (
                                            <Button
                                                onClick={() => handleEdit(user)}
                                                variant="ghost"
                                                size="sm"
                                                className="h-10 w-10 p-0 rounded-full text-blue-400 hover:text-white hover:bg-blue-500/20"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </Button>
                                        )}
                                        {currentUser?.rol === 'admin' && (
                                            <Button
                                                onClick={() => handleDelete(user.id_usuario)}
                                                variant="ghost"
                                                size="sm"
                                                className="h-10 w-10 p-0 rounded-full text-red-400 hover:text-white hover:bg-red-500/20"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {
                        users.length === 0 && (
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
                        )
                    }
                </Card >
            )
            }

            {/* Edit Modal */}
            {isEditModalOpen && editingUser && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-dark-800 rounded-xl border border-dark-700 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-dark-800 border-b border-dark-700 p-6 z-10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">Editar Usuario</h3>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                            <Input
                                label="Nombre Completo"
                                type="text"
                                value={editForm.nombre}
                                onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                                required
                            />

                            <Input
                                label="Correo Electrónico"
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                required
                            />

                            <Input
                                label="Teléfono"
                                type="text"
                                value={editForm.telefono}
                                onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
                                required
                            />

                            <div>
                                <Input
                                    label="Nueva Contraseña (opcional)"
                                    type="password"
                                    value={editForm.password}
                                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                    placeholder="Dejar vacío para no cambiar"
                                />
                                <p className="text-xs text-gray-500 mt-1">Solo llena este campo si deseas cambiar la contraseña</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Rol</label>
                                <select
                                    value={editForm.rol}
                                    onChange={(e) => setEditForm({ ...editForm, rol: e.target.value })}
                                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    required
                                >
                                    <option value="cliente">Cliente</option>
                                    <option value="empleado">Empleado</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="flex-1"
                                >
                                    Guardar Cambios
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-dark-800 rounded-xl border border-dark-700 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-dark-800 border-b border-dark-700 p-6 z-10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">Crear Nuevo Usuario</h3>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            <Input
                                label="Nombre Completo"
                                type="text"
                                value={createForm.nombre}
                                onChange={(e) => setCreateForm({ ...createForm, nombre: e.target.value })}
                                required
                            />

                            <Input
                                label="Correo Electrónico"
                                type="email"
                                value={createForm.email}
                                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                                required
                            />

                            <Input
                                label="Teléfono"
                                type="text"
                                value={createForm.telefono}
                                onChange={(e) => setCreateForm({ ...createForm, telefono: e.target.value })}
                                required
                            />

                            <Input
                                label="Contraseña"
                                type="password"
                                value={createForm.password}
                                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                                placeholder="••••••••"
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Rol</label>
                                <select
                                    value={createForm.rol}
                                    onChange={(e) => setCreateForm({ ...createForm, rol: e.target.value })}
                                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    required
                                >
                                    <option value="cliente">Cliente</option>
                                    <option value="empleado">Empleado</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="flex-1"
                                >
                                    Crear Usuario
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div >
    );
}
