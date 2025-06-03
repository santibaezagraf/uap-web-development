import { ToDoItemWithContext } from "./ToDoItemWithContext";
import { useEffect } from "react";
import { usePagination } from "../context/PaginationContext";
import { useTodos } from "../hooks/useTodos";

export function ToDoListWithContext() {
    // Usamos el hook que ahora internamente ya usa el contexto del filtro
    const { data: todos = [], isLoading, isError } = useTodos();
    const { currentPage, itemsPerPage, setTotalItems, setTotalPages } = usePagination();

    useEffect(() => {
        setTotalItems(todos.length);

        const calculatedTotalPages = Math.ceil(todos.length / itemsPerPage);
        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
    }), [todos, itemsPerPage, setTotalItems, setTotalPages];

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, todos.length);
    const paginatedTodos = todos.slice(startIndex, endIndex);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                <span className="ml-2">Loading tasks...</span>
            </div>
        );
    }
    
    if (isError) {
        return (
            <div className="text-red-500 p-4 text-center">
                Error loading tasks.
            </div>
        );
    }

    if (!todos || todos.length === 0) {
        return (
            <div className="text-gray-500 p-4 text-center">
                No available tasks
            </div>
        );
    }

    return (
            <ul className="list-none p-0 m-0">
                {paginatedTodos.map((todo) => (
                    <ToDoItemWithContext
                        key={todo.id}
                        todo={todo}
                    />
                ))}
            </ul>    
        
    );
}
