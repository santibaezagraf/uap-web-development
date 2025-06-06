import {useQuery} from '@tanstack/react-query';
import { useAppSelector } from '../store/hooks';
// import type { TodoItem } from '../types';
// import { useFilter } from '../context/FilterContext'; //, type FilterContextType


export const BASE_URL = "http://localhost:4321/api";


interface TodoQueryParams {
  filter?: 'all' | 'completed' | 'uncompleted';
  page?: number;
  limit?: number;
  enabled?: boolean; // Para controlar si la consulta está habilitada
}

/**
 * Hook para obtener tareas con filtro.
 * @param filter Filtro específico para las tareas. Si no se proporciona, usa el filtro del contexto.
 */
export function useTodos(params: TodoQueryParams = {}) { //filter?: FilterContextType
  // const filter = explicitFilter ?? useFilter().filter; // Si no se pasa un filtro explícito, usa el del contexto

  const reduxFilter = useAppSelector((state) => state.ui.filter); // Asumiendo que tienes un store de Redux configurado

  let {
    filter = reduxFilter,
    page = 1, 
    limit = 7, 
    enabled = true 
  } = params;


  
  
  return useQuery({
    queryKey: ['todos', filter, page, limit],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/todos?filter=${filter}&page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Error al cargar las tareas');
      }

      const data = await response.json();
      console.log("Todos fetched:", data);
      return data;
    },
    enabled
  });
}