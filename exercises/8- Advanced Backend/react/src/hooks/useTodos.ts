import {useQuery} from '@tanstack/react-query';
import { useAppSelector } from '../store/hooks';
import { useAuth } from '../context/AuthContext';
// import type { TodoItem } from '../types';
// import { useFilter } from '../context/FilterContext'; //, type FilterContextType


export const BASE_URL = "http://localhost:3001/api";


interface TodoQueryParams {
  boardId?: number
  filter?: 'all' | 'completed' | 'uncompleted';
  page?: number;
  limit?: number;
  search?: number;
  enabled?: boolean; // Para controlar si la consulta está habilitada
}

/**
 * Hook para obtener tareas con filtro.
 * @param filter Filtro específico para las tareas. Si no se proporciona, usa el filtro del contexto.
 */
export function useTodos(params: TodoQueryParams = {}) { 

  const reduxFilter = useAppSelector((state) => state.ui.filter); 
  const currentBoardId = useAppSelector((state) => state.ui.currentBoardId);
  const searchText = useAppSelector((state) => state.ui.searchText);
  
  // ✅ Obtener configuraciones del usuario autenticado
  const { settings } = useAuth();
  
  // ✅ Usar todos_per_page de las configuraciones del usuario, con fallback
  const defaultTodosPerPage = settings?.todos_per_page || 10;

  let {
    boardId = currentBoardId,
    filter = reduxFilter,
    page = 1, 
    limit = defaultTodosPerPage, // ✅ Usar valor de configuraciones del usuario
    search = searchText,
    enabled = true 
  } = params;
  
  // ✅ Usar refresh_interval de las configuraciones del usuario para refetch
  const refetchInterval = settings?.refresh_interval || 5000;


  
  return useQuery({
    queryKey: ['todos', boardId, filter, page, limit, search],
    queryFn: async () => {
      console.log("useTodos filter:", filter)

      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const url = `${BASE_URL}/boards/${boardId}/todos?filter=${filter}&page=${page}&limit=${limit}${searchParam}`

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' // Asegurarse de enviar cookies para autenticación
      });

      if (!response.ok) {
        throw new Error('Error al cargar las tareas');
      }

      const data = await response.json();
      console.log("Todos fetched:", data);
      return data;
    },
    enabled,
    // Usar el intervalo de refetch desde la configuración global
    refetchInterval
  });
}