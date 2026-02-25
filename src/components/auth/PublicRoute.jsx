import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // إذا وجدنا توكن، لا نسمح له بالبقاء في صفحة اللوجن، نطرده للداشبورد
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // إذا لم يجد توكن، نسمح له برؤية المحتوى (صفحة اللوجن أو الريجستر)
  return children;
};

export default PublicRoute;