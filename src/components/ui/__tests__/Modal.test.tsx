import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../Modal';
import '@testing-library/jest-dom';

describe('Modal Component', () => {
    test('renders children when isOpen is true', () => {
        render(
            <Modal isOpen={true} onClose={() => { }}>
                <p>Modal Content</p>
            </Modal>
        );
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    test('does not render when isOpen is false', () => {
        render(
            <Modal isOpen={false} onClose={() => { }}>
                <p>Modal Content</p>
            </Modal>
        );
        expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    test('calls onClose when close button is clicked', () => {
        const handleClose = jest.fn();
        render(
            <Modal isOpen={true} onClose={handleClose} title="Test Modal">
                <p>Content</p>
            </Modal>
        );
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]);
        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    test('calls onClose when Escape key is pressed', () => {
        const handleClose = jest.fn();
        render(
            <Modal isOpen={true} onClose={handleClose}>
                <p>Content</p>
            </Modal>
        );
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    test('renders title correctly', () => {
        render(
            <Modal isOpen={true} onClose={() => { }} title="My Modal Title">
                <p>Content</p>
            </Modal>
        );
        expect(screen.getByText('My Modal Title')).toBeInTheDocument();
    });
});
