import './App.css'
import { Header } from './components/Header'
import { AddToDo } from './components/AddToDo'
import { FilterTasksWithContext } from './components/FilterTasksWithContext'
import { ToDoListWithContext } from './components/ToDoListWithContext'
import { ClearCompletedWithContext } from './components/ClearCompletedWithContext'
import { FilterProvider } from './context/FilterContext'
import { Notifications } from './components/Notifications'
import { PaginationProvider } from './context/PaginationContext'
import { Pagination } from './components/Pagination'


function App() {

  return (
    <>
    <div>
      <div className='flex flex-col min-h-screen'>
          <Header/>
          <main className='flex flex-col items-center bg-white flex-grow'>
            <FilterProvider initialFilter='all'>
              <PaginationProvider initialPage={1} initialItemsPerPage={5}>
                <AddToDo/>
                <div className='w-1/2 my-5 mt-2 p-2 bg-[rgba(241,236,230,255)] rounded-3xl'>
                  <FilterTasksWithContext />
                  <ToDoListWithContext />
                  <ClearCompletedWithContext />
                  <Pagination/>

                </div>              
                <Notifications />
              </PaginationProvider>
            </FilterProvider>
          </main>
      </div>      
      
      
    </div>
    </>
  )
}

export default App
