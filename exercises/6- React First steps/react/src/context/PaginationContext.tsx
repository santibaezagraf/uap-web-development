import { createContext, useContext, type ReactNode, useState } from "react";

export type PaginationContextType = {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    itemsPerPage: number;
    setItemsPerPage: (items: number) => void;
    totalItems: number;
    setTotalItems: (total: number) => void;
    totalPages: number;
    setTotalPages: (total: number) => void; // opcional, ya que no se usa en el provider
}

const PaginationContext = createContext<PaginationContextType | undefined>(undefined);

/**
 * Provider que almacena el estado de la paginación
 */
export function PaginationProvider({ children, initialPage = 1, initialItemsPerPage = 10}: { children: ReactNode; initialPage?: number; initialItemsPerPage?: number }) {
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [itemsPerPage, setItemsPerPage] = useState<number>(initialItemsPerPage);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    return (
        <PaginationContext.Provider value={{ currentPage, setCurrentPage, itemsPerPage, setItemsPerPage, totalItems, setTotalItems, totalPages, setTotalPages }}>
            {children}
        </PaginationContext.Provider>
    )
}

/**
 * Hook personalizado para acceder al contexto de la paginación
 */
export function usePagination() {
    const context = useContext(PaginationContext);
    if (context === undefined) {
        throw new Error('usePagination debe usarse dentro de un PaginationProvider');
    }
    return context;
} 