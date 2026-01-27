import { useState } from 'react';
import { Card } from '../../components/ui/Card';

interface FAQ {
    question: string;
    answer: string;
}

export default function Help() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs: FAQ[] = [
        {
            question: '¿Cómo puedo comprar una motocicleta?',
            answer: 'Puedes explorar nuestro catálogo, seleccionar la motocicleta que te interese, agregarla al carrito y proceder con el pago. También puedes contactarnos directamente para recibir asesoría personalizada.'
        },
        {
            question: '¿Ofrecen financiamiento?',
            answer: 'Sí, trabajamos con diferentes entidades financieras para ofrecerte las mejores opciones de financiamiento. Contáctanos para conocer los planes disponibles según tu perfil.'
        },
        {
            question: '¿Las motocicletas tienen garantía?',
            answer: 'Todas nuestras motocicletas nuevas cuentan con garantía del fabricante. Las motocicletas usadas en excelente estado también incluyen garantía limitada. Consulta los detalles específicos de cada modelo.'
        },
        {
            question: '¿Realizan envíos a todo el país?',
            answer: 'Sí, realizamos envíos a nivel nacional. Los costos y tiempos de entrega varían según la ubicación. Durante el proceso de compra podrás ver las opciones disponibles para tu zona.'
        },
        {
            question: '¿Puedo probar la motocicleta antes de comprar?',
            answer: 'Por supuesto. Ofrecemos pruebas de manejo para que puedas experimentar la motocicleta antes de tomar tu decisión. Contacta con nosotros para agendar tu test drive.'
        },
        {
            question: '¿Aceptan motocicletas usadas como parte de pago?',
            answer: 'Sí, evaluamos tu motocicleta actual y podemos considerarla como parte de pago para tu nueva compra. Contáctanos con los detalles de tu moto para una valoración.'
        },
        {
            question: '¿Qué documentos necesito para comprar?',
            answer: 'Necesitas documento de identidad vigente y, si aplicas a financiamiento, documentos adicionales como comprobantes de ingresos. Te asesoraremos en todo el proceso de documentación.'
        },
        {
            question: '¿Ofrecen servicio de mantenimiento?',
            answer: 'Sí, contamos con taller especializado para mantenimiento preventivo y correctivo. Los clientes que compran con nosotros reciben descuentos especiales en servicios de taller.'
        },
        {
            question: '¿Cómo puedo rastrear mi pedido?',
            answer: 'Una vez confirmada tu compra, recibirás un número de seguimiento por correo electrónico. También puedes contactarnos directamente para conocer el estado de tu pedido en cualquier momento.'
        },
        {
            question: '¿Qué métodos de pago aceptan?',
            answer: 'Aceptamos transferencias bancarias, tarjetas de crédito/débito, y pagos en efectivo en nuestras instalaciones. Para compras en línea, procesamos pagos seguros a través de nuestra plataforma.'
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-dark-900 pt-24 pb-16">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600/10 border border-primary-600/20 text-primary-400 mb-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">Centro de Ayuda</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold gradient-text mb-4">
                        Preguntas Frecuentes
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Encuentra respuestas rápidas a las preguntas más comunes sobre nuestros servicios
                    </p>
                </div>

                {/* FAQ List */}
                <div className="max-w-4xl mx-auto space-y-4 mb-16">
                    {faqs.map((faq, index) => (
                        <Card key={index} className="hover:border-primary-600/50 transition-all overflow-hidden">
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-dark-800/50 transition-colors"
                            >
                                <span className="text-lg font-semibold text-white">
                                    {faq.question}
                                </span>
                                <svg
                                    className={`w-6 h-6 text-primary-400 transform transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-6 pt-0 text-gray-300 leading-relaxed animate-fade-in">
                                    {faq.answer}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>

                {/* Contact Section */}
                <Card className="max-w-4xl mx-auto hover:border-primary-600/50 transition-all">
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-orange rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">
                            ¿No encontraste lo que buscabas?
                        </h2>
                        <p className="text-gray-300 mb-6">
                            Nuestro equipo está listo para ayudarte con cualquier pregunta o inquietud
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-orange text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary-600/20"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Contáctanos
                        </a>
                    </div>
                </Card>
            </div>
        </div>
    );
}
