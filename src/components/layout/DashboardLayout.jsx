import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Bell, PlusCircle, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import defAvatarImg from '../../assets/def-image.png';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // مرجع (Ref) لإغلاق القائمة عند الضغط بالخارج
  const menuRef = useRef(null);

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
    name: "Dr. Abdulrahman",
    role: "Pro Presenter",
    profileImage: null 
  };

  const defaultAvatar = defAvatarImg; 

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      {/* تأكد من أن مكون Sidebar يستقبل handleLogout */}
      <Sidebar handleLogout={handleLogout} />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header className="top-navbar">
          <div className="search-container">
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Quick search..." style={{border:'none', background:'none', outline:'none', width:'100%'}} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Bell size={22} color="#64748b" style={{cursor:'pointer'}} />

            <div className="profile-section" ref={menuRef} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>
                  {user.name || "Guest User"}
                </div>
                <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>
                  {user.role}
                </div>
              </div>
              
              <div className="avatar-wrapper">
                <img 
                  className="user-avatar-styled" 
                  src={user.profileImage ? user.profileImage : defaultAvatar} 
                  alt="User Profile" 
                />
              </div>

              <ChevronDown size={14} color="#94a3b8" />

              <div className={`dropdown-menu ${isMenuOpen ? 'active' : ''}`}>
                <div className="dropdown-info-mobile" style={{padding: '10px 15px', display: 'flex', flexDirection: 'column'}}>
                   <strong style={{fontSize: '13px'}}>{user.name}</strong>
                   <span style={{fontSize: '11px', color: '#f59e0b'}}>{user.role}</span>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item">
                  <User size={17} /> <span>Profile Settings</span>
                </div>
                <div className="dropdown-item">
                  <Settings size={17} /> <span>System Preferences</span>
                </div>
                <div className="dropdown-divider"></div>
                <div className="nav-item logout-sidebar " onClick={handleLogout}>
                  <LogOut size={17} /> <span>Sign Out</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="page-content" style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;