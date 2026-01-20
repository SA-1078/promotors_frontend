import RequireAuth from './RequireAuth';
import AdminLayout from '../layouts/AdminLayout';

import UsersManagement from '../pages/admin/UsersManagement';
import MotorcyclesManagement from '../pages/admin/MotorcyclesManagement';
import CategoriesManagement from '../pages/admin/CategoriesManagement';

// Placeholder for admin dashboard
function AdminDashboard() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-display font-bold gradient-text mb-4">
                Panel de Administración
            </h1>
            <p className="text-gray-400">
                Bienvenido al panel de administración de MotoRShop
            </p>
        </div>
    );
}

export const adminRoutes = {
    path: '/admin',
    element: (
        <RequireAuth requiredRole="admin">
            <AdminLayout />
        </RequireAuth>
    ),
    children: [
        { index: true, element: <AdminDashboard /> },
        { path: 'users', element: <UsersManagement /> },
        { path: 'motorcycles', element: <MotorcyclesManagement /> },
        { path: 'categories', element: <CategoriesManagement /> },
    ],
};
