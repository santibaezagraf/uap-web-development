import './App.css'
import { Header } from './components/Header'
import {  Outlet } from "@tanstack/react-router";
// import { useAppDispatch, useAppSelector } from './store/hooks'



export function App() {
  // const dispatch = useAppDispatch();
  // const currentBoardId = useAppSelector(state => state.ui.currentBoardId);

  return (
    <>
      <div className='flex flex-col min-h-screen'>
          <Header/>
            {/* The Header component now contains the board navigation */}
          
          <main className='flex flex-col items-center bg-white flex-grow'>
              <Outlet />
          </main>
      </div>      
      
    </>
  )
}

export default App
