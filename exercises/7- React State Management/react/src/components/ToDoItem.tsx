import type { TodoItem } from "../types";
import { useToggleTodo, useDeleteTodo } from "../hooks/UseTodoMutations";
import { addNotification, startEditing } from "../store/uiSlice";
import { useAppDispatch } from "../store/hooks";

type ToDoItemProps = {
    todo: TodoItem;
};

export function ToDoItemWithContext({ todo }: ToDoItemProps) {
    const { id, text, completed } = todo;
    const toggleMutation = useToggleTodo();
    const deleteMutation = useDeleteTodo();
    const dispatch = useAppDispatch();
    
    const handleToggle = () => {
        toggleMutation.mutate(id);
        dispatch(addNotification({
            message: `Task "${text}" ${completed ? 'uncompleted' : 'completed'} successfully!`,
            type: 'success' // , duration
        }))
    };
    
    const handleDelete = () => {
        deleteMutation.mutate(id);
        dispatch(addNotification({
            message: `Task "${text}" deleted successfully!`,
            type: 'success' // , duration
        }))
    };    const handleStartEditing = () => {
        dispatch(startEditing(todo));
        // Esto hará que el componente AddToDo cambie a modo edición
    };

    return (
        <li className="flex mt-2 items-center p-2">
            <button
                type="button"
                onClick={handleToggle}
                disabled={toggleMutation.isPending}
                className={`flex-shrink-0 bg-transparent border-2 border-gray-500 rounded-full py-2 px-3 mr-5 transition-all duration-500 cursor-pointer ${
                    completed ? 'border-orange-500 border-2 text-orange-500 font-extrabold' : 'text-transparent'
                } ${toggleMutation.isPending ? 'opacity-50' : ''}`}
                title="Toggle"
            >
                ✓
            </button>

            <p
                className={`flex-grow font-sans text-lg pb-2 mb-0 border-b border-[rgb(116,178,202)] transition-all duration-500 ${
                    completed ? 'line-through opacity-50 text-[rgb(158,151,151)]' : ''
                }`}
            >
                {text}
            </p>

            <button
                type="button"
                onClick={handleStartEditing}
                className="flex-shrink-0 bg-transparent border-0 text-blue-500 text-base px-2 cursor-pointer"
                title="Edit"
            >
                <i className="fa-solid fa-edit"></i>
            </button>

            <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className={`flex-shrink-0 bg-transparent border-0 text-orange-500 text-base px-2 cursor-pointer ${
                    deleteMutation.isPending ? 'opacity-50' : ''
                }`}
                title="Delete"
            >
                {deleteMutation.isPending ? '...' : <i className="fa-solid fa-trash"></i>}
            </button>
        </li>
    );
}
