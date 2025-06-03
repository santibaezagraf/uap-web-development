import {useMutation, useQueryClient} from '@tanstack/react-query';
import type {TodoItem} from '../types';
// import { useFilter } from '../context/FilterContext';

const BASE_URL = "http://localhost:4321/api";

/**
 * Hook para agregar una nueva tarea
 * */
export function useAddTodo() {
    const queryClient = useQueryClient();
    // const { filter } = useFilter();
    
    return useMutation({
        mutationFn: async (text: string) => {
            const response = await fetch(`${BASE_URL}/todos`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({text, action: 'add'}),
            });
            return await response.json() as TodoItem[];
        },
        onSuccess: () => {
            // Invalidar cache para actualizar datos
            queryClient.invalidateQueries({queryKey: ['todos']});
        }
    })
}

export function useDeleteTodo() {
    const queryClient = useQueryClient();
    // const { filter } = useFilter();
    
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`${BASE_URL}/todos/${id}`, {
                method: 'POST',
                body: JSON.stringify({action: 'delete'}),
                headers: {'Content-Type': 'application/json'},
            });
            return await response.json() as TodoItem[];
        },
        onSuccess: () => {
            // Invalidar cache para actualizar datos
            queryClient.invalidateQueries({queryKey: ['todos']});
        }
    })
}

export function useToggleTodo() {
    const queryClient = useQueryClient();
    // const { filter } = useFilter();
    
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`${BASE_URL}/todos/${id}`, {
                method: 'POST',
                body: JSON.stringify({action: 'toggle'}),
                headers: {'Content-Type': 'application/json'},
            });
            return await response.json() as TodoItem[];
        },
        onSuccess: () => {
            // Invalidar cache para actualizar datos
            queryClient.invalidateQueries({queryKey: ['todos']});
        }
    })
}

export function useEditTodo() {
    const queryClient = useQueryClient();
    // const { filter } = useFilter();

    return useMutation({
        mutationFn: async ({id, text}: {id: number, text: string}) => {
            const response = await fetch(`${BASE_URL}/todos/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({text, action: 'edit'}),
                headers: {'Content-Type': 'application/json'},
            });
            return await response.json() as TodoItem[];
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['todos']})
        }
    })
}

export function useClearCompletedTodos() {
    const queryClient = useQueryClient();
    // const { filter } = useFilter();
    
    return useMutation({
        mutationFn: async () => {
            const response = await fetch(`${BASE_URL}/todos`, {
                method: 'POST',
                body: JSON.stringify({action: 'clearCompleted'}),
                headers: {'Content-Type': 'application/json'},
            });
            return await response.json() as TodoItem[];
        },
        onSuccess: () => {
            // Invalidar cache para actualizar datos
            queryClient.invalidateQueries({queryKey: ['todos']});
        }
    })
}

