import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Carousel } from '../../components/ui/Carousel';
import { getMotorcycles } from '../../services/motorcycles.service';
import { getCategories } from '../../services/categories.service';
import { getPublicStats } from '../../services/stats.service';
import type { Motorcycle, Category } from '../../types';

export default function Home() {
    const [featuredMotos, setFeaturedMotos] = useState<Motorcycle[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [stats, setStats] = useState({ totalMotorcycles: 0, totalCategories: 0, totalSales: 0, totalClients: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [motosData, categoriesData, statsData] = await Promise.all([
                    getMotorcycles({ page: 1, limit: 5 }),
                    getCategories(),
                    getPublicStats().catch(() => ({ totalMotorcycles: 0, totalCategories: 0, totalSales: 0, totalClients: 0 }))
                ]);

                setFeaturedMotos(motosData || []);
                setCategories(categoriesData || []);
                setStats(statsData);
            } catch (error) {
                console.error('Error loading home data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <div>
            {/* Hero Carousel Section */}
            <section className="relative">
                {loading ? (
                    <div className="h-[85vh] sm:h-[500px] lg:h-[600px] flex items-center justify-center bg-dark-900">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
                    </div>
                ) : (
                    <Carousel autoPlay interval={6000} className="h-[85vh] sm:h-[500px] lg:h-[600px]">
                        {featuredMotos.length > 0 ? featuredMotos.map((moto) => (
                            <div key={moto.id_moto} className="relative h-[85vh] sm:h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden bg-dark-900">
                                {/* Background Image */}
                                <div className="absolute inset-0 z-0">
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent z-10"></div>
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-50"
                                        style={{ backgroundImage: `url(${moto.imagen_url || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1920'})` }}
                                    ></div>
                                </div>

                                {/* Content */}
                                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                                    <div className="inline-block px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 font-medium text-xs sm:text-sm mb-3 sm:mb-4 backdrop-blur-sm">
                                        {moto.categoria?.nombre || 'Destacado'}
                                    </div>

                                    <h1 className="text-3xl sm:text-5xl lg:text-7xl font-display font-bold mb-3 sm:mb-4 leading-tight">
                                        <span className="gradient-text">{moto.nombre}</span>
                                    </h1>

                                    <p className="text-base sm:text-xl lg:text-2xl text-gray-200 mb-2 sm:mb-3">
                                        {moto.marca} - {moto.modelo}
                                    </p>

                                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-400 mb-4 sm:mb-6">
                                        ${moto.precio.toLocaleString()}
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0 max-w-md sm:max-w-none mx-auto">
                                        <Button to={`/motorcycles/${moto.id_moto}`} variant="primary" size="lg" className="w-full sm:w-auto">
                                            Ver Detalles
                                        </Button>
                                        <Button to="/motorcycles" variant="outline" size="lg" className="w-full sm:w-auto">
                                            Explorar Catálogo
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )) : [(
                            <div key="default" className="relative h-[85vh] sm:h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden bg-dark-900">
                                <div className="absolute inset-0 z-0">
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent z-10"></div>
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1920')] bg-cover bg-center opacity-40"></div>
                                </div>

                                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                                    <h1 className="text-3xl sm:text-5xl lg:text-7xl font-display font-bold mb-4 sm:mb-6">
                                        Encuentra Tu <br /><span className="gradient-text">Motocicleta Ideal</span>
                                    </h1>
                                    <p className="text-base sm:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
                                        Las mejores motocicletas al mejor precio
                                    </p>
                                    <Button to="/motorcycles" variant="primary" size="lg" className="w-full sm:w-auto max-w-xs mx-auto">
                                        Ver Catálogo
                                    </Button>
                                </div>
                            </div>
                        )]}
                    </Carousel>
                )}
            </section>

            {/* Statistics Section */}
            <section className="py-16 bg-dark-800 border-y border-dark-700">
                <div className="container-custom px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-primary-500 mb-2">
                                {stats.totalMotorcycles}+
                            </div>
                            <div className="text-gray-400">Motos en Stock</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-accent-blue mb-2">
                                {stats.totalCategories}
                            </div>
                            <div className="text-gray-400">Categorías</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-accent-orange mb-2">
                                {stats.totalClients}+
                            </div>
                            <div className="text-gray-400">Clientes Felices</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-accent-green mb-2">
                                {stats.totalSales}+
                            </div>
                            <div className="text-gray-400">Ventas Exitosas</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-12 md:py-20 bg-dark-900">
                <div className="container-custom px-6">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold mb-3 md:mb-4">
                            Explora por <span className="gradient-text">Categoría</span>
                        </h2>
                        <p className="text-gray-400 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
                            Encuentra la motocicleta perfecta según tu estilo de conducción
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {categories.slice(0, 8).map((category) => (
                            <Link
                                key={category.id_categoria}
                                to={`/motorcycles?category=${category.id_categoria}`}
                            >
                                <Card variant="glass" hover className="p-4 md:p-6 text-center group cursor-pointer h-full">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-dark-700 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6 md:w-8 md:h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-white mb-2 group-hover:text-primary-400 transition-colors text-sm md:text-base">
                                        {category.nombre}
                                    </h3>
                                    <p className="text-xs md:text-sm text-gray-500 line-clamp-2">
                                        {category.descripcion?.substring(0, 50)}...
                                    </p>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-8 md:mt-10">
                        <Button to="/motorcycles" variant="outline" className="w-full sm:w-auto">
                            Ver Todas las Categorías
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section (Existing) */}
            <section className="py-12 md:py-20 bg-dark-900 relative border-t border-dark-700">
                <div className="container-custom px-6">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold mb-3 md:mb-4">
                            ¿Por Qué Elegir <span className="gradient-text">MotoRShop</span>?
                        </h2>
                        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
                            Nos apasionan las motos tanto como a ti
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <Card variant="glass" hover className="p-6 md:p-8 text-center group">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-dark-800 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform border border-dark-700">
                                <svg className="w-8 h-8 md:w-10 md:h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white group-hover:text-primary-400 transition-colors">
                                Calidad Garantizada
                            </h3>
                            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                Inspecciones rigurosas y certificación de calidad en cada motocicleta
                            </p>
                        </Card>

                        <Card variant="glass" hover className="p-6 md:p-8 text-center group">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-dark-800 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform border border-dark-700">
                                <svg className="w-8 h-8 md:w-10 md:h-10 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white group-hover:text-accent-blue transition-colors">
                                Mejores Precios
                            </h3>
                            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                Precios competitivos y opciones de financiamiento flexibles
                            </p>
                        </Card>

                        <Card variant="glass" hover className="p-6 md:p-8 text-center group">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-dark-800 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform border border-dark-700">
                                <svg className="w-8 h-8 md:w-10 md:h-10 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white group-hover:text-accent-orange transition-colors">
                                Soporte Total
                            </h3>
                            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                Servicio post-venta premium y garantía extendida
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-16 lg:py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-600"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-dark-900 to-transparent"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1920')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

                <div className="container-custom relative z-10 px-6">
                    <div className="text-center md:text-left max-w-2xl mx-auto md:mx-0">
                        <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-4 md:mb-5">
                            ¿Listo para tu próxima aventura?
                        </h2>
                        <p className="text-base md:text-lg text-gray-200 mb-6 md:mb-6">
                            Explora nuestro catálogo premium y encuentra la motocicleta que define tu estilo
                        </p>
                        <Button to="/motorcycles" className="bg-dark-900 text-white hover:bg-dark-800 border border-white/20 text-base md:text-base px-8 md:px-8 py-4 md:py-3.5 shadow-2xl w-full sm:w-auto">
                            Explorar Catálogo
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
