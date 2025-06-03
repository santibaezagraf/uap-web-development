import { useClearCompletedTodos } from "../hooks/UseTodoMutations";
import { addNotification } from "../store/uiSlice";
import { useAppDispatch } from "../store/hooks";
import { useTodos } from "../hooks/useTodos";

export function ClearCompletedWithContext() {
    // Usamos el hook que ahora internamente ya usa el contexto
    const clearCompleted= useClearCompletedTodos();
    const dispatch = useAppDispatch();
    const { data: todos = [] } = useTodos({filter: 'completed'});

    function handleClearCompleted() {
        if (todos.length === 0) {
            dispatch(addNotification({
                message: "No completed tasks to clear!!!",
                type: 'warning'
            }))
        } else {
            clearCompleted.mutate();
            dispatch(addNotification({
                message: "Completed tasks cleared successfully!",
                type: 'success' 
            }))
        }
    }

    return (
        <div>
            <button 
                type="button" 
                onClick={handleClearCompleted}
                disabled={clearCompleted.isPending}
                className="text-orange-500 mx-8 my-2 mt-24 ml-auto block text-right cursor-pointer border-0 bg-transparent"
            >
                {clearCompleted.isPending ? "Limpiando..." : "Clear Completed"}
            </button>
        </div>
    );
}
