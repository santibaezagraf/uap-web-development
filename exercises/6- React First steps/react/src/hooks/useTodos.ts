import {useQuery} from '@tanstack/react-query';
import type { TodoItem } from '../types';
import { useFilter } from '../context/FilterContext'; //, type FilterContextType

export const BASE_URL = "http://localhost:4321/api";

/**
 * Hook para obtener tareas con filtro.
 * @param filter Filtro específico para las tareas. Si no se proporciona, usa el filtro del contexto.
 */
export function useTodos(options: {
  filter?: 'all' | 'completed' | 'uncompleted',
  page?: number,
  limit?: number
} = {}) { //filter?: FilterContextType
  // const filter = explicitFilter ?? useFilter().filter; // Si no se pasa un filtro explícito, usa el del contexto
  const { filter = useFilter().filter, page = 1, limit = 10 } = options;
  
  
  return useQuery({
    queryKey: ['todos', filter],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/todos?filter=${filter}&page=${page}&limit${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Error al cargar las tareas');
      }

      const data = await response.json();
      return data.todos as TodoItem[];
    },
  });
}