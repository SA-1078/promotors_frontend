export default function AboutUs() {
    const values = [
        {
            icon: (
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            ),
            title: 'Excelencia',
            description: 'Nos esforzamos por ofrecer productos y servicios de la más alta calidad en todo momento.',
            gradient: 'from-yellow-500 to-orange-500'
        },
        {
            icon: (
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
            ),
            title: 'Confianza',
            description: 'Construimos relaciones duraderas basadas en la honestidad y transparencia con nuestros clientes.',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            icon: (
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: 'Pasión',
            description: 'Compartimos el amor por las motocicletas y la emoción de la conducción con nuestra comunidad.',
            gradient: 'from-red-500 to-pink-500'
        },
        {
            icon: (
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: 'Seguridad',
            description: 'Priorizamos la seguridad de nuestros clientes en cada venta y servicio que ofrecemos.',
            gradient: 'from-green-500 to-emerald-500'
        },
        {
            icon: (
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            title: 'Innovación',
            description: 'Constantemente actualizamos nuestro catálogo con las últimas tendencias y tecnologías.',
            gradient: 'from-purple-500 to-violet-500'
        },
        {
            icon: (
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ),
            title: 'Satisfacción',
            description: 'El éxito de nuestros clientes es nuestro éxito. Nos dedicamos a superar sus expectativas.',
            gradient: 'from-amber-500 to-yellow-500'
        }
    ];


    return (
        <div className="min-h-screen bg-dark-900 py-8 sm:py-12">
            <div className="container-custom">
                {/* Hero Header with Gradient */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-orange-600 p-[2px] mb-12">
                    <div className="bg-dark-900 rounded-2xl p-6 md:p-8">
                        <div className="text-center">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-3">
                                <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-orange-500 bg-clip-text text-transparent">
                                    🏍️ Sobre Nosotros
                                </span>
                            </h1>
                            <p className="text-gray-400 text-sm sm:text-base max-w-3xl mx-auto">
                                Más de una década conectando a los amantes de las motocicletas con sus máquinas ideales
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
                    {/* Mission Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 p-[2px] group hover:scale-105 transition-transform">
                        <div className="h-full bg-dark-900 rounded-2xl p-6 md:p-8">
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/50">
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
                    </div>

                    {/* Vision Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-[2px] group hover:scale-105 transition-transform">
                        <div className="h-full bg-dark-900 rounded-2xl p-6 md:p-8">
                            <div className="bg-gradient-to-br from-orange-500 to-red-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/50">
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
                    </div>
                </div>

                {/* Values Section */}
                <div className="mb-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">
                            <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-orange-500 bg-clip-text text-transparent">
                                Nuestros Valores
                            </span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${value.gradient} p-[2px] group hover:scale-105 transition-transform`}
                            >
                                <div className="h-full bg-dark-900 rounded-2xl p-6 text-center">
                                    <div className={`bg-gradient-to-br ${value.gradient} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Our Story */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 p-[2px]">
                    <div className="bg-dark-900 rounded-2xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold mb-6 text-center">
                            <span className="bg-gradient-to-r from-blue-500 via-purple-400 to-orange-500 bg-clip-text text-transparent">
                                Nuestra Historia
                            </span>
                        </h2>
                        <div className="max-w-3xl mx-auto space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                <strong className="text-white">MotoRShop</strong> nació de la pasión por las motocicletas y el deseo de crear un espacio donde los
                                entusiastas pudieran encontrar las mejores opciones del mercado. Fundada hace más de 10 años,
                                comenzamos como un pequeño taller familiar que evolucionó hasta convertirse en una de las
                                plataformas más confiables del sector.
                            </p>
                            <p>
                                A lo largo de nuestra trayectoria, hemos ayudado a <strong className="text-blue-400">miles de clientes</strong> a encontrar la motocicleta
                                de sus sueños. Desde deportivas de alta gama hasta cruisers clásicas, nuestra selección
                                cuidadosamente curada garantiza que cada cliente encuentre exactamente lo que busca.
                            </p>
                            <p>
                                Hoy en día, nos enorgullece ser más que una simple tienda: somos una <strong className="text-orange-400">comunidad de apasionados</strong> que comparten el amor por la libertad, la aventura y la emoción que solo una motocicleta puede
                                ofrecer. <strong className="text-white">Gracias por ser parte de nuestra historia.</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
