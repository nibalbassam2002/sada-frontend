import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Presentation, FileText, Archive, Settings, LogOut } from 'lucide-react';
import logo from '../../assets/logo.png';

const Sidebar = ({ handleLogout }) => {
  return (
    <aside className="sidebar-modern">
      <div className="sidebar-logo-container">
        <div className="echo-ring"></div>
        <div className="logo-wrapper">
          <img src={logo} alt="SADA" />
        </div>
      </div>

      <nav style={{ flex: 1, marginTop: '5px' }}>
        <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <LayoutDashboard size={20} /> <span>Overview</span>
        </NavLink>
        <NavLink to="/dashboard/presentations" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <Presentation size={20} /> <span>Presentations</span>
        </NavLink>
        <NavLink to="/dashboard/templates" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FileText size={20} /> <span>Templates</span>
        </NavLink>
        <NavLink to="/dashboard/archive" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <Archive size={20} /> <span>Archive</span>
        </NavLink>
        <NavLink to="/dashboard/settings" className="nav-item">
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