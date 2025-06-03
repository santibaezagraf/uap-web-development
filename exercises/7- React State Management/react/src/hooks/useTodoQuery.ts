import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { TodoItem } from '../types'

// Base URL para la API
const BASE_URL = "http://localhost:4321/api";

/**
 * Hook para obtener las tareas filtradas
 */
export function useTodos(filter: string = 'all') {
  return useQuery({
    queryKey: ['todos', filter],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/todos?filter=${filter}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar las tareas');
      }
      
      const data = await response.json();
      return data as TodoItem[];
    },
  });
}

/**
 * Hook para agregar una nueva tarea
 */
export function useAddTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch(`${BASE_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, action: 'add' }),
      });
      
      if (!response.ok) {
        throw new Error('Error al agregar la tarea');
      }
      
      const data = await response.json();
      return data as TodoItem[];
    },
    onSuccess: () => {
      // Invalidar cache para actualizar datos
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

/**
 * Hook para alternar el estado de una tarea
 */
export function useToggleTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle' }),
      });
      
      if (!response.ok) {
        throw new Error('Error al cambiar el estado de la tarea');
      }
      
      const data = await response.json();
      return data as TodoItem[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

/**
 * Hook para editar el texto de una tarea
 */
export function useEditTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, text }: { id: number; text: string }) => {
      const response = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'edit', text }),
      });
      
      if (!response.ok) {
        throw new Error('Error al editar la tarea');
      }
      
      const data = await response.json();
      return data as TodoItem[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

/**
 * Hook para eliminar una tarea
 */
export function useDeleteTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete' }),
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar la tarea');
      }
      
      const data = await response.json();
      return data as TodoItem[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

/**
 * Hook para eliminar todas las tareas completadas
 */
export function useClearCompletedTodos() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${BASE_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clearCompleted' }),
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar tareas completadas');
      }
      
      const data = await response.json();
      return data as TodoItem[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
