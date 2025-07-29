import { Navigate } from 'react-router-dom';
import { useAuth } from './auth.store';

const GuestRoute = ({ children }) => {
  const token = useAuth((s) => s.token);

  if (token) return <Navigate to="/app/home" replace />;

  return children;
};

export default GuestRoute;
