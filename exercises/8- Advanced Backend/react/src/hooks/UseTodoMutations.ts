import {useMutation, useQueryClient} from '@tanstack/react-query';
import { useAppSelector } from '../store/hooks';
import { todoService } from '../services/todoService';
// import { useFilter } from '../context/FilterContext';



/**
 * Hook para agregar una nueva tarea
 * */
export function  useAddTodo() {
    const queryClient = useQueryClient();
    const currentBoardId = useAppSelector((state) => state.ui.currentBoardId)
    
    return useMutation({
        mutationFn: async (text: string) => {
            return await todoService.createTodo(currentBoardId, { text });
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
    
    return useMutation({
        mutationFn: async (id: number) => {
            await todoService.deleteTodo(currentBoardId, id);
            return id; // Retornamos el ID para usar en onSuccess
        },
        onSuccess: (deletedId) => {
            // Actualizar cache directamente
            queryClient.setQueryData(
                ['todos', currentBoardId],
                (oldData: any) => {
                    if (!oldData || !oldData.todos) return oldData;
                    
                    // Filtrar el todo eliminado
                    const updatedTodos = oldData.todos.filter((todo: any) => todo.id !== deletedId);
                    const updatedCount = updatedTodos.length;
                    
                    // Retornar los datos actualizados
                    return { ...oldData, todos: updatedTodos, totalItems: updatedCount };
                }
            )

            // Invalidar cache para actualizar datos
            queryClient.invalidateQueries({
                queryKey: ['todos', currentBoardId],
                exact: false
            });
        },
    })
}

export function useToggleTodo() {
    const queryClient = useQueryClient();
    const currentBoardId = useAppSelector((state) => state.ui.currentBoardId)
    
    return useMutation({
        mutationFn: async (id: number) => {
            return await todoService.toggleTodo(currentBoardId, id);
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

    return useMutation({
        mutationFn: async ({id, text}: {id: number, text: string}) => {
            return await todoService.updateTodo(currentBoardId, id, { text });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['todos', currentBoardId]})
        }
    })
}

export function useClearCompletedTodos() {
    const queryClient = useQueryClient();
    const currentBoardId = useAppSelector((state) => state.ui.currentBoardId)

    return useMutation({
        mutationFn: async () => {
            console.log("Limpiando todos completados en el board:", currentBoardId);
            const result = await todoService.clearCompleted(currentBoardId);
            console.log("Todos completados eliminados:", result);
            return result;

        },
        onSuccess: () => {
            // Invalidar cache para actualizar datos
            queryClient.invalidateQueries({queryKey: ['todos', currentBoardId]});
        },
        onError: (error) => {
            console.error("Error clearing completed todos:", error);
            return error;
        }
    })
}

