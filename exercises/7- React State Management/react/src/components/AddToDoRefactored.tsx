import { type FormEvent, useState } from "react";
import { useAddTodo } from "../hooks/useTodoQuery";
import { useToastStore } from "../store/todoStore";
import { useEditTodoStore } from "../store/todoStore";

export function AddToDoRefactored() {
    // Usar el hook para agregar tareas
    const addTodoMutation = useAddTodo();
    
    // Usar el store para notificaciones
    const { addToast } = useToastStore();
    
    // Usar el store para edición de tareas
    const { editingTodoId, editingTodoText, stopEditing, updateEditingText } = useEditTodoStore();
    
    // Estado local para el texto de la tarea
    const [text, setText] = useState("");
    
    // Actualizar el texto de la tarea cuando se edita
    const currentText = editingTodoId ? editingTodoText : text;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Verificar si hay un texto
        if (!currentText.trim()) {
            addToast({
                message: "Por favor, escribe algo para agregar una tarea",
                type: "error"
            });
            return;
        }

        try {
            await addTodoMutation.mutateAsync(currentText);
            addToast({
                message: editingTodoId ? "Tarea actualizada exitosamente" : "Tarea agregada exitosamente",
                type: "success"
            });
            
            // Limpiar el formulario
            if (editingTodoId) {
                stopEditing();
            } else {
                setText("");
            }
        } catch (error) {
            addToast({
                message: editingTodoId ? "Error al actualizar la tarea" : "Error al agregar la tarea",
                type: "error"
            });
        }
    };

    const handleCancelEdit = () => {
        stopEditing();
    };

    return (
        <form 
            onSubmit={handleSubmit}
            className="flex items-center bg-[rgba(241,236,230,255)] my-6 rounded-full w-1/2 p-0 relative"
        >
            <input 
                type="text" 
                value={currentText}
                onChange={editingTodoId 
                    ? (e) => updateEditingText(e.target.value) 
                    : (e) => setText(e.target.value)
                }
                placeholder="What do you need to do?" 
                className="flex-grow bg-transparent border-0 font-montserrat text-lg p-3 ml-2 focus:outline-none" 
                disabled={addTodoMutation.isPending}
            />
            
            {/* Botón de envío con indicador de carga */}
            <button 
                type="submit"
                disabled={addTodoMutation.isPending}
                className="flex-shrink-0 bg-[rgb(116,178,202)] border-0 text-white text-2xl rounded-r-full py-3 px-5 cursor-pointer"
            >
                {addTodoMutation.isPending ? "..." : editingTodoId ? "✓" : "+"}
            </button>
            
            {/* Botón para cancelar la edición */}
            {editingTodoId && (
                <button 
                    type="button" 
                    onClick={handleCancelEdit}
                    className="absolute right-16 top-1/2 transform -translate-y-1/2 text-red-500"
                >
                    ✕
                </button>
            )}
        </form>
    );
}
