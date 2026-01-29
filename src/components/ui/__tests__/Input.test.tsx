import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';
import '@testing-library/jest-dom';

describe('Input Component', () => {
    test('renders with label', () => {
        render(<Input label="Username" id="username" />);
        const labelElement = screen.getByLabelText(/Username/i);
        expect(labelElement).toBeInTheDocument();
    });

    test('renders with placeholder', () => {
        render(<Input placeholder="Enter text" />);
        const inputElement = screen.getByPlaceholderText(/Enter text/i);
        expect(inputElement).toBeInTheDocument();
    });

    test('handles value changes', () => {
        const handleChange = jest.fn();
        render(<Input onChange={handleChange} />);
        const inputElement = screen.getByRole('textbox');
        fireEvent.change(inputElement, { target: { value: 'New Value' } });
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test('displays error message', () => {
        render(<Input error="Invalid input" />);
        const errorElement = screen.getByText(/Invalid input/i);
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveClass('text-accent-red');
    });

    test('applies fullWidth class by default', () => {
        const { container } = render(<Input />);
        expect(container.firstChild).toHaveClass('w-full');
    });
});
