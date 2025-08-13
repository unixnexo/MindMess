import { createBrowserRouter, createHashRouter } from 'react-router-dom';
import Home from '../pages/home/Home';
import AuthPage from '../pages/auth/AuthPage';
import Layout from "../components/layout/Layout";
import VerifyPage from '../features/auth/VerifyPage';
import ProtectedRoute from '../features/auth/ProtectedRoute';
import GuestRoute from '../features/auth/GuestRoute';
import DrawingPage from '../pages/drawing/DrawingPage';
import NotFoundPage from '../pages/NotFoundPage';
import TasksPage from '../pages/task/TasksPage';

export const router = createHashRouter([

  // app (home, drawing, task)
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'project/:projectId/drawing', element: <DrawingPage /> },
      { path: 'project/:projectId/tasks', element: <TasksPage /> }
    ]
  },
  //

  // auth
  {
    path: '/',
    element: (
      <GuestRoute>
        <AuthPage />
      </GuestRoute>
    )

  },
  {
    path: '/auth/verify',
    element: (
      <GuestRoute>
        <VerifyPage />
      </GuestRoute>
    )
  },
  //

  // not found
  { path: '*', element: <NotFoundPage /> }
  //

]);