import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMotorcycles } from '../../services/motorcycles.service';
import { getCategories } from '../../services/categories.service';
import type { Motorcycle, Category } from '../../types';
import MotorcycleCard from '../../components/motorcycles/MotorcycleCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
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

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory(null);
        setSelectedBrand('');
    };

    return (
        <div className="min-h-screen bg-dark-900 py-8 sm:py-12">
            <div className="container-custom">
                {/* Header with Gradient */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-orange-600 p-[2px] mb-8">
                    <div className="bg-dark-900 rounded-2xl p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-2">
                                    <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-orange-500 bg-clip-text text-transparent">
                                        🏍️ Catálogo de Motocicletas
                                    </span>
                                </h1>
                                <p className="text-gray-400 text-sm sm:text-base">
                                    Explora nuestra colección de motocicletas de alto rendimiento
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Disponibles</p>
                                    <p className="text-2xl font-bold text-white">{motorcycles.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Card */}
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 mb-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary-500/20 p-2 rounded-lg">
                            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white">Filtros de Búsqueda</h2>
                    </div>

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
                                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none transition-all hover:bg-dark-600"
                                >
                                    <option value="">Todas las categorías</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id_categoria} value={cat.id_categoria}>
                                            {cat.nombre}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
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
                                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none transition-all hover:bg-dark-600"
                                >
                                    <option value="">Todas las marcas</option>
                                    {brands.map((brand) => (
                                        <option key={brand} value={brand}>
                                            {brand}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(selectedCategory || selectedBrand || searchTerm) && (
                        <div className="mt-6 pt-6 border-t border-dark-700 flex flex-wrap items-center gap-3">
                            <span className="text-sm text-gray-400 font-medium">Filtros activos:</span>
                            {searchTerm && (
                                <Badge variant="primary" size="sm" className="flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    "{searchTerm}"
                                </Badge>
                            )}
                            {selectedCategory && (
                                <Badge variant="info" size="sm" className="flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {categories.find(c => c.id_categoria === selectedCategory)?.nombre}
                                </Badge>
                            )}
                            {selectedBrand && (
                                <Badge variant="success" size="sm" className="flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                    {selectedBrand}
                                </Badge>
                            )}
                            <button
                                onClick={clearFilters}
                                className="text-sm text-red-400 hover:text-red-300 underline ml-auto transition-colors font-medium flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Limpiar todo
                            </button>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-6 flex justify-between items-center px-1">
                    <p className="text-gray-400 text-sm sm:text-base">
                        <span className="font-semibold text-white">{filteredMotorcycles.length}</span> {filteredMotorcycles.length === 1 ? 'motocicleta encontrada' : 'motocicletas encontradas'}
                    </p>
                    {!loading && !error && motorcycles.length > 0 && (
                        <button
                            onClick={loadData}
                            className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
                            title="Actualizar catálogo"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Actualizar
                        </button>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="w-10 h-10 bg-primary-500/20 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <p className="text-gray-400 mt-4 animate-pulse">Cargando catálogo...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-8 text-center max-w-lg mx-auto">
                        <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Error al cargar el catálogo</h3>
                        <p className="text-red-400 mb-6">{error}</p>
                        <Button onClick={loadData} variant="danger">
                            Reintentar
                        </Button>
                    </div>
                )}

                {/* Motorcycles Grid */}
                {!loading && !error && (
                    <>
                        {filteredMotorcycles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                {filteredMotorcycles.map((motorcycle) => (
                                    <MotorcycleCard key={motorcycle.id_moto} motorcycle={motorcycle} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-dark-800/50 border-2 border-dashed border-dark-700 rounded-2xl p-12 sm:p-16 text-center">
                                <svg className="w-20 h-20 text-dark-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    No se encontraron resultados
                                </h3>
                                <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                                    No hay motocicletas que coincidan con tu búsqueda. Intenta con otros términos.
                                </p>
                                <Button onClick={clearFilters} variant="secondary">
                                    Borrar Filtros
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
