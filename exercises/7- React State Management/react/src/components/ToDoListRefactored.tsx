import { useTodos, useToggleTodo, useDeleteTodo } from "../hooks/useTodoQuery";
import { useFilterStore, usePaginationStore } from "../store/todoStore";
import { ToDoItemRefactored as ToDoItem } from "./ToDoItemRefactored";
import { useToastStore } from "../store/todoStore";
import { Pagination } from "./Pagination";

export function ToDoListRefactored() {
    // Obtener el estado del filtro del store
    const { filter } = useFilterStore();
    
    // Obtener la paginación del store
    const { currentPage, itemsPerPage } = usePaginationStore();
    
    // Obtener las notificaciones del store
    const { addToast } = useToastStore();
    
    // Usar los hooks personalizados para las operaciones
    const { data: todos = [], isLoading, isError, error } = useTodos(filter);
    const toggleTodoMutation = useToggleTodo();
    const deleteTodoMutation = useDeleteTodo();

    // Función para alternar el estado de una tarea
    const handleToggleTodo = async (id: number) => {
        try {
            await toggleTodoMutation.mutateAsync(id);
            addToast({
                message: "Tarea actualizada exitosamente",
                type: "success"
            });
        } catch (error) {
            addToast({
                message: "Error al actualizar la tarea",
                type: "error"
            });
        }
    };

    // Función para eliminar una tarea
    const handleDeleteTodo = async (id: number) => {
        try {
            await deleteTodoMutation.mutateAsync(id);
            addToast({
                message: "Tarea eliminada exitosamente",
                type: "success"
            });
        } catch (error) {
            addToast({
                message: "Error al eliminar la tarea",
                type: "error"
            });
        }
    };

    // Mostrar estados de carga y error
    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                <span className="ml-2">Cargando tareas...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-red-500 p-4 text-center">
                Error al cargar las tareas: {error.message}
            </div>
        );
    }

    // Si no hay tareas, mostrar mensaje
    if (todos.length === 0) {
        return (
            <div className="text-gray-500 p-4 text-center">
                No hay tareas {filter !== 'all' ? `${filter === 'completed' ? 'completadas' : 'pendientes'}` : ''}
            </div>
        );
    }    // Calcular los elementos que se deben mostrar en la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedTodos = todos.slice(startIndex, endIndex);
    
    // Renderizar la lista de tareas
    return (
        <>
            <ul className="list-none p-0 m-0">
                {displayedTodos.map((todo) => (
                    <ToDoItem
                        key={todo.id}
                        todo={todo}
                        toggleTodo={() => handleToggleTodo(todo.id)}
                        deleteTodo={() => handleDeleteTodo(todo.id)}
                    />
                ))}
            </ul>
            
            {/* Mostrar la paginación */}
            <Pagination totalItems={todos.length} />
        </>
    );
}
