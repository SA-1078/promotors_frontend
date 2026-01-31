import { Button } from './Button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, totalItems, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-4 border-t border-dark-700 gap-4">
            <div className="text-sm text-gray-400">
                Página {currentPage} de {totalPages} • Total: {totalItems}
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="px-2 md:px-3 text-xs md:text-sm"
                >
                    <span className="hidden sm:inline">Primera</span>
                    <span className="sm:hidden">«</span>
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-2 md:px-3 text-xs md:text-sm"
                >
                    <span className="hidden sm:inline">Anterior</span>
                    <span className="sm:hidden">‹</span>
                </Button>
                <span className="px-3 md:px-4 text-white font-medium text-sm md:text-base">
                    {currentPage}
                </span>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-2 md:px-3 text-xs md:text-sm"
                >
                    <span className="hidden sm:inline">Siguiente</span>
                    <span className="sm:hidden">›</span>
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-2 md:px-3 text-xs md:text-sm"
                >
                    <span className="hidden sm:inline">Última</span>
                    <span className="sm:hidden">»</span>
                </Button>
            </div>
        </div>
    );
}
