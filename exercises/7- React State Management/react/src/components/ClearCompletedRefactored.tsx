import { useClearCompletedTodos } from "../hooks/useTodoQuery";
import { useToastStore } from "../store/todoStore";

export function ClearCompletedRefactored() {
    // Usar el custom hook para limpiar tareas completadas
    const clearCompletedMutation = useClearCompletedTodos();
    
    // Usar el store de notificaciones
    const { addToast } = useToastStore();

    const handleClearCompleted = async () => {
        try {
            await clearCompletedMutation.mutateAsync();
            addToast({
                message: "Tareas completadas eliminadas con éxito",
                type: "success"
            });
        } catch (error) {
            addToast({
                message: "Error al eliminar las tareas completadas",
                type: "error"
            });
        }
    };

    return (
        <button 
            type="button" 
            onClick={handleClearCompleted}
            className="text-orange-500 mx-8 my-2 mt-24 ml-auto block text-right cursor-pointer border-0 bg-transparent"
        >
            {clearCompletedMutation.isPending ? (
                <span className="flex items-center">
                    <span className="mr-2">Limpiando...</span>
                    <div className="h-4 w-4 border-t-2 border-b-2 border-orange-500 rounded-full animate-spin"></div>
                </span>
            ) : (
                "Clear Completed"
            )}
        </button>
    );
}
