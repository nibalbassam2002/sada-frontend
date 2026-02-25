import React from 'react';
import { NavLink } from 'react-router-dom';
// أضفنا أيقونة X هنا للإغلاق
import { LayoutDashboard, Presentation, FileText, Archive, Settings, LogOut, X } from 'lucide-react'; 
import logo from '../../assets/logo.png';

const Sidebar = ({ isSidebarOpen, setSidebarOpen, handleLogout }) => {
  
  // دالة صغيرة لإغلاق المنيو عند الضغط على رابط (تستخدم في الموبايل فقط)
  const closeMobileMenu = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <aside className={`sidebar-modern ${isSidebarOpen ? 'active' : ''}`}>
      <div className="sidebar-logo-container">
        <div className="echo-ring"></div>
        <div className="logo-wrapper">
          <img src={logo} alt="SADA" />
        </div>
        
        {/* زر الإغلاق: يظهر فقط في الشاشات الصغيرة عبر CSS */}
        <button className="mobile-close-btn" onClick={() => setSidebarOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <nav style={{ flex: 1, marginTop: '5px' }}>
        <NavLink 
          to="/dashboard" 
          end 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          onClick={closeMobileMenu}
        >
          <LayoutDashboard size={20} /> <span>Overview</span>
        </NavLink>

        <NavLink 
          to="/dashboard/presentations" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          onClick={closeMobileMenu}
        >
          <Presentation size={20} /> <span>Presentations</span>
        </NavLink>

        <NavLink 
          to="/dashboard/templates" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          onClick={closeMobileMenu}
        >
          <FileText size={20} /> <span>Templates</span>
        </NavLink>

        <NavLink 
          to="/dashboard/archive" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          onClick={closeMobileMenu}
        >
          <Archive size={20} /> <span>Archive</span>
        </NavLink>

        <NavLink 
          to="/dashboard/settings" 
          className="nav-item"
          onClick={closeMobileMenu}
        >
          <Settings size={20} /> <span>Preferences</span>
        </NavLink>
      </nav>

      <div style={{ paddingBottom: '30px' }}>
        <button
          onClick={handleLogout}
          className="nav-item logout-sidebar"
          style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '88%' }}
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;