import { Card } from '../../components/ui/Card';

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-dark-900 pt-24 pb-16">
            <div className="container-custom">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-display font-bold gradient-text mb-4">
                        Sobre Nosotros
                    </h1>
                    <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                        Más de una década conectando a los amantes de las motocicletas con sus máquinas ideales
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <Card className="hover:border-primary-600/50 transition-all">
                        <div className="p-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-orange rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Nuestra Misión</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Proporcionar a nuestros clientes las mejores motocicletas del mercado con un servicio excepcional,
                                garantizando calidad, seguridad y satisfacción en cada compra. Nos comprometemos a ser el puente
                                entre los entusiastas de las motos y sus sueños sobre dos ruedas.
                            </p>
                        </div>
                    </Card>

                    <Card className="hover:border-primary-600/50 transition-all">
                        <div className="p-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-orange rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Nuestra Visión</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Ser la plataforma líder en la venta de motocicletas, reconocida por nuestra excelencia en el
                                servicio al cliente, variedad de productos y compromiso con la comunidad motociclista. Aspiramos
                                a expandir nuestra presencia y convertirnos en la primera opción para quienes buscan libertad sobre ruedas.
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Values */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center gradient-text mb-10">Nuestros Valores</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: '🏆',
                                title: 'Excelencia',
                                description: 'Nos esforzamos por ofrecer productos y servicios de la más alta calidad en todo momento.'
                            },
                            {
                                icon: '🤝',
                                title: 'Confianza',
                                description: 'Construimos relaciones duraderas basadas en la honestidad y transparencia con nuestros clientes.'
                            },
                            {
                                icon: '🚀',
                                title: 'Pasión',
                                description: 'Compartimos el amor por las motocicletas y la emoción de la conducción con nuestra comunidad.'
                            },
                            {
                                icon: '🛡️',
                                title: 'Seguridad',
                                description: 'Priorizamos la seguridad de nuestros clientes en cada venta y servicio que ofrecemos.'
                            },
                            {
                                icon: '💡',
                                title: 'Innovación',
                                description: 'Constantemente actualizamos nuestro catálogo con las últimas tendencias y tecnologías.'
                            },
                            {
                                icon: '🌟',
                                title: 'Satisfacción',
                                description: 'El éxito de nuestros clientes es nuestro éxito. Nos dedicamos a superar sus expectativas.'
                            }
                        ].map((value, index) => (
                            <Card key={index} className="hover:border-primary-600/50 transition-all text-center">
                                <div className="p-6">
                                    <div className="text-5xl mb-4">{value.icon}</div>
                                    <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                                    <p className="text-gray-400 text-sm">{value.description}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Our Story */}
                <Card className="hover:border-primary-600/50 transition-all">
                    <div className="p-8 md:p-12">
                        <h2 className="text-3xl font-bold gradient-text mb-6 text-center">Nuestra Historia</h2>
                        <div className="max-w-3xl mx-auto space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                MotoRShop nació de la pasión por las motocicletas y el deseo de crear un espacio donde los
                                entusiastas pudieran encontrar las mejores opciones del mercado. Fundada hace más de 10 años,
                                comenzamos como un pequeño taller familiar que evolucionó hasta convertirse en una de las
                                plataformas más confiables del sector.
                            </p>
                            <p>
                                A lo largo de nuestra trayectoria, hemos ayudado a miles de clientes a encontrar la motocicleta
                                de sus sueños. Desde deportivas de alta gama hasta cruisers clásicas, nuestra selección
                                cuidadosamente curada garantiza que cada cliente encuentre exactamente lo que busca.
                            </p>
                            <p>
                                Hoy en día, nos enorgullece ser más que una simple tienda: somos una comunidad de apasionados
                                que comparten el amor por la libertad, la aventura y la emoción que solo una motocicleta puede
                                ofrecer. Gracias por ser parte de nuestra historia.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
