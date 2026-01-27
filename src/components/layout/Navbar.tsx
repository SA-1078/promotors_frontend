import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { setIsCartOpen, itemCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <nav className="bg-dark-800/95 backdrop-blur-lg border-b border-dark-700/50 sticky top-0 z-50 shadow-lg">
                <div className="container-custom">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo - SIN CAMBIOS */}
                        <Link to="/" className="flex items-center space-x-3" onClick={closeMobileMenu}>
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-orange rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">M</span>
                            </div>
                            <span className="text-2xl font-display font-bold gradient-text">
                                MotoRShop
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-2">
                            <Link
                                to="/"
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/')
                                        ? 'text-white bg-primary-600/20 border border-primary-600/30'
                                        : 'text-gray-300 hover:text-white hover:bg-dark-700'
                                    }`}
                            >
                                Inicio
                            </Link>
                            <Link
                                to="/motorcycles"
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/motorcycles')
                                        ? 'text-white bg-primary-600/20 border border-primary-600/30'
                                        : 'text-gray-300 hover:text-white hover:bg-dark-700'
                                    }`}
                            >
                                Catálogo
                            </Link>

                            {/* Dropdown Menu for Extra Pages */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${['/categories', '/reviews', '/about', '/help'].includes(location.pathname)
                                            ? 'text-white bg-primary-600/20 border border-primary-600/30'
                                            : 'text-gray-300 hover:text-white hover:bg-dark-700'
                                        }`}
                                >
                                    Más
                                    <svg
                                        className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Content */}
                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-56 bg-dark-800 border border-dark-700 rounded-lg shadow-xl overflow-hidden">
                                        <Link
                                            to="/categories"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 transition-colors ${isActive('/categories')
                                                    ? 'bg-primary-600/20 text-white'
                                                    : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                                                }`}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                            </svg>
                                            <span>Categorías</span>
                                        </Link>
                                        <Link
                                            to="/reviews"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 transition-colors ${isActive('/reviews')
                                                    ? 'bg-primary-600/20 text-white'
                                                    : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                                                }`}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                            <span>Reseñas</span>
                                        </Link>
                                        <Link
                                            to="/about"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 transition-colors ${isActive('/about')
                                                    ? 'bg-primary-600/20 text-white'
                                                    : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                                                }`}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Nosotros</span>
                                        </Link>
                                        <Link
                                            to="/help"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 transition-colors ${isActive('/help')
                                                    ? 'bg-primary-600/20 text-white'
                                                    : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                                                }`}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Ayuda</span>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <Link
                                to="/contact"
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/contact')
                                        ? 'text-white bg-primary-600/20 border border-primary-600/30'
                                        : 'text-gray-300 hover:text-white hover:bg-dark-700'
                                    }`}
                            >
                                Contacto
                            </Link>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            {user ? (
                                <>
                                    {/* Cart Icon */}
                                    <button
                                        onClick={() => setIsCartOpen(true)}
                                        className="relative p-2.5 text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        {itemCount > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-xs font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                                                {itemCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Desktop: User Menu */}
                                    <div className="hidden md:flex items-center gap-2">
                                        <Link
                                            to="/admin"
                                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-dark-900 rounded-lg font-semibold transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            Panel
                                        </Link>

                                        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-dark-700/50 border border-dark-600 rounded-lg">
                                            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {user.nombre.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-white">{user.nombre}</span>
                                                <span className="text-xs text-gray-400 capitalize">{user.rol}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleLogout}
                                            className="p-2.5 text-red-400 hover:text-white hover:bg-red-600/20 rounded-lg transition-all"
                                            title="Cerrar sesión"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="hidden md:flex items-center gap-2">
                                    <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg font-medium transition-all">
                                        Entrar
                                    </Link>
                                    <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-primary-600 to-accent-orange text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary-600/20">
                                        Registrarse
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2.5 text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={closeMobileMenu}
            />

            {/* Mobile Menu Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-72 bg-dark-900 border-l border-dark-700 z-50 transform transition-transform duration-300 ease-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between p-4 border-b border-dark-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-orange rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">M</span>
                            </div>
                            <span className="text-xl font-display font-bold gradient-text">MotoRShop</span>
                        </div>
                        <button
                            onClick={closeMobileMenu}
                            className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* User Info - Mobile */}
                    {user && (
                        <div className="p-4 bg-gradient-to-r from-primary-600/10 to-accent-orange/10 border-b border-dark-700">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-orange rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                    {user.nombre.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-white font-semibold">{user.nombre}</p>
                                    <p className="text-xs text-gray-400 capitalize">{user.rol}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-1">
                        <Link
                            to="/"
                            onClick={closeMobileMenu}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive('/')
                                    ? 'bg-primary-600/20 text-white border border-primary-600/30'
                                    : 'text-gray-300 hover:text-white hover:bg-dark-800'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Inicio
                        </Link>

                        <Link
                            to="/motorcycles"
                            onClick={closeMobileMenu}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive('/motorcycles')
                                    ? 'bg-primary-600/20 text-white border border-primary-600/30'
                                    : 'text-gray-300 hover:text-white hover:bg-dark-800'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Catálogo
                        </Link>

                        <Link
                            to="/categories"
                            onClick={closeMobileMenu}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive('/categories')
                                    ? 'bg-primary-600/20 text-white border border-primary-600/30'
                                    : 'text-gray-300 hover:text-white hover:bg-dark-800'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            Categorías
                        </Link>

                        <Link
                            to="/reviews"
                            onClick={closeMobileMenu}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive('/reviews')
                                    ? 'bg-primary-600/20 text-white border border-primary-600/30'
                                    : 'text-gray-300 hover:text-white hover:bg-dark-800'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Reseñas
                        </Link>

                        <Link
                            to="/about"
                            onClick={closeMobileMenu}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive('/about')
                                    ? 'bg-primary-600/20 text-white border border-primary-600/30'
                                    : 'text-gray-300 hover:text-white hover:bg-dark-800'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Nosotros
                        </Link>

                        <Link
                            to="/help"
                            onClick={closeMobileMenu}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive('/help')
                                    ? 'bg-primary-600/20 text-white border border-primary-600/30'
                                    : 'text-gray-300 hover:text-white hover:bg-dark-800'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Ayuda
                        </Link>

                        <Link
                            to="/contact"
                            onClick={closeMobileMenu}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive('/contact')
                                    ? 'bg-primary-600/20 text-white border border-primary-600/30'
                                    : 'text-gray-300 hover:text-white hover:bg-dark-800'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Contacto
                        </Link>
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-4 border-t border-dark-700 space-y-2">
                        {user ? (
                            <>
                                <Link
                                    to="/admin"
                                    onClick={closeMobileMenu}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-dark-900 rounded-lg font-semibold transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Mi Panel
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-red-600 text-red-400 hover:bg-red-600 hover:text-white rounded-lg font-semibold transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={closeMobileMenu}
                                    className="flex items-center justify-center w-full px-4 py-3 border-2 border-primary-600 text-primary-400 hover:bg-primary-600 hover:text-white rounded-lg font-semibold transition-all"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={closeMobileMenu}
                                    className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-orange text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
