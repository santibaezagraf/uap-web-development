export type TodoItem = {
    id: number;
    text: string;
    completed: boolean;
    // boardId: number;
}

export interface Board {
    id: number;
    name: string;
    todos: TodoItem[];
    createdAt: Date;
}