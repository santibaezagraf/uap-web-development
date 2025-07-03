// import './App.css'
// import { Header } from './components/Header'
// import {  Outlet } from "@tanstack/react-router";
// import { useBoards } from './hooks/useBoards';
// // import { useAppDispatch, useAppSelector } from './store/hooks'



// export function App() {
//   console.log("App component rendered");
//   const boardsQuery = useBoards(); // Fetch boards on app load
// console.log('📊 Boards query state:', {
//       isLoading: boardsQuery.isLoading,
//       isFetching: boardsQuery.isFetching,
//       data: boardsQuery.data?.length
//   });


//   return (
//     <>
//       <div className='flex flex-col min-h-screen'>
//           <Header/>
//             {/* The Header component now contains the board navigation */}
          
//           <main className='flex flex-col items-center bg-white flex-grow'>
//               <Outlet />
//           </main>
//       </div>      
      
//     </>
//   )
// }

// export default App


import './App.css'
import { Header } from './components/Header'
import { Outlet, useParams } from "react-router-dom"; // ✅ Agregar useParams
import { useBoards } from './hooks/useBoards';
import { useAppDispatch } from './store/hooks'
import { setCurrentBoardId } from './store/uiSlice'
import { useEffect } from 'react'

export function App() {
  const dispatch = useAppDispatch();
  const { boardId } = useParams(); // ✅ SOLO agregar esto
  
  // ✅ SOLO agregar este useEffect
  useEffect(() => {
    if (boardId) {
      dispatch(setCurrentBoardId(parseInt(boardId, 10)));
    }
  }, [boardId, dispatch]);

  const boardsQuery = useBoards();

  return (
    <>
      <div className='flex flex-col min-h-screen'>
        <Header/>
        <main className='flex flex-col items-center bg-white flex-grow'>
          <Outlet />
        </main>
      </div>      
    </>
  )
}

export default App