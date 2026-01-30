import RequireAuth from './RequireAuth';
import AdminLayout from '../layouts/AdminLayout';

import UsersManagement from '../pages/admin/UsersManagement';
import MotorcyclesManagement from '../pages/admin/MotorcyclesManagement';
import CategoriesManagement from '../pages/admin/CategoriesManagement';
import InventoryManagement from '../pages/admin/InventoryManagement';
import SalesManagement from '../pages/admin/SalesManagement';
import LeadsManagement from '../pages/admin/LeadsManagement';
import CommentsManagement from '../pages/admin/CommentsManagement';
import SystemLogs from '../pages/admin/SystemLogs';
import AnalyticsDashboard from '../pages/admin/AnalyticsDashboard';
import FaqManagement from '../pages/admin/FaqManagement';

import AdminDashboard from '../pages/admin/AdminDashboard';

// Routes configuration for Admin Panel
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
        { path: 'inventory', element: <InventoryManagement /> },
        { path: 'sales', element: <SalesManagement /> },
        { path: 'leads', element: <LeadsManagement /> },
        { path: 'comments', element: <CommentsManagement /> },
        { path: 'faq', element: <FaqManagement /> },
        { path: 'logs', element: <SystemLogs /> },
        { path: 'analytics', element: <AnalyticsDashboard /> },
    ],
};
