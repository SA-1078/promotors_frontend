import { api } from './api';

export interface DashboardStats {
    totalSalesCount: number;
    totalUsers: number;
    totalInventoryItems: number;
    lowStockItems: number;
    totalRevenue: number;
}

export const reportsService = {
    getDashboardStats: async () => {
        const response = await api.get<DashboardStats>('/reports/dashboard');
        return response.data;
    }
};
