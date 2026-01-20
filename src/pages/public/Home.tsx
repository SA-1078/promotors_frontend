import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gradient-dark">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1920')] bg-cover bg-center opacity-20"></div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-6xl md:text-7xl font-display font-bold mb-6 animate-fade-in">
                        <span className="gradient-text">Encuentra Tu</span>
                        <br />
                        <span className="text-white text-shadow-lg">Motocicleta Ideal</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Las mejores motocicletas al mejor precio. Calidad garantizada y servicio excepcional.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link to="/motorcycles" className="btn-primary">
                            Ver Catálogo
                        </Link>
                        <Link to="/contact" className="btn-outline">
                            Contactar
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-dark-800">
                <div className="container-custom">
                    <h2 className="text-4xl font-display font-bold text-center mb-12">
                        ¿Por Qué <span className="gradient-text">MotoRShop</span>?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card p-8 text-center">
                            <div className="w-16 h-16 bg-gradient-moto rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Calidad Garantizada</h3>
                            <p className="text-gray-400">Todas nuestras motocicletas pasan por rigurosas inspecciones de calidad.</p>
                        </div>

                        <div className="card p-8 text-center">
                            <div className="w-16 h-16 bg-gradient-moto rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Mejores Precios</h3>
                            <p className="text-gray-400">Precios competitivos y opciones de financiamiento disponibles.</p>
                        </div>

                        <div className="card p-8 text-center">
                            <div className="w-16 h-16 bg-gradient-moto rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Servicio Post-Venta</h3>
                            <p className="text-gray-400">Soporte continuo y mantenimiento para tu tranquilidad.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-moto">
                <div className="container-custom text-center">
                    <h2 className="text-4xl font-display font-bold text-white mb-4">
                        ¿Listo para tu próxima aventura?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Explora nuestro catálogo y encuentra la motocicleta perfecta para ti
                    </p>
                    <Link to="/motorcycles" className="btn-secondary bg-white text-dark-900 hover:bg-gray-200">
                        Ver Todas las Motos
                    </Link>
                </div>
            </section>
        </div>
    );
}
