import { type FormEvent, useEffect, useRef } from "react";
import { useAddTodo, useEditTodo } from "../hooks/UseTodoMutations";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addNotification, cancelEditing } from "../store/uiSlice";

export function AddToDo() {
    // Obtener estado de edición
    const { isEditing, todoBeingEdited } = useAppSelector(state => state.ui.editing);
    
    // Hooks para añadir y editar tareas
    const { mutate: addTodo, isPending: isAddPending } = useAddTodo();
    const { mutate: editTodo, isPending: isEditPending } = useEditTodo();
    const dispatch = useAppDispatch();
    
    // Referencia al input para enfocar automáticamente
    const inputRef = useRef<HTMLInputElement>(null);
    // Efecto para enfocar y rellenar el input cuando se inicia la edición
    useEffect(() => {
        if (isEditing && inputRef.current) {
            // Establecer el texto del todo en el input
            inputRef.current.value = todoBeingEdited?.text || '';
            // Enfocar el input
            inputRef.current.focus();
        }
    }, [isEditing, todoBeingEdited]);
    
    // Efecto para detectar la tecla Escape
    useEffect(() => {
        // Solo agregar el listener cuando estemos en modo edición
        if (isEditing) {
            const handleEscapeKey = (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                    handleCancelEdit();
                }
            };
            
            // Agregar listener global
            document.addEventListener('keydown', handleEscapeKey);
            
            // Limpieza cuando el componente se desmonte o isEditing cambie
            return () => {
                document.removeEventListener('keydown', handleEscapeKey);
            };
        }
    }, [isEditing]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const target = event.target as HTMLFormElement;
        const formData = new FormData(target);
        const text = formData.get("text")?.toString() || '';

        if (!text.trim()) {
            dispatch(addNotification({
                message: "Please enter a task!",
                type: 'warning'
            }));
            return;
        }

        if (isEditing && todoBeingEdited) {
            // Modo edición
            editTodo({ 
                id: todoBeingEdited.id, 
                text 
            });
            
            dispatch(addNotification({
                message: "Task updated successfully!",
                type: 'success'
            }));
            
            // Cancelar modo edición
            dispatch(cancelEditing());
        } else {
            // Modo añadir nueva tarea
            addTodo(text);
            
            dispatch(addNotification({
                message: "Task added successfully!",
                type: 'success'
            }));
        }
        
        // Resetear el formulario
        target.reset();
    }

    // Cancelar la edición
    function handleCancelEdit() {
        dispatch(cancelEditing());
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    const isPending = isEditing ? isEditPending : isAddPending;

    return (
        <form 
            onSubmit={handleSubmit} 
            action="/api/todos" 
            method="POST" 
            className="flex items-center bg-[rgba(241,236,230,255)] my-6 rounded-full w-1/2 p-0"
        >
            <input 
                ref={inputRef}
                type="text" 
                name="text" 
                id="input-todo" 
                placeholder={isEditing ? "Update task..." : "What do you need to do?"}
                className="flex-grow bg-transparent border-0 font-montserrat text-lg p-3 ml-2 focus:outline-none" 
            />
              {isEditing && (
                <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-shrink-0 bg-transparent text-gray py-3 px-4"
                >
                    ✕
                </button>
            )}
            
            <button 
                type="submit" 
                id="add-todo-btn" 
                name="action" 
                value={isEditing ? "edit" : "add"}
                className="flex-shrink-0 bg-[rgb(116,178,202)] border-0 text-white text-2xl rounded-r-full py-3 px-5 cursor-pointer"
            >
                {isPending ? "..." : isEditing ? "UPDATE" : "ADD"}
            </button>
        </form>
    );
}