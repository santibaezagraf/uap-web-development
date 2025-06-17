import { BASE_URL } from "./useTodos";
import { useQuery } from "@tanstack/react-query";
import type { Board } from "../types";

export function useBoards() {
    return useQuery({
        queryKey: ['boards'],
        queryFn: async () => {
            const response = await fetch(`${BASE_URL}/boards`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Error al cargar los tableros');
            }

            const data = await response.json();
            console.log("Boards fetched:", data);
            return data as Board[];
        }
    })
}