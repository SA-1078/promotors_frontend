import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark-900 border-t border-dark-700 mt-auto">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-display font-bold gradient-text mb-4">
                            MotoRShop
                        </h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Tu destino para las mejores motocicletas. Calidad, variedad y servicio excepcional.
                        </p>
                        {/* Social Media Icons */}
                        <div className="flex gap-4">
                            {/* FACEBOOK: Reemplaza '#' con tu link de perfil */}
                            <a href="#" /* <--- PON TU LINK DE FACEBOOK AQUI (Ej: https://facebook.com/motorshop) */ className="text-gray-400 hover:text-blue-500 transition-colors">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>

                            {/* INSTAGRAM: Reemplaza '#' con tu link de perfil */}
                            <a href="#" /* <--- PON TU LINK DE INSTAGRAM AQUI */ className="text-gray-400 hover:text-pink-500 transition-colors">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.027 2 12.315 2zm-8.03 3.65c-.07.01-.15.025-.213.048-.48.176-.84.45-1.11.895-.145.24-.265.55-.308.995-.038.397-.047.618-.047 3.538 0 2.92.009 3.14.047 3.538.043.444.163.754.308.994.27.444.63.719 1.11.895.234.086.533.141.93.178.67.062 1.385.068 5.093.068 3.7.001 4.416-.007 5.088-.068.397-.037.696-.092.93-.178.48-.176.84-.451 1.11-.895.145-.24.265-.55.308-.994.038-.398.047-.618.047-3.538 0-2.92-.009-3.14-.047-3.538-.043-.444-.163-.754-.308-.994-.27-.444-.63-.718-1.11-.895-.234-.086-.533-.141-.93-.178-.67-.063-1.385-.069-5.093-.069-3.7-.001-4.416.007-5.088.068-.396.037-.695.092-.93.178zM12.316 7.042a4.96 4.96 0 110 9.92 4.96 4.96 0 010-9.92zm0 1.833a3.127 3.127 0 100 6.254 3.127 3.127 0 000-6.254zm5.324-2.822a1.22 1.22 0 100 2.44 1.22 1.22 0 000-2.44z" clipRule="evenodd" />
                                </svg>
                            </a>

                            {/* WHATSAPP: Reemplaza '#' con tu link de contacto */}
                            <a href="#" /* <--- PON TU LINK DE WHATSAPP AQUI */ className="text-gray-400 hover:text-green-500 transition-colors">
                                <span className="sr-only">WhatsApp</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.012 2c-5.506 0-9.989 4.475-9.99 9.972 0 1.763.458 3.486 1.332 5.013L2.25 21.75l4.908-1.284c1.47.803 3.13 1.226 4.846 1.227h.008c5.505 0 9.988-4.476 9.99-9.973.002-2.665-1.036-5.17-2.92-7.054C17.2 2.802 14.686 2.001 12.012 2zM6.578 17.653l-.265-.157c-1.25-1.99-1.39-3.824-1.388-5.524.004-4.57 3.73-8.29 8.307-8.29 2.217 0 4.3 0.862 5.867 2.427 1.566 1.564 2.427 3.645 2.425 5.86-.003 4.57-3.732 8.288-8.31 8.288-1.666 0-3.308-.415-4.786-1.2l-.23-.125-2.83.74.756-2.776c-.012.008-1.956-1.35-1.956-1.35zm11.366-4.22c-.244-.122-1.442-.71-1.665-.792-.223-.082-.385-.122-.547.122-.162.245-.628.793-.77.955-.14.163-.283.183-.526.06-.243-.12-1.028-.378-1.96-1.206-.723-.645-1.21-1.441-1.352-1.685-.142-.245-.015-.377.107-.498.11-.11.243-.285.365-.427.122-.143.162-.244.243-.406.082-.163.04-.305-.02-.427-.06-.122-.547-1.317-.75-1.803-.197-.473-.397-.408-.547-.416-.142-.007-.304-.007-.466-.007-.162 0-.426.06-.648.305-.223.244-.852.833-.852 2.031 0 1.198.872 2.355.993 2.518.122.162 1.716 2.62 4.156 3.674 2.44 1.054 2.44 1.054 2.885 1.002.445-.052 1.442-.589 1.645-1.157.202-.569.202-1.056.142-1.157-.06-.101-.223-.162-.466-.284z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Navegación</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/motorcycles" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                                    Catálogo
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Categorías</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                                    Deportivas
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                                    Cruiser
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                                    Touring
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Contacto</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>Email: contacto@motorshop.com</li>
                            <li>Tel: +593 995 029 29</li>
                            <li>Quito, Ecuador</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-dark-700 mt-8 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {currentYear} MotoRShop. <br></br>Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
