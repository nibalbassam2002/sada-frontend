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
    const email = prompt("Please enter your email to reset password:");
    if (!email) return;
    try {
      const response = await api.post('/forgot-password', { email });
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Error sending email");
    }
  };

  // تعريف العنوان مع سهم الرجوع ليكون بجانبه
  const pageTitle = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
      <Link to="/" style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
        <ArrowLeft size={26} strokeWidth={2.5} />
      </Link>
      <span>Welcome Back</span>
    </div>
  );

  return (
    <AuthLayout title={pageTitle} subtitle="Enter your details to continue to SADA">
      <form className="main-form" onSubmit={handleLogin} style={{ marginTop: '20px' }}>

        {error && <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>{error}</div>}

        <div className="input-group">
          <label>Email Address</label>
          <div className="input-field">
            <Mail size={18} color="#94a3b8" />
            <input
              type="email"
              placeholder="name@company.com"
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="input-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ marginBottom: 0 }}>Password</label>
            <span
              onClick={handleForgotPassword}
              className="forgot-link"
              style={{ cursor: 'pointer', color: '#f59e0b', fontSize: '12px', fontWeight: '500' }}
            >
              Forgot password?
            </span>
          </div>

          <div className="input-field">
            <Lock size={18} color="#94a3b8" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              required
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <div className="eye-icon" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>
        </div>

        <button type="submit" className="btn-auth-submit" disabled={loading}>
          {loading ? 'Processing...' : 'Login'} <ArrowRight size={18} />
        </button>
      </form>

      <div className="divider"><span>Or continue with</span></div>

      <button
        className="btn-google"
        type="button"
        onClick={handleGoogleLogin}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white', cursor: 'pointer' }}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" // رابط بديل أكثر استقراراً من قوقل مباشرة
          alt="Google"
          style={{ width: '20px', height: '20px', marginRight: '10px' }}
        />
        <span style={{ fontWeight: '600', color: '#334155' }}>Sign in with Google</span>
      </button>

      <p className="auth-footer">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </AuthLayout>
  );
};

export default LoginForm;