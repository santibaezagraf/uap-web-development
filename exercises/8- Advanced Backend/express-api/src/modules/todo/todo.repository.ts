import database from '../../db/connection';
import { Todo, MutateTodoDto, TodoQueryParams, PaginatedResponse } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export class TodoRepository {
    async getAllTodos(board_id: number, data: TodoQueryParams ): Promise<PaginatedResponse<Todo>> {
        const { filter, page = 1, limit = 10, search } = data;
        console.log("filter:", filter, "page:", page, "limit:", limit, "search:", search);
        
        const filterValue = filter === 'completed' ? 1 : filter === 'uncompleted' ? 0 : null;
        const hasSearch = search && search.trim() !== '';

        // Calcular OFFSET basado en la página
        const offset = (page - 1) * limit;
        let todos;
        let total;

        // Construir la consulta SQL
        let whereConditions = ['board_id = ?'];
        let queryParams: (number | string)[] = [board_id];
        let countParams: (number | string)[] = [board_id];

        // Agregar filtro de completado
        if (filterValue !== null) {
            whereConditions.push('completed = ?');
            queryParams.push(filterValue);
            countParams.push(filterValue);
        }

        // Si hay un filtro de búsqueda, agregar condiciones
        if (hasSearch) {
            const searchPattern = `%${search.trim()}%`;
            whereConditions.push('text LIKE ?');
            queryParams.push(searchPattern);
            countParams.push(searchPattern);
        }

        // generar un string con los elementos de whereConditions
        const whereClause = whereConditions.join(" AND ");

        // Consulta para obtener los todos paginados
        todos = await database.all<Todo>(
            `SELECT * FROM todos 
            WHERE ${whereClause}
            ORDER BY created_at ASC
            LIMIT ? OFFSET ?`,
            [...queryParams, limit, offset]
        );

        // Consulta para obtener el total
        total = await database.get<{count: number}>(
            `SELECT COUNT(*) as count FROM todos
            WHERE ${whereClause}`,
            countParams
        );
        
        console.log("Total todos:", total?.count);

        return { todos, total: total?.count || 0 };
    }

    async getTodoById(board_id: number, id: number,): Promise<Todo | undefined> {
        return database.get<Todo>(
            `SELECT * FROM todos 
            WHERE id = ? AND board_id = ?`,
            [id, board_id]
        );
    }

    async createTodo(board_id: number, data: MutateTodoDto): Promise<Todo> {
        const { text } = data;

        await database.run(
            `INSERT INTO todos (board_id, text, completed, created_at, updated_at) 
            VALUES ( ?, ?, ?, datetime('now'), datetime('now'))`,
            [ board_id, text, false]
        );

        // En SQLite, last_insert_rowid() obtiene el ID del último registro insertado
        const result = await database.get<{ id: number }>('SELECT last_insert_rowid() as id');
        const id = result?.id || 0;

        const todo = await this.getTodoById(board_id, id);
        if (!todo) {
            throw new Error('Failed to create todo');
        }
        
        return todo;
    }

    async updateTodo(board_id: number, id: number, data: MutateTodoDto): Promise<Todo | undefined> {
        const { text, } = data;

        await database.run(
            `UPDATE todos 
            SET text = ?, updated_at = datetime('now') 
            WHERE id = ? AND board_id = ?`,
            [text, id, board_id]
        );

        return this.getTodoById(board_id, id);
    }

    async toggleTodo(board_id: number, id: number): Promise<Todo | undefined> {
        const currentTodo = await database.get<{ completed: number }>(
        `SELECT completed FROM todos
        WHERE id = ? AND board_id = ?`,
        [id, board_id]
    );

        if (!currentTodo) {
            throw new Error('Todo not found');
        }

        const newCompletedValue = currentTodo.completed ? 0 : 1;

        await database.run(
            `UPDATE todos 
            SET completed = ?, updated_at = datetime('now') 
            WHERE id = ? AND board_id = ?`,
            [newCompletedValue, id, board_id]
        );

        return this.getTodoById(board_id, id);
    }

    async deleteTodo(board_id: number, id: number): Promise<boolean> {
        await database.run(
            `DELETE FROM todos 
            WHERE id = ? AND board_id = ?`, 
            [id, board_id]);
        return true;
    }

    async clearCompletedTodos(board_id: number): Promise<number> {
        console.log("Clearing completed todos for board_id:", board_id);
        const countResult = await database.get<{ count: number }>(
            `SELECT COUNT(*) as count FROM todos WHERE board_id = ? AND completed = 1`,
            [board_id]
        );
    
        await database.run(
            `DELETE FROM todos 
            WHERE board_id = ? AND completed = 1`, 
            [board_id]
        );
        return countResult?.count ?? 0;
    }

    async todoExists(board_id: number, id: number): Promise<boolean> {
        const todo = await this.getTodoById(board_id, id);
        return !!todo;
    }


}