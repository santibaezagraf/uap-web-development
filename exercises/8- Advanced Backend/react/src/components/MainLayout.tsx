// src/components/MainLayout.tsx
import React, { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { Header } from './Header';
import { useAppDispatch } from '../store/hooks';
import { setCurrentBoardId } from '../store/uiSlice';
import { useBoards } from '../hooks/useBoards';

export const MainLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { boardId } = useParams();
  
  // ✅ Mover la lógica del boardId aquí
  useEffect(() => {
    if (boardId) {
      dispatch(setCurrentBoardId(parseInt(boardId, 10)));
    }
  }, [boardId, dispatch]);

  const boardsQuery = useBoards();

  return (
    <div className='flex flex-col min-h-screen'>
      {/* ✅ Header aparece en TODAS las rutas protegidas */}
      <Header />
      
      <main className='flex flex-col items-center bg-white flex-grow'>
        {/* ✅ Aquí se renderizan las páginas hijas */}
        <Outlet />
      </main>
    </div>
  );
};