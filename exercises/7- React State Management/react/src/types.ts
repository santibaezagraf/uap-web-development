export type TodoItem = {
    id: number;
    text: string;
    completed: boolean;
}

export type filterType = 'all' | 'completed' | 'uncompleted';