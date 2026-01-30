import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const getHistory = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/view-history/history`);
    return response.data;
};

interface HistoryItem {
    id_historial: number;
    tipo: 'vista' | 'busqueda';
    termino_busqueda?: string;
    motocicleta?: {
        id_moto: number;
        nombre: string;
        marca: string;
        modelo: string;
        imagen_url?: string;
    };
    fecha: string;
}

export default function ClientHistory() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const response = await getHistory();
            if (response.data) {
                setHistory(response.data);
            }
        } catch (error) {
            console.error('Error loading history:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold gradient-text mb-2 animate-fade-in">
                    Mi Historial
                </h1>
                <p className="text-gray-400">
                    Tu actividad reciente en la plataforma.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <div className="space-y-6">
                    <Card variant="glass" className="overflow-hidden border-dark-700 shadow-xl">
                        <CardHeader className="flex justify-between items-center bg-dark-800/50">
                            <h3 className="text-lg font-semibold text-white">Actividad Reciente</h3>
                            <Badge variant="primary" size="sm">{history.length} Eventos</Badge>
                        </CardHeader>

                        <div className="divide-y divide-dark-700">
                            {history.map((item) => (
                                <div key={item.id_historial} className="p-4 flex items-center gap-4 hover:bg-dark-700/30 transition-colors">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.tipo === 'vista' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                        {item.tipo === 'vista' ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        {item.tipo === 'vista' && item.motocicleta ? (
                                            <p className="text-white font-medium">
                                                Viste la motocicleta <span className="text-primary-400 font-bold">{item.motocicleta.nombre}</span>
                                            </p>
                                        ) : (
                                            <p className="text-white font-medium">
                                                Buscaste: "<span className="text-primary-400 font-bold">{item.termino_busqueda}</span>"
                                            </p>
                                        )}
                                        <p className="text-gray-500 text-xs mt-1">
                                            {new Date(item.fecha).toLocaleString()}
                                        </p>
                                    </div>
                                    {item.motocicleta?.imagen_url && (
                                        <div className="w-16 h-12 bg-dark-800 rounded border border-dark-600 overflow-hidden flex-shrink-0 hidden sm:block">
                                            <img src={item.motocicleta.imagen_url} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {history.length === 0 && (
                                <div className="p-12 text-center text-gray-500">
                                    No tienes actividad reciente.
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
