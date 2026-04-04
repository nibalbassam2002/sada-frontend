import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// استيراد المكونات والصفحات
import LandingPage from './pages/LandingPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Presentations from './pages/Presentations'; 
import Templates from './pages/Templates'; 
import Editor from './pages/Editor'; 
import JoinPage from './pages/JoinPage';
import SessionPage from './pages/SessionPage';
import DisplayPage from './pages/DisplayPage';


// استيراد أنظمة حماية المسارات
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute'; // هذا هو المكون الجديد

// مكونات وهمية مؤقتة
const Archive = () => <div className="p-8"><h1>صفحة الأرشيف</h1></div>;
const Settings = () => <div className="p-8"><h1>صفحة الإعدادات</h1></div>;

function App() {
  return (
    <Router>
      <Routes>
     
        <Route path="/" element={<LandingPage />} />
        <Route path="/join"       element={<JoinPage />} />  
        <Route path="/join/:code" element={<JoinPage />} />

       
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterForm />
            </PublicRoute>
          } 
        />
        
        {/* 3. مسارات المستخدمين (ممنوعة على الضيوف) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="presentations" element={<Presentations />} />
          <Route path="templates" element={<Templates />} />
          <Route path="archive" element={<Archive />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 4. مسار المحرر (محمي وخارج نطاق السايدبار) */}
        <Route 
          path="/editor/:id" 
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          } 
        />
<Route
  path="/session/:id"
  element={
    <ProtectedRoute>
      <SessionPage />
    </ProtectedRoute>
  }
/>
<Route path="/display/:sessionId" element={<DisplayPage />} />
      </Routes>
      
    </Router>
  );
  
}

export default App;