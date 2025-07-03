import { BASE_URL } from "./useTodos";
import { useQuery } from "@tanstack/react-query";
import type { Board } from "../types";

interface UseBoardsOptions {
    enabled?: boolean; // Para controlar si la consulta está habilitada
}

export function useBoards(options: UseBoardsOptions = {}) {
    const { enabled = true } = options;

    return useQuery({
        queryKey: ['boards'],
        queryFn: async () => {
            const response = await fetch(`${BASE_URL}/boards`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Asegurarse de enviar cookies para autenticación
            });

            if (!response.ok) {
                throw new Error('Error al cargar los tableros');
            }

            const data = await response.json();
            console.log("Boards fetched:", data);
            return data as Board[];
        },
        enabled,
    })
}