import './App.css'
import { Header } from './components/Header'
import { AddToDo } from './components/AddToDo'
import { FilterTasksWithContext } from './components/FilterTasks'
import { ToDoListWithContext } from './components/ToDoList'
import { ClearCompletedWithContext } from './components/ClearCompleted'
import { Notifications } from './components/Notifications'
import { useAppDispatch } from './store/hooks'
import { setCurrentPage } from './store/uiSlice'


function App() {
  const dispatch = useAppDispatch();

  return (
    <>
    <div>
      <div className='flex flex-col min-h-screen'>
          <Header/>
          <main className='flex flex-col items-center bg-white flex-grow'>
              
                <AddToDo/>
                <div className='w-1/2 my-5 mt-2 p-2 bg-[rgba(241,236,230,255)] rounded-3xl'>
                  <FilterTasksWithContext onFilterChange={() => dispatch(setCurrentPage(1))}/>
                  <ToDoListWithContext />
                  <ClearCompletedWithContext />

                </div>              
                <Notifications />

          </main>
      </div>      
      
      
    </div>
    </>
  )
}

export default App
