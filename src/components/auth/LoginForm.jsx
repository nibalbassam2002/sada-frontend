import React, { useState, useEffect } from 'react';
import AuthLayout from './AuthLayout';
import { Mail, Lock, ArrowRight, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const user = params.get('user');
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', user);
      navigate('/dashboard');
    }
  }, [location, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/login', formData);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://sada-api-b5qk.onrender.com/api/auth/google';
  };

  const handleForgotPassword = async () => {
    const email = prompt('Please enter your email to reset password:');
    if (!email) return;
    try {
      const response = await api.post('/forgot-password', { email });
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Error sending email');
    }
  };

 const pageTitle = (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px' }}>
    <Link to="/" style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
      <ArrowLeft size={24} strokeWidth={2.5} />
      </Link>
      <span>Welcome Back</span>
    </div>
  );

  return (
    <AuthLayout title={pageTitle} subtitle="Enter your details to continue to SADA">
      <form onSubmit={handleLogin} style={{ marginTop: '24px' }}>

        {error && <div className="error-msg">{error}</div>}

        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-field">
            <Mail size={18} />
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="input-group">
          <div className="password-label-row">
            <label htmlFor="password">Password</label>
            <span className="forgot-link" onClick={handleForgotPassword}>
              Forgot password?
            </span>
          </div>
          <div className="input-field">
            <Lock size={18} />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              required
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>
        </div>

        <button type="submit" className="btn-auth-submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
          {!loading && <ArrowRight size={18} />}
        </button>
      </form>

      <div className="divider"><span>Or continue with</span></div>

      <button className="btn-google" type="button" onClick={handleGoogleLogin}>
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
        />
        <span>Sign in with Google</span>
      </button>

      <p className="auth-footer">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </AuthLayout>
  );
};

export default LoginForm;
