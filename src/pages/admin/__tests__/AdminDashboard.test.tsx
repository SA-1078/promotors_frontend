import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboard from '../AdminDashboard';
import { reportsService } from '../../../services/reports.service';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('../../../services/api');

jest.mock('../../../services/reports.service', () => ({
    reportsService: {
        getDashboardStats: jest.fn()
    }
}));

const mockStats = {
    totalRevenue: 50000,
    totalSalesCount: 150,
    totalUsers: 25,
    totalInventoryItems: 100,
    lowStockItems: 5,
};

describe('AdminDashboard Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (reportsService.getDashboardStats as jest.Mock).mockResolvedValue(mockStats);
    });

    test('renders dashboard and loads stats', async () => {
        render(
            <BrowserRouter>
                <AdminDashboard />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Panel de Administración')).toBeInTheDocument();
        });

        expect(screen.getByText('Ventas Totales')).toBeInTheDocument();
        expect(screen.getByText(/\$50,000/)).toBeInTheDocument();

        expect(screen.getAllByText('Usuarios').length).toBeGreaterThan(0);
        expect(screen.getByText('25')).toBeInTheDocument();

        expect(screen.getByText('Catálogo')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();

        expect(screen.getByText('Bajo Stock')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    test('renders quick access links', async () => {
        render(
            <BrowserRouter>
                <AdminDashboard />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Nueva Moto')).toBeInTheDocument();
        });

        expect(screen.getByText('Ver Pedidos')).toBeInTheDocument();
        expect(screen.getByText('Inventario')).toBeInTheDocument();
        expect(screen.getAllByText('Usuarios').length).toBeGreaterThan(0);
    });

    test('handles empty stats gracefully', async () => {
        (reportsService.getDashboardStats as jest.Mock).mockResolvedValue({
            totalRevenue: 0,
            totalSalesCount: 0,
            totalUsers: 0,
            totalInventoryItems: 0,
            lowStockItems: 0,
        });

        render(
            <BrowserRouter>
                <AdminDashboard />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Ventas Totales')).toBeInTheDocument();
        });

        const zeros = screen.getAllByText('0');
        expect(zeros.length).toBeGreaterThan(0);
        expect(screen.getByText('Todo en orden')).toBeInTheDocument(); // Condition for 0 low stock
    });
});
