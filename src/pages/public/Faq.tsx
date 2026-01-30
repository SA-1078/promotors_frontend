import { useState, useEffect } from 'react';
import { getPublicFaqs, type Faq } from '../../services/faq.service';

export default function FaqPage() {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        loadFaqs();
    }, []);

    const loadFaqs = async () => {
        try {
            setLoading(true);
            const data = await getPublicFaqs();
            setFaqs(data);
        } catch (error) {
            console.error('Error loading FAQs:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    // Get unique categories
    const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.categoria).filter(Boolean)))];

    // Filter FAQs by category
    const filteredFaqs = selectedCategory === 'all'
        ? faqs
        : faqs.filter(faq => faq.categoria === selectedCategory);

    return (
        <div className="min-h-screen bg-dark-900 pt-24 pb-16">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-display font-bold gradient-text mb-4">
                        Preguntas Frecuentes
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Encuentra respuestas a las preguntas más comunes sobre nuestros productos y servicios
                    </p>
                </div>

                {/* Category Filter */}
                {categories.length > 1 && (
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category || 'all')}
                                className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === category
                                    ? 'bg-gradient-to-r from-primary-600 to-accent-orange text-white shadow-lg'
                                    : 'bg-dark-800 text-gray-400 hover:bg-dark-700 hover:text-white'
                                    }`}
                            >
                                {category === 'all' ? 'Todas' : category}
                            </button>
                        ))}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
                    </div>
                ) : filteredFaqs.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">❓</div>
                        <p className="text-gray-400 text-lg">
                            {selectedCategory === 'all'
                                ? 'No hay preguntas frecuentes disponibles en este momento.'
                                : 'No hay preguntas en esta categoría.'}
                        </p>
                    </div>
                ) : (
                    /* FAQ Accordion */
                    <div className="max-w-4xl mx-auto space-y-4">
                        {filteredFaqs.map((faq, index) => (
                            <div
                                key={faq.id_faq}
                                className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden hover:border-primary-600/50 transition-all"
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-dark-700/50 transition-colors"
                                >
                                    <div className="flex-1 pr-4">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold text-white">
                                                {faq.pregunta}
                                            </h3>
                                            {faq.categoria && (
                                                <span className="px-3 py-1 bg-primary-600/20 text-primary-400 text-xs rounded-full">
                                                    {faq.categoria}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <svg
                                        className={`w-6 h-6 text-primary-400 transition-transform ${activeIndex === index ? 'rotate-180' : ''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {/* Answer - Collapsible */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${activeIndex === index ? 'max-h-96' : 'max-h-0'
                                        }`}
                                >
                                    <div className="px-6 pb-5 pt-2">
                                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                            {faq.respuesta}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Contact CTA */}
                <div className="mt-16 text-center bg-gradient-to-r from-dark-800 to-dark-700 rounded-2xl p-8 border border-dark-600">
                    <h2 className="text-2xl font-bold text-white mb-3">
                        ¿No encontraste tu respuesta?
                    </h2>
                    <p className="text-gray-300 mb-6">
                        Nuestro equipo está listo para ayudarte
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-orange text-white font-bold rounded-lg hover:opacity-90 transition-all shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                        </svg>
                        Contáctanos
                    </a>
                </div>
            </div>
        </div>
    );
}
