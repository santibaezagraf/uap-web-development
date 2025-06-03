import { useState } from 'react';
import type { TodoItem } from '../types';
import { useEditTodoStore } from '../store/todoStore';

type TodoItemProps = {
  todo: TodoItem;
  toggleTodo: () => void;
  deleteTodo: () => void;
};

export function ToDoItemRefactored({ todo, toggleTodo, deleteTodo }: TodoItemProps) {
  // Use edit store
  const { startEditing } = useEditTodoStore();
  
  // Handle edit button click
  const handleEdit = () => {
    startEditing(todo.id, todo.text);
  };

  return (
    <li className="flex mt-2 items-center p-2">
      <button
        onClick={toggleTodo}
        className={`flex-shrink-0 bg-transparent border-2 border-gray-500 rounded-full py-2 px-3 mr-5 transition-all duration-500 cursor-pointer ${
          todo.completed
            ? 'border-orange-500 border-2 text-orange-500 font-extrabold'
            : 'text-transparent'
        }`}
        title="Toggle"
      >
        ✓
      </button>

      <p
        className={`flex-grow font-sans text-lg pb-2 mb-0 border-b border-[rgb(116,178,202)] transition-all duration-500 ${
          todo.completed ? 'line-through opacity-50 text-[rgb(158,151,151)]' : ''
        }`}
      >
        {todo.text}
      </p>

      <div className="flex">
        {/* Edit button */}
        <button
          onClick={handleEdit}
          className="flex-shrink-0 bg-transparent border-0 text-blue-500 text-base px-2 cursor-pointer"
          title="Edit"
        >
          <i className="fa-solid fa-pencil"></i>
        </button>

        {/* Delete button */}
        <button
          onClick={deleteTodo}
          className="flex-shrink-0 bg-transparent border-0 text-orange-500 text-base px-2 cursor-pointer"
          title="Delete"
        >
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    </li>
  );
}
