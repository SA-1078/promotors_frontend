import type { Motorcycle } from '../../types';
import { Link } from 'react-router-dom';

interface MotorcycleCardProps {
    motorcycle: Motorcycle;
}

export default function MotorcycleCard({ motorcycle }: MotorcycleCardProps) {
    return (
        <Link to={`/motorcycles/${motorcycle.id_moto}`} className="block">
            <div className="card hover:scale-105 transition-transform duration-300 h-full">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-dark-700">
                    <img
                        src={motorcycle.imagen_url || 'https://via.placeholder.com/400x300?text=Moto'}
                        alt={motorcycle.nombre}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        ${motorcycle.precio.toLocaleString()}
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                        {motorcycle.nombre}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                        <span>{motorcycle.marca}</span>
                        <span>•</span>
                        <span>{motorcycle.modelo}</span>
                        <span>•</span>
                        <span>{motorcycle.anio}</span>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {motorcycle.descripcion}
                    </p>

                    <div className="flex items-center justify-between">
                        {motorcycle.categoria && (
                            <span className="text-xs bg-dark-700 text-primary-400 px-3 py-1 rounded-full">
                                {motorcycle.categoria.nombre}
                            </span>
                        )}
                        <span className="text-primary-400 text-sm font-medium">
                            Ver detalles →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
