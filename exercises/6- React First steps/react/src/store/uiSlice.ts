import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type TodoItem } from "../types"

interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

interface ModalState {
    isOpen: boolean;
    type: 'edit' | null;
    todo: TodoItem | null;
}

interface EditingState {
    isEditing: boolean;
    todoBeingEdited: TodoItem | null;
}

interface UIState {
    notifications: Notification[];
    modal: ModalState;
    editing: EditingState;
}

const initialState: UIState = {
    notifications: [],
    modal: {
        isOpen: false,
        type: null,
        todo: null
    },
    editing: {
        isEditing: false,
        todoBeingEdited: null
    }
}

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<{message: string; type: Notification['type'], duration?: number}>) => {
            const notification = {
                id: Date.now().toString(),
                message: action.payload.message,
                type: action.payload.type,
                duration: action.payload.duration || 3000
            };
            state.notifications.push(notification);
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(notification => notification.id !== action.payload);
        },

        openModal: (state, action: PayloadAction<{type: ModalState['type']; todo: ModalState['todo']}>) => {
            state.modal.isOpen = true;
            state.modal.type = action.payload.type;
            state.modal.todo = action.payload.todo;
        },
        closeModal: (state) => {
            state.modal.isOpen = false;
            state.modal.type = null;
            state.modal.todo = null;
        },
        
        // Acciones para manejo de edición directa
        startEditing: (state, action: PayloadAction<TodoItem>) => {
            state.editing.isEditing = true;
            state.editing.todoBeingEdited = action.payload;
        },
        
        cancelEditing: (state) => {
            state.editing.isEditing = false;
            state.editing.todoBeingEdited = null;
        }
    }
});

export const { 
    addNotification, 
    removeNotification, 
    openModal, 
    closeModal,
    startEditing,
    cancelEditing
} = uiSlice.actions;
export default uiSlice.reducer;