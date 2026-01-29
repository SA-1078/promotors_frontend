import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contact from '../Contact';
import { crmService } from '../../../services/crm.service';
import '@testing-library/jest-dom';

jest.mock('../../../services/api');

jest.mock('../../../services/crm.service', () => ({
    crmService: {
        createLead: jest.fn()
    }
}));

describe('Contact Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders contact form correctly', () => {
        render(<Contact />);
        expect(screen.getByText(/Contáctanos/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Nombre Completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Mensaje/i)).toBeInTheDocument();
    });

    test('submits form successfully', async () => {
        (crmService.createLead as jest.Mock).mockResolvedValue({ success: true });

        render(<Contact />);
        fireEvent.change(screen.getByLabelText(/Nombre Completo/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '1234567890' } });
        fireEvent.change(screen.getByLabelText(/Mensaje/i), { target: { value: 'Hello, I am interested.' } });

        fireEvent.click(screen.getByRole('button', { name: /Enviar Mensaje/i }));

        await waitFor(() => {
            expect(screen.getByText(/¡Mensaje Enviado!/i)).toBeInTheDocument();
        });

        expect(crmService.createLead).toHaveBeenCalledWith({
            nombre: 'Test User',
            email: 'test@example.com',
            telefono: '1234567890',
            mensaje: 'Hello, I am interested.'
        });
    });

    test('displays error message on submission failure', async () => {
        (crmService.createLead as jest.Mock).mockRejectedValue(new Error('Network Error'));

        render(<Contact />);
        fireEvent.change(screen.getByLabelText(/Nombre Completo/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '1234567890' } });
        fireEvent.change(screen.getByLabelText(/Mensaje/i), { target: { value: 'Hello' } });

        fireEvent.click(screen.getByRole('button', { name: /Enviar Mensaje/i }));

        await waitFor(() => {
            expect(screen.getByText(/Hubo un error al enviar tu mensaje/i)).toBeInTheDocument();
        });
    });
});
