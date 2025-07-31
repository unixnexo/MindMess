import { Navigate } from 'react-router-dom';
import { useAuth } from './auth.store';
import decodeJwtPayload from "../../lib/decodeJwtPayload";

const ProtectedRoute = ({ children }) => {
  const { token, logout } = useAuth();
  
  if (!token) return <Navigate to="/" replace />;
  
  // Check if token is expired (decode JWT payload)
  try {
    // const payload = JSON.parse(atob(token.split('.')[1]));
    const payload = decodeJwtPayload(token);
    if (payload.exp * 1000 < Date.now()) {
      logout();
      return <Navigate to="/" replace />;
    }
  } catch {
    logout();
    return <Navigate to="/" replace />;
  }

  return (
    <>
    {children}
    </>
  );
};

export default ProtectedRoute;