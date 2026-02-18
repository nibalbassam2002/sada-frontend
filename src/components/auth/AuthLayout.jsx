import React from 'react';
import './auth.css';
import authImg from '../../assets/auth-image.png';
import logo from '../../assets/logo.png';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-container">
      <div className="auth-visual">
         {/* أضفت لكِ تأثير "الدائرة الضوئية" خلف الصورة لمسة إبداعية */}
         <div style={{position: 'absolute', width: '300px', height: '300px', background: 'rgba(245,158,11,0.15)', borderRadius: '50%', filter: 'blur(100px)'}}></div>
         <div className="visual-content">
            <img src={authImg} alt="Presenter" className="floating-img" />
            <h2>Engage with SADA.</h2>
            <p>Make your presentations talk and your audience interact in real-time.</p>
         </div>
      </div>

      <div className="auth-form-side">
        <div className="form-wrapper">
          <div className="form-header">
            
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          {children} 
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;