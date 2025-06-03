import { create } from 'zustand';

// Interfaz para definir el tipo de estado del filtro
interface FilterState {
  filter: string;
  setFilter: (filter: string) => void;
}

// Store para la gestión del filtro
export const useFilterStore = create<FilterState>((set) => ({
  filter: 'all',
  setFilter: (filter: string) => set({ filter }),
}));

// Interfaz para el estado de notificaciones
interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

// Tipo para una notificación individual
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

// Store para la gestión de notificaciones
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => set((state) => ({
    toasts: [
      ...state.toasts,
      {
        id: Math.random().toString(36).substring(2, 9),
        ...toast,
        duration: toast.duration || 3000,
      },
    ],
  })),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((toast) => toast.id !== id),
  })),
}));

// Interfaz para el estado de edición de tareas
interface EditTodoState {
  editingTodoId: number | null;
  editingTodoText: string;
  startEditing: (id: number, text: string) => void;
  stopEditing: () => void;
  updateEditingText: (text: string) => void;
}

// Store para la gestión de la edición de tareas
export const useEditTodoStore = create<EditTodoState>((set) => ({
  editingTodoId: null,
  editingTodoText: '',
  startEditing: (id, text) => set({ editingTodoId: id, editingTodoText: text }),
  stopEditing: () => set({ editingTodoId: null, editingTodoText: '' }),
  updateEditingText: (text) => set({ editingTodoText: text }),
}));

// Store para gestionar la paginación (si se implementa)
interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
}

export const usePaginationStore = create<PaginationState>((set) => ({
  currentPage: 1,
  itemsPerPage: 5, // número de tareas por página
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (count) => set({ itemsPerPage: count }),
}));
