import { useState, useEffect } from 'react';
import { crmService } from '../../services/crm.service';
import type { Lead } from '../../types';

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
            setLeads(Array.isArray(response.data) ? response.data : response.data.items || []);
        } catch (error) {
            console.error('Error loading leads', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 animate-fade-in">
            <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                Mensajes de Contacto
            </h1>
            <p className="text-gray-400 mb-8">
                Gestiona las consultas recibidas desde el formulario web.
            </p>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <div className="bg-dark-800 rounded-xl overflow-hidden shadow-xl border border-dark-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-dark-900 border-b border-dark-700">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-400">Fecha</th>
                                    <th className="px-6 py-4 font-semibold text-gray-400">Cliente</th>
                                    <th className="px-6 py-4 font-semibold text-gray-400">Contacto</th>
                                    <th className="px-6 py-4 font-semibold text-gray-400">Mensaje</th>
                                    <th className="px-6 py-4 font-semibold text-gray-400">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {leads.map((lead) => (
                                    <tr key={lead.id_lead} className="hover:bg-dark-700/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-400 text-sm whitespace-nowrap">
                                            {new Date(lead.fecha).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white">
                                            {lead.nombre}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-300">{lead.email}</div>
                                            <div className="text-sm text-gray-500">{lead.telefono}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 max-w-xs truncate" title={lead.mensaje}>
                                            {lead.mensaje}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs border border-blue-500/20">
                                                {lead.estado}
                                            </span>
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
                </div>
            )}
        </div>
    );
}
