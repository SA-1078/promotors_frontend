import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { Card, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

interface TopView {
    motocicleta_id: number;
    count: number;
    modelo?: string;
}

interface TopSearch {
    termino: string;
    count: number;
}

export default function AnalyticsDashboard() {
    const [topViews, setTopViews] = useState<TopView[]>([]);
    const [topSearches, setTopSearches] = useState<TopSearch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [viewsRes, searchesRes] = await Promise.all([
                    api.get<{ success: boolean; data: TopView[] }>('/view-history/analytics/top-views'),
                    api.get<{ success: boolean; data: TopSearch[] }>('/view-history/analytics/top-searches')
                ]);

                setTopViews(viewsRes.data.data);
                setTopSearches(searchesRes.data.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const COLORS = ['#F97316', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6">
            <div>
                <h1 className="text-3xl font-display font-bold gradient-text mb-2 animate-fade-in">
                    Analítica de Visitas y Búsquedas
                </h1>
                <p className="text-gray-400">
                    Descubre qué motos son las más populares y qué buscan tus clientes.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Views Chart */}
                <Card variant="glass" className="border-dark-700 shadow-xl overflow-hidden flex flex-col h-full">
                    <CardHeader className="flex items-center justify-between border-b border-dark-700 bg-dark-800/50 p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-500/10 rounded-lg">
                                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white">Motos Más Vistas</h2>
                        </div>
                    </CardHeader>

                    <div className="p-6 flex-1 min-h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topViews} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                                <XAxis type="number" stroke="#9CA3AF" />
                                <YAxis
                                    type="category"
                                    dataKey="modelo"
                                    stroke="#9CA3AF"
                                    width={140}
                                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#374151', opacity: 0.4 }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-dark-800 border border-dark-600 p-3 rounded-lg shadow-xl">
                                                    <p className="text-white font-bold mb-1">{payload[0].payload.modelo}</p>
                                                    <p className="text-primary-400 font-mono">{payload[0].value} Vistas</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="count" name="Vistas" radius={[0, 4, 4, 0]}>
                                    {topViews.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Top Searches List */}
                <Card variant="glass" className="border-dark-700 shadow-xl overflow-hidden flex flex-col h-full">
                    <CardHeader className="flex items-center justify-between border-b border-dark-700 bg-dark-800/50 p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent-orange/10 rounded-lg">
                                <svg className="w-5 h-5 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white">Términos Más Buscados</h2>
                        </div>
                    </CardHeader>

                    <div className="p-6 space-y-4">
                        {topSearches.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No hay búsquedas registradas aún.</p>
                        ) : (
                            topSearches.map((search, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-dark-900/50 rounded-xl hover:bg-dark-800/80 transition-all group border border-dark-700/50 hover:border-dark-600">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-lg ${index === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-black' :
                                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                                                index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' : 'bg-dark-700 text-gray-400'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <span className="text-gray-200 font-medium group-hover:text-white transition-colors text-lg">
                                            "{search.termino}"
                                        </span>
                                    </div>
                                    <Badge variant="primary">
                                        {search.count} Busq.
                                    </Badge>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
