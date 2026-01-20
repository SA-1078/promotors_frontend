import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import { CartProvider } from '../context/CartContext';

export default function PublicLayout() {
    return (
        <CartProvider>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    <Outlet />
                </main>
                <Footer />
                <CartDrawer />
            </div>
        </CartProvider>
    );
}
