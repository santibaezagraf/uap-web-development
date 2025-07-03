import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import  { BoardsList }  from './components/BoardList';
import { Index } from './pages';
import { Settings } from './pages/settings';
import  { TodosPage }  from './components/TodosPage';
import { MainLayout } from './components/MainLayout';
import App  from './App';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginForm />,
  },
  {
    path: '/register', 
    element: <RegisterForm />,
  },

  // Redireccion inicial
  {
    path: '/',
    element: <Navigate to="/boards" replace />,
  },
  // ✅ Layout principal CON header para TODAS las rutas protegidas
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      // ✅ Todas estas rutas tendrán el header
      {
        path: 'boards',
        element: <BoardsList />,
      },
      {
        path: 'boards/:boardId',
        element: <Index />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'dashboard', // ✅ O como quieras llamar a tu página index
        element: <Index />,
      },
    ],
  },
]);
