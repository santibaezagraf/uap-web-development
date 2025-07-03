import { useAppDispatch, useAppSelector } from "../store/hooks";
import { closeModal, addNotification } from "../store/uiSlice";
import { useEditTodo } from "../hooks/UseTodoMutations";
import { useState, useEffect } from "react";

export function EditModal() {
    const dispatch = useAppDispatch();
    const { isOpen, type, todo } = useAppSelector((state) => state.ui.modal);
    const [text, setText] = useState("");
    const editMutation = useEditTodo();

    useEffect(() => {
        if (todo && type === 'edit') {
            setText(todo.text);
        }
    }, [todo]);

    if (!isOpen || type !== 'edit' || !todo) {
        return null;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!text.trim()) {
            return; // No empty text allowed
        }
        editMutation.mutate({ id: todo.id, text });
        dispatch(closeModal());
        dispatch(addNotification({
            message: `Task edited successfully!`,
            type: 'success'
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Edit Todo</h2>
                
                <form 
                    onSubmit={handleSubmit} 
                    className="flex flex-col gap-4"
                >
                    <div className="flex items-center bg-[rgba(241,236,230,255)] rounded-full p-0">
                        <input 
                            type="text" 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Update your todo" 
                            required 
                            className="flex-grow bg-transparent border-0 font-montserrat text-lg p-3 ml-2 focus:outline-none" 
                        />
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-2">
                        <button 
                            type="button" 
                            onClick={() => dispatch(closeModal())}
                            className="px-4 py-2 bg-gray-200 rounded-md"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={editMutation.isPending}
                            className="px-4 py-2 bg-[rgb(116,178,202)] text-white rounded-md"
                        >
                            {editMutation.isPending ? "Updating..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
