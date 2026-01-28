import RequireAuth from "./RequireAuth";
import EmployeeLayout from "../layouts/EmployeeLayout";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import SalesManagement from "../pages/employee/SalesManagement";
import MotorcyclesManagement from "../pages/employee/MotorcyclesManagement";
import InventoryManagement from "../pages/employee/InventoryManagement";
import LeadsManagement from "../pages/employee/LeadsManagement";
import CommentsManagement from "../pages/employee/CommentsManagement";
import CategoriesManagement from "../pages/employee/CategoriesManagement";

export const employeeRoutes = {
    path: '/employee',
    element: (
        <RequireAuth requiredRole="empleado">
            <EmployeeLayout />
        </RequireAuth>
    ),
    children: [
        { index: true, element: <EmployeeDashboard /> },
        { path: 'sales', element: <SalesManagement /> },
        { path: 'motorcycles', element: <MotorcyclesManagement /> },
        { path: 'categories', element: <CategoriesManagement /> },
        { path: 'inventory', element: <InventoryManagement /> },
        { path: 'leads', element: <LeadsManagement /> },
        { path: 'comments', element: <CommentsManagement /> },
    ],
};
