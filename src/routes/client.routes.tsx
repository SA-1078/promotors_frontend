import RequireAuth from "./RequireAuth";
import PublicLayout from "../layouts/PublicLayout";
import ClientDashboard from "../pages/client/ClientDashboard";
import ClientHistory from "../pages/client/ClientHistory";
import ClientOrders from "../pages/client/ClientOrders";
import ClientProfile from "../pages/client/ClientProfile";

export const clientRoutes = {
    path: '/client',
    element: (
        <RequireAuth requiredRole="cliente">
            <PublicLayout />
        </RequireAuth>
    ),
    children: [
        { index: true, element: <ClientDashboard /> },
        { path: 'history', element: <ClientHistory /> },
        { path: 'orders', element: <ClientOrders /> },
        { path: 'profile', element: <ClientProfile /> },
    ],
};
