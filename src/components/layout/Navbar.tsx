import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { setIsCartOpen, itemCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-dark-800 border-b border-dark-700 sticky top-0 z-50">
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-orange rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <span className="text-2xl font-display font-bold gradient-text">
                            MotoRShop
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors">
                            Inicio
                        </Link>
                        <Link to="/motorcycles" className="text-gray-300 hover:text-primary-400 transition-colors">
                            Catálogo
                        </Link>
                        <Link to="/contact" className="text-gray-300 hover:text-primary-400 transition-colors">
                            Contacto
                        </Link>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                {/* Shopping Cart Button */}
                                <button
                                    onClick={() => setIsCartOpen(true)}
                                    className="text-gray-300 hover:text-primary-400 transition-colors relative p-2"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {itemCount > 0 && (
                                        <span className="absolute top-0 right-0 bg-accent-orange text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                            {itemCount}
                                        </span>
                                    )}
                                </button>

                                {/* Panel Button - Show for all logged users */}
                                <Link
                                    to="/admin"
                                    className="bg-yellow-500 hover:bg-yellow-600 text-dark-900 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Mi Panel
                                </Link>

                                {/* User Info Display */}
                                <div className="bg-dark-700 px-4 py-2 rounded-lg">
                                    <p className="text-sm text-white">
                                        Hola, <span className="font-semibold">{user.nombre}</span>
                                    </p>
                                    <p className="text-xs text-gray-400 capitalize">{user.rol}</p>
                                </div>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Salir
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-primary-400 transition-colors px-4 py-2"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
