import { useClearCompletedTodos } from "../hooks/UseTodoMutations";
import { addNotification } from "../store/uiSlice";
import { useAppDispatch } from "../store/hooks";
import { useTodos } from "../hooks/useTodos";
// import { useQueryClient } from "@tanstack/react-query";

export function ClearCompletedWithContext() {
    // Usamos el hook que ahora internamente ya usa el contexto
    const clearCompleted= useClearCompletedTodos();
    const dispatch = useAppDispatch();
    // const queryClient = useQueryClient();
    // const queryData = queryClient.getQueriesData({ queryKey: ['todos'] });
    // console.log("ClearCompletedWithContext queryClient:", queryClient.getQueriesData({ queryKey: ['todos'] }));

    const { data: cachedData = { todos:[] }} = useTodos({ filter: 'completed' });
    const totalComlpletedItems = cachedData?.todos.length || 0; //pagination.totalItems


    // const completedTodos = cachedData?.todos || [];

    // const { data = {todos: []} } = useTodos({
    //     filter: 'completed' ,
    //     enabled: false 
    // });
    // console.log("ClearCompletedWithContext data:", data);
    // const completedTodos = data.todos || [];
    // console.log("Completed todos:", completedTodos);


    function handleClearCompleted() {
        if (totalComlpletedItems === 0) {
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
                {clearCompleted.isPending ? "Clearing..." : "Clear Completed"}
            </button>
        </div>
    );
}
