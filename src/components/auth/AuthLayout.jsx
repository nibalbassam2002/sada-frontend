import React from 'react';
import './auth.css';
import authImg from '../../assets/auth-image.png';
import logo from '../../assets/logo.png';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-container">
      {/* الجزء الثابت: الصورة البرتقالية */}
      <div className="auth-visual">
        <div className="visual-content">
          <img src={authImg} alt="Presenter" className="floating-img" />
          <h2>The future of interaction is here.</h2>
          <p>Join thousands of presenters making their slides talk.</p>
        </div>
      </div>

      {/* الجزء المتغير: الذي يستقبلLoginForm أو RegisterForm */}
      <div className="auth-form-side">
        <div className="form-wrapper">
          <img src={logo} alt="SADA" className="auth-logo" />
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