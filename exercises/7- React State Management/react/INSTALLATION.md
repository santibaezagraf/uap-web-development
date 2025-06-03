# Installation Guide

To get started with the refactored Todo app using React Query and Zustand:

1. Install the dependencies:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools zustand
```

2. Replace the main React components with their refactored versions:

- `App.tsx` → `AppRefactored.tsx`
- `components/ToDoList.tsx` → `components/ToDoListRefactored.tsx`
- `components/FilterTasks.tsx` → `components/FilterTasksRefactored.tsx`
- `components/AddToDo.tsx` → `components/AddToDoRefactored.tsx`
- `components/ClearCompleted.tsx` → `components/ClearCompletedRefactored.tsx`

3. Add the new components:
- `components/Toast.tsx`
- `components/Pagination.tsx`
- `components/ToDoItemRefactored.tsx`

4. Set up the React Query Provider in `main.tsx` as shown in the generated file.

5. Add the custom hooks and stores:
- `hooks/useTodoQuery.ts`
- `store/todoStore.ts`

## Benefits of the Refactored Code

This refactored version offers several improvements:

1. **Separation of Concerns**: Server state is handled by React Query while client-only state is managed by Zustand.

2. **Better Error Handling**: The app now shows proper loading states and error messages.

3. **Toast Notifications**: Users receive feedback about their actions via toast notifications.

4. **Edit Functionality**: Users can now edit existing tasks.

5. **Pagination**: Tasks are paginated for better performance with large lists.

6. **Fewer Props**: Components now get their data directly from stores and hooks rather than through props.

7. **Optimistic Updates**: Some mutations can be implemented with optimistic updates for a snappier UI.

8. **Code Reusability**: Custom hooks make the logic reusable across different components.

9. **Devtools Support**: React Query includes devtools for debugging queries and mutations.
