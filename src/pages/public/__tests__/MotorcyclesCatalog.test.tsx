import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MotorcyclesCatalog from '../MotorcyclesCatalog';
import { getMotorcycles } from '../../../services/motorcycles.service';
import { getCategories } from '../../../services/categories.service';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('../../../services/api');

jest.mock('../../../services/motorcycles.service', () => ({
    getMotorcycles: jest.fn()
}));
jest.mock('../../../services/categories.service', () => ({
    getCategories: jest.fn()
}));

const mockMotorcycles = [
    { id_moto: 1, nombre: 'Moto 1', marca: 'Yamaha', modelo: 'R1', precio: 10000, imagen: 'img1.jpg', id_categoria: 1 },
    { id_moto: 2, nombre: 'Moto 2', marca: 'Honda', modelo: 'CBR', precio: 12000, imagen: 'img2.jpg', id_categoria: 2 },
];

const mockCategories = [
    { id_categoria: 1, nombre: 'Sport', descripcion: 'Sport bikes' },
    { id_categoria: 2, nombre: 'Cruiser', descripcion: 'Cruiser bikes' },
];

describe('MotorcyclesCatalog Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getMotorcycles as jest.Mock).mockResolvedValue(mockMotorcycles);
        (getCategories as jest.Mock).mockResolvedValue(mockCategories);
    });

    test('renders catalog and loads data', async () => {
        render(
            <BrowserRouter>
                <MotorcyclesCatalog />
            </BrowserRouter>
        );

        expect(screen.getByText(/Cargando catálogo/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Moto 1')).toBeInTheDocument();
            expect(screen.getByText('Moto 2')).toBeInTheDocument();
        });
    });

    test('filters motorcycles by search term', async () => {
        render(
            <BrowserRouter>
                <MotorcyclesCatalog />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Moto 1')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText(/Nombre, marca o modelo/i);
        fireEvent.change(searchInput, { target: { value: 'Yamaha' } });

        expect(screen.getByText('Moto 1')).toBeInTheDocument();
        expect(screen.queryByText('Moto 2')).not.toBeInTheDocument();
    });

    test('filters motorcycles by category', async () => {
        render(
            <BrowserRouter>
                <MotorcyclesCatalog />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Moto 1')).toBeInTheDocument();
        });

        const selects = screen.getAllByRole('combobox');
        const categorySelect = selects[0];

        fireEvent.change(categorySelect, { target: { value: '1' } });

        expect(screen.getByText('Moto 1')).toBeInTheDocument();
        expect(screen.queryByText('Moto 2')).not.toBeInTheDocument();
    });

    test('displays empty state when no results found', async () => {
        render(
            <BrowserRouter>
                <MotorcyclesCatalog />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Moto 1')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText(/Nombre, marca o modelo/i);
        fireEvent.change(searchInput, { target: { value: 'NonExistentBike' } });

        expect(screen.getByText(/No se encontraron resultados/i)).toBeInTheDocument();
    });
});
