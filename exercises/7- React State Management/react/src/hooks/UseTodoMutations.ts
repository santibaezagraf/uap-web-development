import {useMutation, useQueryClient} from '@tanstack/react-query';
import type {TodoItem} from '../types';
import { useAppSelector } from '../store/hooks';
// import { useFilter } from '../context/FilterContext';

const BASE_URL = "http://localhost:4321/api";

/**
 * Hook para agregar una nueva tarea
 * */
export function  useAddTodo() {
    const queryClient = useQueryClient();
    const currentBoardId = useAppSelector((state) => state.ui.currentBoardId)
    // const { filter } = useFilter();
    
    return useMutation({
        mutationFn: async (text: string) => {
            const response = await fetch(`${BASE_URL}/boards/${currentBoardId}/todos/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({text, action: 'addTodo'}),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear la tarea');
            }
            
            return await response.json();
        },
        onSuccess: () => {
            // Invalidar cache para actualizar datos
            queryClient.invalidateQueries({queryKey: ['todos', currentBoardId]});
        },
        onError: (error) => {
            console.error("Error adding todo:", error);
            return error;
        }

    })
}

export function useDeleteTodo() {
    const queryClient = useQueryClient();
        const currentBoardId = useAppSelector((state) => state.ui.currentBoardId)
    // const { filter } = useFilter();
    
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`${BASE_URL}/boards/${currentBoardId}/todos/${id}`, {
                method: 'DELETE',
                // body: JSON.stringify({}),
                headers: {'Content-Type': 'application/json'},
            });
            return await response.json();
        },
        onSuccess: () => {
            // Invalidar cache para actualizar datos
            queryClient.invalidateQueries({queryKey: ['todos', currentBoardId]});
        }
    })
}

export function useToggleTodo() {
    const queryClient = useQueryClient();
    const currentBoardId = useAppSelector((state) => state.ui.currentBoardId)
    // const { filter } = useFilter();
    
    return useMutation({
        mutationFn: async (id: number) => {
            // console.log("currentBoardId:", currentBoardId)
            // console.log("todoId:", id)
            const response = await fetch(`${BASE_URL}/boards/${currentBoardId}/todos/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({action: 'toggle'}),
                headers: {'Content-Type': 'application/json'},
            });
            return await response.json();
        },
        onSuccess: () => {
            // Invalidar cache para actualizar datos
            queryClient.invalidateQueries({queryKey: ['todos', currentBoardId]});
        }
    })
}

export function useEditTodo() {
    const queryClient = useQueryClient();
    const currentBoardId = useAppSelector((state) => state.ui.currentBoardId)
    // const { filter } = useFilter();

    return useMutation({
        mutationFn: async ({id, text}: {id: number, text: string}) => {
            const response = await fetch(`${BASE_URL}/boards/${currentBoardId}/todos/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({text, action: 'edit'}),
                headers: {'Content-Type': 'application/json'},
            });
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['todos', currentBoardId]})
        }
    })
}

export function useClearCompletedTodos() {
    const queryClient = useQueryClient();
    const currentBoardId = useAppSelector((state) => state.ui.currentBoardId)
    // const { filter } = useFilter();
    
    return useMutation({
        mutationFn: async () => {
            const response = await fetch(`${BASE_URL}/boards/${currentBoardId}/todos`, {
                method: 'POST',
                body: JSON.stringify({action: 'clearCompleted'}),
                headers: {'Content-Type': 'application/json'},
            });
            return await response.json();
        },
        onSuccess: () => {
            // Invalidar cache para actualizar datos
            queryClient.invalidateQueries({queryKey: ['todos', currentBoardId]});
        }
    })
}

