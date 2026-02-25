import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Bell, User, Settings, LogOut, ChevronDown, Menu } from 'lucide-react';
import defAvatarImg from '../../assets/def-image.png';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuRef = useRef(null);

  // 1. جلب بيانات المستخدم من الذاكرة (localStorage)
  // نقوم بتحويل النص إلى Object باستخدام JSON.parse
  const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const user = {
    name: userData?.name || "User",
    email: userData?.email || "no-email@sada.ps", // جلب الإيميل
    profileImage: userData?.profileImage || null
  };

  const defaultAvatar = defAvatarImg;

  const handleLogout = () => {
    localStorage.clear(); // مسح كل بيانات الجلسة
    navigate('/login');
  };

  return (
    <div className="app-layout">
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
      />

      <div className="main-wrapper">
        <header className="top-navbar">

          <button className="mobile-hamburger" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>

          <div className="search-container">
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Quick search..." style={{ border: 'none', background: 'none', outline: 'none', width: '100%' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Bell size={22} color="#64748b" style={{ cursor: 'pointer' }} className="hide-mobile" />

            {/* منطقة البروفايل - أصبحت الآن ديناميكية */}
            <div className="profile-section" ref={menuRef} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div className="user-info-header">

                <div className="user-info-header">
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>
                    {user.name}
                  </div>
                  {/* هنا التغيير: عرض الإيميل بدلاً من الدور الوظيفي */}
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, marginTop: '2px' }}>
                    {user.email}
                  </div>
                </div>

              </div>

              <div className="avatar-wrapper">
                <img
                  className="user-avatar-styled"
                  src={user.profileImage ? user.profileImage : defaultAvatar}
                  alt="User Profile"
                />
              </div>

              <ChevronDown size={14} color="#94a3b8" className={isMenuOpen ? 'rotated' : ''} />

              <div className={`dropdown-menu ${isMenuOpen ? 'active' : ''}`}>
                <div className="dropdown-info-mobile">
                  <strong>{user.name}</strong>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{user.email}</span>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item">
                  <User size={17} /> <span>Profile Settings</span>
                </div>
                <div className="dropdown-item">
                  <Settings size={17} /> <span>System Preferences</span>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item logout-item" onClick={handleLogout}>
                  <LogOut size={17} /> <span>Sign Out</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;