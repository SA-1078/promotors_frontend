import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

describe('Button Component', () => {
    test('renders button with text', () => {
        render(<Button>Click Me</Button>);
        const buttonElement = screen.getByText(/Click Me/i);
        expect(buttonElement).toBeInTheDocument();
    });

    test('calls onClick handler when clicked', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);
        const buttonElement = screen.getByText(/Click Me/i);
        fireEvent.click(buttonElement);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('renders loading state correctly', () => {
        render(<Button isLoading>Click Me</Button>);
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toBeDisabled();
        const spinner = buttonElement.querySelector('svg');
        expect(spinner).toBeInTheDocument();
    });

    test('renders as a link when "to" prop is provided', () => {
        render(
            <BrowserRouter>
                <Button to="/home">Go Home</Button>
            </BrowserRouter>
        );
        const linkElement = screen.getByRole('link', { name: /Go Home/i });
        expect(linkElement).toHaveAttribute('href', '/home');
    });

    test('applies variant classes correctly', () => {
        render(<Button variant="danger">Delete</Button>);
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toHaveClass('bg-red-600');
    });
});
