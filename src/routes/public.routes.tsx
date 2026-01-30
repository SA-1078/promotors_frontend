import PublicLayout from '../layouts/PublicLayout';
import Home from '../pages/public/Home';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import ForgotPassword from '../pages/public/ForgotPassword';
import MotorcyclesCatalog from '../pages/public/MotorcyclesCatalog';
import MotorcycleDetail from '../pages/public/MotorcycleDetail';
import PaymentSuccess from '../pages/public/PaymentSuccess';
import Contact from '../pages/public/Contact';
import Categories from '../pages/public/Categories';
import Reviews from '../pages/public/Reviews';
import AboutUs from '../pages/public/AboutUs';
import Faq from '../pages/public/Faq';

export const publicRoutes = {
    path: '/',
    element: <PublicLayout />,
    children: [
        { index: true, element: <Home /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'forgot-password', element: <ForgotPassword /> },
        { path: 'motorcycles', element: <MotorcyclesCatalog /> },
        { path: 'motorcycles/:id', element: <MotorcycleDetail /> },
        { path: 'pago-exitoso', element: <PaymentSuccess /> },
        { path: 'categories', element: <Categories /> },
        { path: 'reviews', element: <Reviews /> },
        { path: 'about', element: <AboutUs /> },
        { path: 'help', element: <Faq /> },
        { path: 'faq', element: <Faq /> },
        { path: 'contact', element: <Contact /> },
    ],
};

