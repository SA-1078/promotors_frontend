import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMotorcycles } from '../../services/motorcycles.service';
import { getCategories } from '../../services/categories.service';
import type { Motorcycle, Category } from '../../types';
import MotorcycleCard from '../../components/motorcycles/MotorcycleCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export default function MotorcyclesCatalog() {
    const [searchParams] = useSearchParams();
    const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');

    useEffect(() => {
        loadData();
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setSelectedCategory(parseInt(categoryParam));
        }
    }, [searchParams]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [motosData, catsData] = await Promise.all([
                getMotorcycles(),
                getCategories(),
            ]);

            setMotorcycles(motosData);
            setCategories(catsData);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const filteredMotorcycles = motorcycles.filter((moto) => {
        if (selectedCategory && moto.id_categoria !== selectedCategory) return false;
        if (selectedBrand && moto.marca.toLowerCase() !== selectedBrand.toLowerCase()) return false;
        if (searchTerm && !moto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !moto.marca.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !moto.modelo.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    // Get unique brands
    const brands = Array.from(new Set(motorcycles.map(m => m.marca)));

    return (
        <div className="min-h-screen bg-dark-900 py-8 sm:py-12">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-6 sm:mb-8 text-center md:text-left px-4 sm:px-0">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold gradient-text mb-2 sm:mb-3">
                        Catálogo de Motocicletas
                    </h1>
                    <p className="text-gray-400 text-base sm:text-lg">
                        Explora nuestra colección de motocicletas de alto rendimiento
                    </p>
                </div>

                {/* Filters */}
                <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-dark-800/80 backdrop-blur-sm border-dark-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        {/* Search */}
                        <Input
                            label="Buscar"
                            placeholder="Nombre, marca o modelo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            }
                        />

                        {/* Category Filter */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1.5 ml-1">
                                Categoría
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedCategory || ''}
                                    onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 appearance-none"
                                >
                                    <option value="">Todas las categorías</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id_categoria} value={cat.id_categoria}>
                                            {cat.nombre}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Brand Filter */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1.5 ml-1">
                                Marca
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedBrand}
                                    onChange={(e) => setSelectedBrand(e.target.value)}
                                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 appearance-none"
                                >
                                    <option value="">Todas las marcas</option>
                                    {brands.map((brand) => (
                                        <option key={brand} value={brand}>
                                            {brand}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(selectedCategory || selectedBrand || searchTerm) && (
                        <div className="mt-4 sm:mt-6 pt-4 border-t border-dark-700 flex flex-wrap items-center gap-2 sm:gap-3">
                            <span className="text-xs sm:text-sm text-gray-400">Filtros activos:</span>
                            {searchTerm && (
                                <Badge variant="primary" size="sm" className="flex items-center gap-1 text-xs">
                                    🔍 "{searchTerm}"
                                </Badge>
                            )}
                            {selectedCategory && (
                                <Badge variant="info" size="sm" className="flex items-center gap-1 text-xs">
                                    🏷️ {categories.find(c => c.id_categoria === selectedCategory)?.nombre}
                                </Badge>
                            )}
                            {selectedBrand && (
                                <Badge variant="success" size="sm" className="flex items-center gap-1 text-xs">
                                    🏍️ {selectedBrand}
                                </Badge>
                            )}
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory(null);
                                    setSelectedBrand('');
                                }}
                                className="text-xs text-accent-red hover:text-red-400 underline ml-auto transition-colors font-medium"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                </Card>

                {/* Results Count */}
                <div className="mb-4 sm:mb-6 flex justify-between items-center text-gray-400 text-sm sm:text-base px-4 sm:px-0">
                    <p>{filteredMotorcycles.length} {filteredMotorcycles.length === 1 ? 'motocicleta encontrada' : 'motocicletas encontradas'}</p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                        <p className="text-gray-400 mt-4 animate-pulse">Cargando catálogo...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <Card className="p-8 bg-accent-red/5 border-accent-red/20 text-center max-w-lg mx-auto">
                        <div className="w-16 h-16 bg-accent-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-accent-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Error al cargar</h3>
                        <p className="text-red-400 mb-6">{error}</p>
                        <Button onClick={loadData} variant="danger" size="sm">
                            Reintentar Conexión
                        </Button>
                    </Card>
                )}

                {/* Motorcycles Grid */}
                {!loading && !error && (
                    <>
                        {filteredMotorcycles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                                {filteredMotorcycles.map((motorcycle) => (
                                    <MotorcycleCard key={motorcycle.id_moto} motorcycle={motorcycle} />
                                ))}
                            </div>
                        ) : (
                            <Card className="p-12 sm:p-16 text-center border-dashed border-dark-600 bg-transparent">
                                <svg className="w-16 h-16 sm:w-20 sm:h-20 text-dark-500 mx-auto mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                                    No se encontraron resultados
                                </h3>
                                <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8 max-w-sm mx-auto">
                                    No hay motocicletas que coincidan con tu búsqueda. Intenta con otros términos.
                                </p>
                                <Button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory(null);
                                        setSelectedBrand('');
                                    }}
                                    variant="secondary"
                                    size="sm"
                                >
                                    Borrar Filtros
                                </Button>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
