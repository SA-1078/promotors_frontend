import { useState, useEffect } from 'react';
import { crmService } from '../../services/crm.service';
import type { CreateLeadDto } from '../../services/crm.service';
import type { Lead } from '../../types';
import { Card, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Pagination } from '../../components/ui/Pagination';

export default function LeadsManagement() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [formData, setFormData] = useState<CreateLeadDto>({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: '',
        estado: 'Nuevo'
    });

    useEffect(() => {
        loadLeads();
    }, [currentPage]);

    const loadLeads = async () => {
        try {
            setLoading(true);
            const response = await crmService.getLeads({ page: currentPage });
            const data = Array.isArray(response.data) ? response.data :
                (response.data as any).items ? (response.data as any).items : [];
            setLeads(data);
            setTotalItems(data.length);
            setTotalPages(Math.ceil(data.length / 100));
        } catch (error) {
            console.error('Error loading leads', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await crmService.createLead(formData);
            await loadLeads();
            setIsCreateModalOpen(false);
            setFormData({ nombre: '', email: '', telefono: '', mensaje: '', estado: 'Nuevo' });
        } catch (error) {
            alert('Error al crear lead');
        }
    };

    const handleEdit = (lead: Lead) => {
        setSelectedLead(lead);
        setFormData({
            nombre: lead.nombre,
            email: lead.email,
            telefono: lead.telefono,
            mensaje: lead.mensaje,
            estado: lead.estado
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLead) return;
        try {
            await crmService.updateLead(selectedLead.id_lead, formData);
            await loadLeads();
            setIsEditModalOpen(false);
            setSelectedLead(null);
        } catch (error) {
            alert('Error al actualizar lead');
        }
    };

    const handleDelete = async (lead: Lead) => {
        if (!confirm(`¿Eliminar lead de "${lead.nombre}"?`)) return;
        try {
            await crmService.deleteLead(lead.id_lead);
            setLeads(leads.filter(l => l.id_lead !== lead.id_lead));
        } catch (error) {
            alert('Error al eliminar lead');
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
        <div className="p-3 sm:p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold gradient-text mb-2 animate-fade-in">
                    Formularios de Contacto
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
                        <div className="flex gap-4 items-center">
                            <Badge variant="primary" size="sm">{leads.length} Mensajes</Badge>
                            <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
                                Nuevo Lead
                            </Button>
                        </div>
                    </CardHeader>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-dark-800/80 backdrop-blur-sm border-b border-dark-700">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Contacto</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Mensaje</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-4 font-bold text-xs text-primary-300 uppercase tracking-wider text-right">Acciones</th>
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
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    onClick={() => handleEdit(lead)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-10 w-10 p-0 rounded-full text-blue-400 hover:text-white hover:bg-blue-500/20 transition-all"
                                                    title="Editar"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(lead)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-10 w-10 p-0 rounded-full text-red-400 hover:text-white hover:bg-red-500/20 transition-all"
                                                    title="Eliminar"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </Button>
                                            </div>
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

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3 p-4">
                        {leads.map((lead) => (
                            <div key={lead.id_lead} className="bg-dark-800/50 rounded-xl border border-dark-700 p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-bold">{lead.nombre}</p>
                                        <p className="text-gray-400 text-sm">{lead.email}</p>
                                        <p className="text-gray-500 text-xs">{lead.telefono}</p>
                                    </div>
                                    {getStatusBadge(lead.estado)}
                                </div>
                                <div className="pt-3 border-t border-dark-700">
                                    <p className="text-gray-400 text-sm italic">"{lead.mensaje}"</p>
                                </div>
                                <div className="text-xs text-gray-500 pt-2 border-t border-dark-700">
                                    {new Date(lead.fecha).toLocaleString()}
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleEdit(lead)}
                                            variant="ghost"
                                            size="sm"
                                            className="p-0 h-10 w-10 rounded-full text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 transition-all"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(lead)}
                                            variant="ghost"
                                            size="sm"
                                            className="p-0 h-10 w-10 rounded-full text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/20 transition-all"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {leads.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No hay mensajes pendientes.
                            </div>
                        )}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        onPageChange={setCurrentPage}
                    />
                </Card>
            )
            }

            {/* Create Modal */}
            {
                isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
                        <div className="relative bg-dark-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-dark-700">
                            <h2 className="text-2xl font-bold text-white mb-6">Nuevo Lead</h2>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm font-bold mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm font-bold mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm font-bold mb-2">Teléfono</label>
                                    <input
                                        type="tel"
                                        value={formData.telefono}
                                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm font-bold mb-2">Mensaje</label>
                                    <textarea
                                        value={formData.mensaje}
                                        onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 h-24"
                                        required
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <Button type="button" onClick={() => setIsCreateModalOpen(false)} variant="ghost" className="flex-1">Cancelar</Button>
                                    <Button type="submit" variant="primary" className="flex-1">Guardar</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Edit Modal */}
            {
                isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
                        <div className="relative bg-dark-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-dark-700">
                            <h2 className="text-2xl font-bold text-white mb-6">Editar Lead</h2>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm font-bold mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm font-bold mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm font-bold mb-2">Teléfono</label>
                                    <input
                                        type="tel"
                                        value={formData.telefono}
                                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm font-bold mb-2">Estado</label>
                                    <select
                                        value={formData.estado}
                                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                                    >
                                        <option value="Nuevo">Nuevo</option>
                                        <option value="Contactado">Contactado</option>
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Cerrado">Cerrado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm font-bold mb-2">Mensaje</label>
                                    <textarea
                                        value={formData.mensaje}
                                        onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 h-24"
                                        required
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <Button type="button" onClick={() => setIsEditModalOpen(false)} variant="ghost" className="flex-1">Cancelar</Button>
                                    <Button type="submit" variant="primary" className="flex-1">Actualizar</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
