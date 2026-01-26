import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function Home() {
    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[500px] md:h-[700px] flex items-center justify-center overflow-hidden bg-dark-900">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1920')] bg-cover bg-center opacity-40 transform hover:scale-105 transition-transform duration-[20s]"></div>
                </div>

                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
                    <div className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 font-medium text-xs sm:text-sm mb-4 sm:mb-6 backdrop-blur-sm animate-fade-in">
                        🚀 La experiencia definitiva en dos ruedas
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold mb-4 sm:mb-8 animate-slide-up leading-tight">
                        Encuentra Tu <br />
                        <span className="gradient-text">Motocicleta Ideal</span>
                    </h1>

                    <p className="text-base sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Las mejores motocicletas al mejor precio. Calidad garantizada y servicio excepcional para tu próxima aventura.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Button to="/motorcycles" variant="primary" size="lg" icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        }>
                            Ver Catálogo
                        </Button>
                        <Button to="/contact" variant="outline" size="lg">
                            Contactar
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 sm:py-24 bg-dark-900 relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-dark-700 to-transparent"></div>

                <div className="container-custom">
                    <div className="text-center mb-10 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-3 sm:mb-4">
                            ¿Por Qué Elegir <span className="gradient-text">MotoRShop</span>?
                        </h2>
                        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
                            Nos apasionan las motos tanto como a ti. Ofrecemos una experiencia de compra transparente y premium.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card variant="glass" hover className="p-8 text-center group">
                            <div className="w-20 h-20 bg-dark-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-dark-700 group-hover:border-primary-500/30 shadow-lg">
                                <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-primary-400 transition-colors">Calidad Garantizada</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Todas nuestras motocicletas pasan por rigurosas inspecciones de 150 puntos certificadas por expertos.
                            </p>
                        </Card>

                        <Card variant="glass" hover className="p-8 text-center group">
                            <div className="w-20 h-20 bg-dark-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-dark-700 group-hover:border-primary-500/30 shadow-lg">
                                <svg className="w-10 h-10 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-accent-blue transition-colors">Mejores Precios</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Garantizamos precios competitivos y ofrecemos las mejores opciones de financiamiento del mercado.
                            </p>
                        </Card>

                        <Card variant="glass" hover className="p-8 text-center group">
                            <div className="w-20 h-20 bg-dark-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-dark-700 group-hover:border-primary-500/30 shadow-lg">
                                <svg className="w-10 h-10 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-accent-orange transition-colors">Soporte Total</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Servicio post-venta premium, mantenimiento especializado y garantía extendida para tu tranquilidad.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-600"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-dark-900 to-transparent"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1920')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

                <div className="container-custom relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="text-left max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                            ¿Listo para tu próxima aventura?
                        </h2>
                        <p className="text-xl text-gray-200">
                            Explora nuestro catálogo premium y encuentra la motocicleta que define tu estilo.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <Button to="/motorcycles" className="bg-white text-primary-600 hover:bg-gray-100 hover:text-primary-700 border-none text-lg px-10 py-5 shadow-2xl">
                            Explorar Catálogo
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
