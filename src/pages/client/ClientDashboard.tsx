import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ClientDashboard() {
    const { user } = useAuth();

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <div className="mb-8 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-3 animate-fade-in">
                    Bienvenido, {user?.nombre}
                </h1>
                <p className="text-gray-400 text-lg">
                    Panel de Cliente
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Card */}
                <div className="bg-dark-800 p-8 rounded-2xl border border-dark-700 shadow-xl relative overflow-hidden group hover:border-primary-500/50 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                        <svg className="w-32 h-32 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-6">Mi Perfil</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-500 text-sm uppercase tracking-wider font-bold">Email</label>
                                <p className="text-xl text-white font-medium">{user?.email}</p>
                            </div>
                            <div>
                                <label className="text-gray-500 text-sm uppercase tracking-wider font-bold">Nombre</label>
                                <p className="text-xl text-white font-medium capitalize">{user?.nombre}</p>
                            </div>
                            <div className="pt-4">
                                <span className="inline-block px-3 py-1 bg-primary-900/50 text-primary-400 rounded-full text-sm font-bold border border-primary-500/20">
                                    Cliente Registrado
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History & Actions Card */}
                <div className="space-y-6">
                    <Link to="/client/history" className="block group">
                        <div className="bg-dark-800 p-8 rounded-2xl border border-dark-700 shadow-xl hover:bg-dark-750 transition-all duration-300 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">Mi Historial</h2>
                                <p className="text-gray-400">Ver motocicletas vistas y buscadas</p>
                            </div>
                            <div className="w-12 h-12 bg-dark-700 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link to="/" className="block group">
                        <div className="bg-gradient-to-r from-primary-900/50 to-dark-800 p-8 rounded-2xl border border-primary-500/20 shadow-xl hover:border-primary-500/40 transition-all duration-300 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Explorar Catálogo</h2>
                                <p className="text-primary-200/70">Buscar nuevas motocicletas</p>
                            </div>
                            <div className="w-12 h-12 bg-primary-600/20 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                                <svg className="w-6 h-6 text-primary-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
