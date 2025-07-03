import type { TodoItem, Board } from '../types';

let currentId = 5;
let boardId = 2;

const generateTodoId = () => {
    return ++currentId;
}

const generateBoardId = () => {
    return ++boardId;
}

const boards: Board[] = [
    {
        id: 1,
        name: "Personal",
        createdAt: new Date(),
        todos: [
            { id: 1, text: 'Aprender React', completed: false},
            { id: 2, text: 'Hacer la compra', completed: true},
            { id: 3, text: 'Limpiar la casa', completed: false},
            { id: 4, text: 'Estudiar para el examen', completed: true},
            { id: 5, text: 'Hacer ejercicio', completed: false},
        ]
    },
    {
        id: 2,
        name: "Profesional",
        createdAt: new Date(),
        todos: [
            { id: 1, text: 'Morir en Madrid', completed: false},
            { id: 2, text: 'Hacer un gol sacando del medio', completed: true},
            { id: 3, text: 'Irse a la B', completed: false},
            { id: 4, text: 'No clasificar al mundial por 3ra vez consecutiva', completed: true},
            { id: 5, text: 'Morir en Manchester', completed: false},
        ]
    }
]

// FUNCIONES BOARD

export const getBoards = () => {
    return boards;  
}

export const getBoard = (id: number) => {
    // console.log(boards)
    // console.log("getBoard() id:", id)
    const board = boards.find(board => board.id == id);
    // console.log(board);
    return board;
}

export const addBoard = (name: string) => {
    const newBoard: Board = { id: generateBoardId(), name, createdAt: new Date(), todos: [] };
    boards.push(newBoard);
    return newBoard
}

export const deleteBoard = (id: number) => {
    const index = boards.findIndex(board => board.id === id);
    if (index !== -1) {
        boards.splice(index, 1);
    }
}

export const editBoard = (id: number, name: string) => {
    const board = getBoard(id);
    if (board) {
        board.name = name;
    } else {
        console.error("Board not found!");
        return
    }
}

// FUNCIONES TODO

export const addTodo = async (boardId: number, text: string) => {
    const board = getBoard(boardId);
    if (!board) {
        console.error("Board not found!");
        throw new Error("Board not found")
    }

    const newTodo: TodoItem = { id: generateTodoId(), text, completed: false };
    board.todos.push(newTodo);
}

export const toggleTodo = (boardId: number, id: number) => {
    const board = getBoard(boardId);
    if (!board) {
        console.error("Board not found!");
        return new Error("Board not found")
    }

    const todo = board.todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed;
    }
}

export const deleteTodo = (boardId: number, id: number) => {
    const board = getBoard(boardId);
    if (!board) {
        console.error("Board not found!");
        return new Error("Board not found")
    }

    const index = board.todos.findIndex(todo => todo.id === id);
    board.todos.splice(index, 1);
}

export const editTodo = (boardId: number, text: string, id: number) => {
    const board = getBoard(boardId);
    if (!board) {
        console.error("Board not found!");
        return new Error("Board not found")
    }

    const todo = board.todos.find(todo => todo.id === id);
    if (todo) {
        todo.text = text;
    } else {
        console.log("Todo not found!")
    }
}

export const clearCompletedTodos = (boardId: number) => {
    const board = getBoard(boardId);
    if (!board) {
        console.error("Board not found!");
        return new Error("Board not found")
    }

    const remainingTodos = board.todos.filter(todo => !todo.completed);
    board.todos.length = 0;
    board.todos.push(...remainingTodos);
}

export const getFilteredTodos = (boardId: number, filter: string): TodoItem[] => {
    const board = getBoard(boardId);
    if (!board) {
        console.error("Board not found!");
        return [];
    }

    switch (filter) {
        case 'all':
            return board.todos;
        case 'uncompleted':
            return board.todos.filter(todo => !todo.completed);
        case 'completed':
            return board.todos.filter(todo => todo.completed);
        default:
            return board.todos;
    }
}

export function getPaginatedTodos(boardId: number, filter: string, page: number, limit: number) {
   
    const board = getBoard(boardId);
    //  console.log("boardId: ", boardId)
    // console.log("filter: ", filter)
    // console.log("page: ", page)
    // console.log("limit: ", limit)
    if (!board) {
        console.error("Board not found!");
        return {
            todos: [],
            pagination: {
                currentPage: 1,
                itemsPerPage: limit,
                totalItems: 0,
                totalPages: 1
            }
        };
    }

  // 1. Obtener las tareas filtradas
  const filteredTodos = getFilteredTodos(boardId, filter);
  
  // 2. Calcular metadatos de paginación
  const totalItems = filteredTodos.length;
  const totalPages = Math.ceil(totalItems / limit);
    // Asegurarse de que la página solicitada no exceda el número total de páginas
    page = Math.max(1, Math.min(page, totalPages));
    // if (page > totalPages) {
    //     page = 1;
    // }
    
  
  // 3. Obtener subconjunto de tareas para la página actual
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalItems);
  const paginatedTodos = filteredTodos.slice(startIndex, endIndex);
  
  // 4. Devolver tanto los datos como los metadatos de paginación
  return {
    todos: paginatedTodos,
    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      totalItems,
      totalPages: totalPages > 0 ? totalPages : 1 // Asegurarse de que siempre haya al menos una página 
    }
  };
}






// /**
//  * @typedef {Object} TodoItem
//  * @property {number} id - Unique identifier for the todo item
//  * @property {string} text - Text of the todo item
//  * @property {boolean} completed - Whether the todo item is completed
//  */

// let currentId = 0;
// /**
//  * Genera un id unico autoincremental para cada nuevo elemento
//  * @returns {number} 
//  */
// export function generateId() {
//     return ++currentId; 
// }

// /**
//  * @type {{ todos: TodoItem[] }} // indica el tipo de objetos que almacenara el array todos, propiedad de state
//  */
// export const state = {
//     todos: [], 
// };

// /**
//  * Agrega una nueva tarea
//  * @param {string} text
//  * @returns {TodoItem}
//  */
// export function addTodo(text) {
//     const newTodo = {
//         id: generateId(),
//         text,
//         completed: false,
//     };
//     state.todos.push(newTodo);
//     return newTodo;
//   }
  
//   /**
//    * Alterna el estado de completado de una tarea
//    * @param {number} id
//    */
// export function toggleTodo(id) {
//     const todo = state.todos.find((t) => t.id === id);
//     if (todo) {
//         todo.completed = !todo.completed;
//     }
// }

// /**
//    * Elimina una tarea por ID
//    * @param {number} id
//    */
// export function deleteTodo(id) {
//     state.todos = state.todos.filter((t) => t.id !== id);
// }
  
// /**
//    * Elimina todas las tareas completadas
// */
// export function clearCompletedTodos() {
//     state.todos = state.todos.filter((t) => !t.completed);
// }

// /**
//  * Obtiene las tareas filtradas por estado
//  * @param {string} filter - Puede ser 'all', 'uncompleted' o 'completed'
//  * @return {todos: TodoItem[]}
//  * */
// export function getFilteredTodos(filter) {
//     switch (filter) {
//         case 'all':
//             return state.todos;
//         case 'uncompleted':
//             return state.todos.filter((t) => !t.completed);
//         case 'completed':
//             return state.todos.filter((t) => t.completed);
//         default:
//             return state.todos;
//     }
// }
