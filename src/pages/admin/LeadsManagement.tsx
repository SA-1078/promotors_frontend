import { useState, useEffect } from 'react';
import { crmService } from '../../services/crm.service';
import type { Lead } from '../../types';
import { Card, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export default function LeadsManagement() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeads();
    }, []);

    const loadLeads = async () => {
        try {
            setLoading(true);
            const response = await crmService.getLeads();
            // Assuming response.data contains pagination or array directly, adjusting based on typical patterns
            // Use 'any' temporarily if type mismatch, but aiming for proper typing through service
            setLeads(Array.isArray(response.data) ? response.data :
                (response.data as any).items ? (response.data as any).items : []);
        } catch (error) {
            console.error('Error loading leads', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'nuevo' || s === 'new') return <Badge variant="info" size="sm">NUEVO</Badge>;
        if (s === 'contactado') return <Badge variant="success" size="sm">CONTACTADO</Badge>;
        if (s === 'pendiente') return <Badge variant="warning" size="sm">PENDIENTE</Badge>;
        return <Badge variant="dark" size="sm">{status.toUpperCase()}</Badge>;
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold gradient-text mb-2 animate-fade-in">
                    Mensajes de Contacto
                </h1>
                <p className="text-gray-400">
                    Gestiona las consultas recibidas desde el formulario web.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <Card variant="glass" className="overflow-hidden border-dark-700 shadow-xl">
                    <CardHeader className="flex justify-between items-center bg-dark-800/50">
                        <h3 className="text-lg font-semibold text-white">Bandeja de Entrada</h3>
                        <Badge variant="primary" size="sm">{leads.length} Mensajes</Badge>
                    </CardHeader>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-dark-800/80 backdrop-blur-sm border-b border-dark-700">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Contacto</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Mensaje</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {leads.map((lead) => (
                                    <tr key={lead.id_lead} className="hover:bg-dark-700/30 transition-colors group">
                                        <td className="px-6 py-4 text-gray-400 text-sm whitespace-nowrap font-mono">
                                            {new Date(lead.fecha).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-white">
                                            {lead.nombre}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-300">{lead.email}</div>
                                            <div className="text-xs text-gray-500">{lead.telefono}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 max-w-xs truncate" title={lead.mensaje}>
                                            "{lead.mensaje}"
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(lead.estado)}
                                        </td>
                                    </tr>
                                ))}
                                {leads.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            No hay mensajes pendientes.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
}
