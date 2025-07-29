import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/home/Home';
import AuthPage from '../pages/auth/AuthPage';
import Layout from "../components/layout/Layout";
import VerifyPage from '../features/auth/VerifyPage';
import ProtectedRoute  from '../features/auth/ProtectedRoute';
import GuestRoute  from '../features/auth/GuestRoute';

export const router = createBrowserRouter([
  {
    path: '/app',
    element: (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
    ),
    children: [
      { path: 'home', element: <Home /> }
    ]
  },
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
  {
    path: '*',
    // element: <NotFound />
  }
]);