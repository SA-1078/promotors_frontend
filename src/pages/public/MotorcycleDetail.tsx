import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMotorcycleById } from '../../services/motorcycles.service';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import type { Motorcycle } from '../../types';

export default function MotorcycleDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            loadMotorcycle(Number(id));
        }
    }, [id]);

    const loadMotorcycle = async (motoId: number) => {
        try {
            setLoading(true);
            const data = await getMotorcycleById(motoId);
            setMotorcycle(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar la motocicleta');
        } finally {
            setLoading(false);
        }
    };

    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (motorcycle) {
            addToCart(motorcycle);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                    <p className="text-gray-400 mt-4">Cargando...</p>
                </div>
            </div>
        );
    }

    if (error || !motorcycle) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="card p-8 max-w-md text-center">
                    <p className="text-red-400 mb-4">{error || 'Motocicleta no encontrada'}</p>
                    <button onClick={() => navigate('/motorcycles')} className="btn-primary">
                        Volver al catálogo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-900 py-12">
            <div className="container-custom">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/motorcycles')}
                    className="flex items-center text-gray-400 hover:text-primary-400 mb-8 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver al catálogo
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div>
                        <div className="card overflow-hidden mb-4">
                            <img
                                src={motorcycle.imagen_url || 'https://via.placeholder.com/800x600?text=Moto'}
                                alt={motorcycle.nombre}
                                className="w-full h-96 object-cover"
                            />
                        </div>
                    </div>

                    {/* Details Section */}
                    <div>
                        <div className="mb-6">
                            <h1 className="text-4xl font-display font-bold text-white mb-3">
                                {motorcycle.nombre}
                            </h1>
                            {motorcycle.categoria && (
                                <span className="inline-block bg-primary-600/20 text-primary-400 px-4 py-2 rounded-full text-sm font-medium">
                                    {motorcycle.categoria.nombre}
                                </span>
                            )}
                        </div>

                        {/* Specs */}
                        <div className="card p-6 mb-6">
                            <h3 className="text-lg font-bold text-white mb-4">Especificaciones</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between border-b border-dark-700 pb-3">
                                    <span className="text-gray-400">Marca</span>
                                    <span className="text-white font-medium">{motorcycle.marca}</span>
                                </div>
                                <div className="flex justify-between border-b border-dark-700 pb-3">
                                    <span className="text-gray-400">Modelo</span>
                                    <span className="text-white font-medium">{motorcycle.modelo}</span>
                                </div>
                                <div className="flex justify-between border-b border-dark-700 pb-3">
                                    <span className="text-gray-400">Año</span>
                                    <span className="text-white font-medium">{motorcycle.anio}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Precio</span>
                                    <span className="text-2xl font-bold gradient-text">
                                        ${motorcycle.precio.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="card p-6 mb-6">
                            <h3 className="text-lg font-bold text-white mb-3">Descripción</h3>
                            <p className="text-gray-300 leading-relaxed">{motorcycle.descripcion}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                className={`btn-primary flex-1 transition-colors ${added ? 'bg-green-600 hover:bg-green-700' : ''}`}
                            >
                                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {added ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    )}
                                </svg>
                                {added ? 'Agregado al Carrito' : 'Agregar al Carrito'}
                            </button>
                            <button className="btn-outline">
                                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Contactar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
