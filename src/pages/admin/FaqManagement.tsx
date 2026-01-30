import { useState, useEffect } from 'react';
import { getAllFaqs, createFaq, updateFaq, deleteFaq, type Faq, type CreateFaqDto } from '../../services/faq.service';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Card } from '../../components/ui/Card';

export default function FaqManagement() {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState<CreateFaqDto>({
        pregunta: '',
        respuesta: '',
        categoria: '',
        orden: 0,
        activo: true
    });

    useEffect(() => {
        loadFaqs();
    }, []);

    const loadFaqs = async () => {
        try {
            setLoading(true);
            const response = await getAllFaqs(1, 100, searchTerm);
            setFaqs(response.items || []);
        } catch (error) {
            console.error('Error loading FAQs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (faq?: Faq) => {
        if (faq) {
            setEditingFaq(faq);
            setFormData({
                pregunta: faq.pregunta,
                respuesta: faq.respuesta,
                categoria: faq.categoria || '',
                orden: faq.orden,
                activo: faq.activo
            });
        } else {
            setEditingFaq(null);
            setFormData({
                pregunta: '',
                respuesta: '',
                categoria: '',
                orden: 0,
                activo: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingFaq(null);
        setFormData({
            pregunta: '',
            respuesta: '',
            categoria: '',
            orden: 0,
            activo: true
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingFaq) {
                await updateFaq(editingFaq.id_faq, formData);
            } else {
                await createFaq(formData);
            }
            handleCloseModal();
            loadFaqs();
        } catch (error) {
            console.error('Error saving FAQ:', error);
            alert('Error al guardar la pregunta frecuente');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar esta FAQ?')) return;

        try {
            await deleteFaq(id);
            loadFaqs();
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            alert('Error al eliminar la pregunta frecuente');
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 pt-24 pb-16">
            <div className="container-custom">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-display font-bold gradient-text mb-2">
                            Gestión de Preguntas Frecuentes
                        </h1>
                        <p className="text-gray-400">
                            Administra las preguntas frecuentes que se mostrarán a los usuarios
                        </p>
                    </div>
                    <Button onClick={() => handleOpenModal()}>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nueva FAQ
                    </Button>
                </div>

                <div className="mb-6">
                    <Input
                        placeholder="Buscar preguntas..."
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        onKeyUp={() => loadFaqs()}
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <Card key={faq.id_faq} className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-xl font-bold text-white">
                                                {faq.pregunta}
                                            </h3>
                                            {faq.categoria && (
                                                <span className="px-3 py-1 bg-primary-600/20 text-primary-400 text-sm rounded-full">
                                                    {faq.categoria}
                                                </span>
                                            )}
                                            <span className={`px-3 py-1 text-sm rounded-full ${faq.activo ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}`}>
                                                {faq.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 mb-3">
                                            {faq.respuesta}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Orden: {faq.orden}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleOpenModal(faq)}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(faq.id_faq)}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {faqs.length === 0 && (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">❓</div>
                                <p className="text-gray-400 text-lg">No hay preguntas frecuentes</p>
                                <Button onClick={() => handleOpenModal()} className="mt-4">
                                    Crear la primera FAQ
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingFaq ? 'Editar FAQ' : 'Nueva FAQ'}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Pregunta"
                            value={formData.pregunta}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, pregunta: e.target.value })}
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Respuesta
                            </label>
                            <textarea
                                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-600"
                                rows={4}
                                value={formData.respuesta}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, respuesta: e.target.value })}
                                required
                            />
                        </div>

                        <Input
                            label="Categoría (opcional)"
                            value={formData.categoria}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, categoria: e.target.value })}
                        />

                        <Input
                            label="Orden"
                            type="number"
                            value={(formData.orden ?? 0).toString()}
                            onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
                        />

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="activo"
                                checked={formData.activo}
                                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <label htmlFor="activo" className="text-sm text-gray-300">
                                Activo (visible para usuarios)
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="submit" className="flex-1">
                                {editingFaq ? 'Actualizar' : 'Crear'}
                            </Button>
                            <Button type="button" variant="secondary" onClick={handleCloseModal} className="flex-1">
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
}
