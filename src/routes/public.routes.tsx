import PublicLayout from '../layouts/PublicLayout';
import Home from '../pages/public/Home';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import MotorcyclesCatalog from '../pages/public/MotorcyclesCatalog';
import MotorcycleDetail from '../pages/public/MotorcycleDetail';

export const publicRoutes = {
    path: '/',
    element: <PublicLayout />,
    children: [
        { index: true, element: <Home /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'motorcycles', element: <MotorcyclesCatalog /> },
        { path: 'motorcycles/:id', element: <MotorcycleDetail /> },
    ],
};
