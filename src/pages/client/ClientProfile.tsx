import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { api } from '../../services/api';

interface UserProfile {
    id_usuario: number;
    nombre: string;
    email: string;
    telefono?: string;
    rol: string;
    fecha_registro: string;
}

export default function ClientProfile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/auth/profile');
            const userData = response.data.data || response.data;
            setProfile(userData);
        } catch (error) {
            console.error('Error loading profile:', error);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Error al cargar perfil</h2>
                    <p className="text-gray-400 mb-4">No se pudo cargar tu información. Por favor verifica tu sesión.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-all"
                    >
                        Volver atrás
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-900 p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-orange-600 p-[2px] mb-8">
                    <div className="bg-dark-900 rounded-2xl p-6 md:p-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Volver atrás
                        </button>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-2">
                                    👤 Mi Perfil
                                </h1>
                                <p className="text-gray-400 text-sm sm:text-base">
                                    Administra tu información personal
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Card */}
                <Card>
                    <div className="p-6 md:p-8">
                        <div className="space-y-6">
                            <div className="flex items-center justify-center mb-8">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                    {profile?.nombre.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Nombre
                                    </label>
                                    <p className="text-white text-lg">{profile?.nombre}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Email
                                    </label>
                                    <p className="text-white text-lg">{profile?.email}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Teléfono
                                    </label>
                                    <p className="text-white text-lg">{profile?.telefono || 'No especificado'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Rol
                                    </label>
                                    <p className="text-white text-lg capitalize">{profile?.rol}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Fecha de Registro
                                    </label>
                                    <p className="text-white text-lg">
                                        {profile?.fecha_registro ? new Date(profile.fecha_registro).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'No disponible'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
