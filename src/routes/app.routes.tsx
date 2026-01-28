import { publicRoutes } from './public.routes';
import { adminRoutes } from './admin.routes';
import { employeeRoutes } from './employee.routes';
import { clientRoutes } from './client.routes';

export const appRoutes = [publicRoutes, adminRoutes, employeeRoutes, clientRoutes];
