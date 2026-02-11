import React from 'react';
import AuthLayout from './AuthLayout';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const LoginForm = () => {
  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Enter your details to continue to SADA"
    >
      <form className="main-form">
        <div className="input-group">
          <label>Email Address</label>
          <div className="input-field">
            <Mail size={18} />
            <input type="email" placeholder="name@company.com" />
          </div>
        </div>

        <div className="input-group">
          <label>Password</label>
          <div className="input-field">
            <Lock size={18} />
            <input type="password" placeholder="••••••••" />
          </div>
        </div>

        <button type="submit" className="btn-auth-submit">
          Login <ArrowRight size={18} />
        </button>
      </form>
      <p className="auth-footer">
        New here? <a href="/register">Create an account</a>
      </p>
    </AuthLayout>
  );
};

export default LoginForm;
