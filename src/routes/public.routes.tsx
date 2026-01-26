import PublicLayout from '../layouts/PublicLayout';
import Home from '../pages/public/Home';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import ForgotPassword from '../pages/public/ForgotPassword';
import MotorcyclesCatalog from '../pages/public/MotorcyclesCatalog';
import MotorcycleDetail from '../pages/public/MotorcycleDetail';
import PaymentSuccess from '../pages/public/PaymentSuccess';
import Contact from '../pages/public/Contact';

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
        { path: 'contact', element: <Contact /> },
    ],
};
