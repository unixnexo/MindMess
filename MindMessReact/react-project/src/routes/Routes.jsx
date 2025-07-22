import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import AuthPage from '../pages/auth/AuthPage';
import Layout from "../components/layout/Layout";

export const router = createBrowserRouter([
  {
    path: '/app',
    element: <Layout />,
    children: [
      { path: '/app/home', element: <Home /> }
    ]
  },
  { path: '/', element: <AuthPage /> },
  {
    path: '*',
    // element: <NotFound />
  }
]);