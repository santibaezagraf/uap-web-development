export type TodoItem = {
    id: number;
    text: string;
    completed: boolean;
}

export interface Board {
    id: number;
    name: string;
    todos: TodoItem[];
    createdAt: Date;
}

export type filterType = 'all' | 'completed' | 'uncompleted';