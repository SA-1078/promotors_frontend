import { useState, useEffect } from 'react';
import { getMotorcycles } from '../../services/motorcycles.service';
import { getCategories } from '../../services/categories.service';
import type { Motorcycle, Category } from '../../types';
import MotorcycleCard from '../../components/motorcycles/MotorcycleCard';

export default function MotorcyclesCatalog() {
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
    }, []);

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

    // Filter motorcycles
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
        <div className="min-h-screen bg-dark-900 py-12">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold gradient-text mb-3">
                        Catálogo de Motocicletas
                    </h1>
                    <p className="text-gray-400">
                        Explora nuestra colección de {motorcycles.length} motocicletas
                    </p>
                </div>

                {/* Filters */}
                <div className="card p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Buscar
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Nombre, marca o modelo..."
                                className="input"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Categoría
                            </label>
                            <select
                                value={selectedCategory || ''}
                                onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                                className="input"
                            >
                                <option value="">Todas las categorías</option>
                                {categories.map((cat) => (
                                    <option key={cat.id_categoria} value={cat.id_categoria}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Brand Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Marca
                            </label>
                            <select
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                                className="input"
                            >
                                <option value="">Todas las marcas</option>
                                {brands.map((brand) => (
                                    <option key={brand} value={brand}>
                                        {brand}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(selectedCategory || selectedBrand || searchTerm) && (
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-sm text-gray-400">Filtros activos:</span>
                            {searchTerm && (
                                <span className="text-xs bg-primary-600/20 text-primary-400 px-3 py-1 rounded-full">
                                    "{searchTerm}"
                                </span>
                            )}
                            {selectedCategory && (
                                <span className="text-xs bg-primary-600/20 text-primary-400 px-3 py-1 rounded-full">
                                    {categories.find(c => c.id_categoria === selectedCategory)?.nombre}
                                </span>
                            )}
                            {selectedBrand && (
                                <span className="text-xs bg-primary-600/20 text-primary-400 px-3 py-1 rounded-full">
                                    {selectedBrand}
                                </span>
                            )}
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory(null);
                                    setSelectedBrand('');
                                }}
                                className="text-xs text-red-400 hover:text-red-300 underline ml-2"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-6 text-gray-400">
                    {filteredMotorcycles.length} {filteredMotorcycles.length === 1 ? 'motocicleta encontrada' : 'motocicletas encontradas'}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                        <p className="text-gray-400 mt-4">Cargando motocicletas...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="card p-6 bg-red-500/10 border-red-500 text-center">
                        <p className="text-red-400">{error}</p>
                        <button onClick={loadData} className="btn-primary mt-4">
                            Reintentar
                        </button>
                    </div>
                )}

                {/* Motorcycles Grid */}
                {!loading && !error && (
                    <>
                        {filteredMotorcycles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredMotorcycles.map((motorcycle) => (
                                    <MotorcycleCard key={motorcycle.id_moto} motorcycle={motorcycle} />
                                ))}
                            </div>
                        ) : (
                            <div className="card p-12 text-center">
                                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-xl font-bold text-gray-400 mb-2">
                                    No se encontraron motocicletas
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Intenta ajustar los filtros de búsqueda
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory(null);
                                        setSelectedBrand('');
                                    }}
                                    className="btn-secondary"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
