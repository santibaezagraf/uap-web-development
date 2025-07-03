import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from './useTodos';
import type { Board } from '../types';

export function useCreateBoard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (text: string) => {
            const response = await fetch(`${BASE_URL}/boards`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'createBoard', text }),
            });

            if (!response.ok) {
                throw new Error('Error al crear el tablero');
            }

            const data = await response.json() as Board;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards'] });
        }
    })
}

export function useDeleteBoard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (boardId: number) => {
            const response = await fetch(`${BASE_URL}/boards/${boardId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'deleteBoard' }),
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el tablero');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards'] });
        }
    })
}

export function useEditBoard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ boardId, text }: { boardId: number; text: string }) => {
            const response = await fetch(`${BASE_URL}/boards/${boardId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'editBoard', text }),
            });

            if (!response.ok) {
                throw new Error('Error al editar el tablero');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards'] });
        }
    })
}