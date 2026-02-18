import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // نستخدم 'token' لأنه هو نفس الاسم الذي تستخدمينه في LoginForm
  const token = localStorage.getItem('token'); 

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;