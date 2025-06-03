import './App.css'
import { Header } from './components/Header'
import { AddToDoRefactored as AddToDo } from './components/AddToDoRefactored'
import { FilterTasksRefactored as FilterTasks } from './components/FilterTasksRefactored'
import { ToDoListRefactored as ToDoList } from './components/ToDoListRefactored'
import { ClearCompletedRefactored as ClearCompleted } from './components/ClearCompletedRefactored'
import { Toast } from './components/Toast'

function App() {
  return (
    <>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <main className='flex flex-col items-center bg-white flex-grow'>
          <AddToDo />
          <div className='w-1/2 my-5 mt-2 p-2 bg-[rgba(241,236,230,255)] rounded-3xl'>
            <FilterTasks />
            <ToDoList />
            <ClearCompleted />
          </div>
        </main>
        {/* Sistema de notificaciones */}
        <Toast />
      </div>
    </>
  )
}

export default App
